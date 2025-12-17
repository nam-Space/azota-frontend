import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlide";
import accountSlide from "./slice/accountSlide";
import themeSlide from "./slice/themeSlide";
import exerciseSlide from "./slice/exerciseSlide";
import groupSlide from "./slice/groupSlide";
import schoolYearSlide from "./slice/schoolYearSlide";
import classroomSlide from "./slice/classroomSlide";
import gradeSlide from "./slice/gradeSlide";
import subjectSlide from "./slice/subjectSlide";
import classroomExerciseSlide from "./slice/classroomExerciseSlide";
import userClassroomSlide from "./slice/userClassroomSlide";
import historySlide from "./slice/history";
import answerHistorySlide from "./slice/answerHistory";
import questionSlide from "./slice/questionSlide";
import answerSlide from "./slice/answerSlide";
import roleSlide from "./slice/roleSlide";
import permissionSlide from "./slice/permissionSlide";
import rolePermissionSlide from "./slice/rolePermission";

export const store = configureStore({
    reducer: {
        user: userReducer,
        account: accountSlide,
        theme: themeSlide,
        exercise: exerciseSlide,
        group: groupSlide,
        schoolYear: schoolYearSlide,
        classroom: classroomSlide,
        grade: gradeSlide,
        subject: subjectSlide,
        classroomExercise: classroomExerciseSlide,
        userClassroom: userClassroomSlide,
        history: historySlide,
        answerHistory: answerHistorySlide,
        question: questionSlide,
        answer: answerSlide,
        role: roleSlide,
        permission: permissionSlide,
        rolePermission: rolePermissionSlide,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
