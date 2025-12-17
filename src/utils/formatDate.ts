import { VI } from "@/constants/language";
import dayjs from "dayjs";

export const formatDate = (inputDate: string, lang = VI) => {
    const daysOfWeek =
        lang === VI
            ? ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
            : [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
              ];

    const dateParts = inputDate.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    const formattedDate = new Date(`${year}-${month}-${day}`);
    const dayOfWeek = daysOfWeek[formattedDate.getDay()];

    return `${dayOfWeek}, ${
        lang === VI ? `Ngày ${day}/${month}/${year}` : `${month}-${day}-${year}`
    } `;
};

function pad(num: number) {
    return (num < 10 ? "0" : "") + num;
}

export const formatMinute = (millis: number) => {
    // Chuyển đổi millisecond thành giây
    var seconds = Math.floor(millis / 1000);
    // Tính số giờ
    var hours = Math.floor(seconds / 3600);
    // Tính số phút
    var minutes = Math.floor((seconds % 3600) / 60);
    // Tính số giây
    var secs = seconds % 60;

    // Định dạng chuỗi kết quả
    var formattedTime = pad(hours) + ":" + pad(minutes) + ":" + pad(secs);

    return formattedTime;
};

export const checkStudentSubmitTaskOrWaiting = (
    datetimeScoreMilliseconds: number,
    timeEndMilliseconds: number,
    score: number
) => {
    return (
        (!datetimeScoreMilliseconds &&
            new Date().getTime() <= timeEndMilliseconds) ||
        (datetimeScoreMilliseconds &&
            datetimeScoreMilliseconds <= timeEndMilliseconds &&
            score >= 5)
    );
};

export const changeDatetimeToPostman = (value: string) => {
    if (value.includes("T")) return value;
    return dayjs(value, "DD/MM/YYYY HH:mm:ss").toDate();
};
