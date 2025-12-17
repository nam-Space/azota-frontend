import {
    IBackendRes,
    IAccount,
    IUser,
    IModelPaginate,
    IGetAccount,
    IExercise,
    IGroup,
    IClassroom,
    ISchoolYear,
    IGrade,
    ISubject,
    IQuestion,
    IAnswer,
    IClassroomExercise,
    IUserClassroom,
    IHistory,
    IAnswerHistory,
    IRole,
    IPermission,
    IRolePermission,
    IUpdateUserPassword,
    IGenerateTokenPasswordDto,
    IMail,
    IUserByEmailAndPasswordToken,
    ILeaveRoom,
} from "@/types/backend";
import axios from "./axios-customize";

/**
 * 
Module Auth
 */
export const callRegister = (
    name: string,
    email: string,
    password: string,
    gender: string
) => {
    return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
        name,
        email,
        password,
        gender,
    });
};

export const callLogin = (email: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
        username: email,
        password,
    });
};

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>("/api/v1/auth/refresh");
};

export const callLogout = () => {
    return axios.post<IBackendRes<string>>("/api/v1/auth/logout");
};

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folderType: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append("fileUpload", file);
    return axios<IBackendRes<{ fileName: string }>>({
        method: "post",
        url: "/api/v1/file/upload",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            folder_type: folderType,
        },
    });
};

/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>("/api/v1/user", { ...user });
};

export const callUpdateUser = (id: number, user: IUser) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/user/${id}`, { ...user });
};

export const callUpdateUserProfile = (id: number, user: IUser) => {
    return axios.patch<IBackendRes<IUser>>(
        `/api/v1/user/update-profile/${id}`,
        {
            ...user,
        }
    );
};

export const callUpdateUserPassword = (
    id: number,
    data: IUpdateUserPassword
) => {
    return axios.patch<IBackendRes<IUser>>(
        `/api/v1/user/change-password/${id}`,
        {
            ...data,
        }
    );
};

export const callDeleteUser = (id: number) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/user/${id}`);
};

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(
        `/api/v1/user?${query}`
    );
};

export const callFetchUserById = (id: number) => {
    return axios.get<IBackendRes<IUser>>(`/api/v1/user/${id}`);
};

export const callGetUserByEmailAndPasswordToken = (
    data: IUserByEmailAndPasswordToken
) => {
    return axios.post<IBackendRes<IUser>>(
        "/api/v1/user/get-user-by-email-and-password-token",
        { ...data }
    );
};

export const callUpdateUserPasswordForLogin = (
    id: number,
    data: IUpdateUserPassword
) => {
    return axios.patch<IBackendRes<IUser>>(
        `/api/v1/user/change-password-for-login/${id}`,
        {
            ...data,
        }
    );
};

/**
 * 
Module Mail
 */
export const callGenerateTokenPassword = (data: IGenerateTokenPasswordDto) => {
    return axios.post<IBackendRes<IMail>>(
        `/api/v1/mail/generate-token-password`,
        { ...data }
    );
};

/**
 * 
Module Role
 */
export const callCreateRole = (role: IRole) => {
    return axios.post<IBackendRes<IRole>>("/api/v1/role", { ...role });
};

export const callUpdateRole = (id: number, role: IRole) => {
    return axios.patch<IBackendRes<IUser>>(`/api/v1/role/${id}`, { ...role });
};

export const callDeleteRole = (id: number) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/role/${id}`);
};

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(
        `/api/v1/role?${query}`
    );
};

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/role/${id}`);
};

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>("/api/v1/permission", {
        ...permission,
    });
};

export const callUpdatePermission = (id: number, permission: IPermission) => {
    return axios.patch<IBackendRes<IPermission>>(`/api/v1/permission/${id}`, {
        ...permission,
    });
};

export const callDeletePermission = (id: number) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permission/${id}`);
};

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(
        `/api/v1/permission?${query}`
    );
};

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permission/${id}`);
};

/**
 * 
Module Role Permission
 */
export const callCreateRolePermission = (rolePermission: IRolePermission) => {
    return axios.post<IBackendRes<IRolePermission>>("/api/v1/role-permission", {
        ...rolePermission,
    });
};

export const callUpdateRolePermission = (
    id: number,
    rolePermission: IRolePermission
) => {
    return axios.patch<IBackendRes<IRolePermission>>(
        `/api/v1/role-permission/${id}`,
        {
            ...rolePermission,
        }
    );
};

export const callDeleteRolePermission = (id: number) => {
    return axios.delete<IBackendRes<IRolePermission>>(
        `/api/v1/role-permission/${id}`
    );
};

export const callFetchRolePermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRolePermission>>>(
        `/api/v1/role-permission?${query}`
    );
};

export const callFetchRolePermissionById = (id: string) => {
    return axios.get<IBackendRes<IRolePermission>>(
        `/api/v1/role-permission/${id}`
    );
};

export const callInsertAndDeleteRolePermission = (
    roleId: number,
    permissionsId: number[]
) => {
    return axios.post<IBackendRes<IRolePermission>>(
        `/api/v1/role-permission/insertAndDelete?roleId=${roleId}`,
        [...permissionsId]
    );
};

/**
 * 
Module exercise
 */
export const callFetchExercise = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IExercise>>>(
        `/api/v1/exercise?${query}`
    );
};

export const callFetchExerciseById = (id: number) => {
    return axios.get<IBackendRes<IExercise>>(`/api/v1/exercise/${id}`);
};

export const callCreateExercise = (exercise: IExercise) => {
    return axios.post<IBackendRes<IExercise>>(`/api/v1/exercise`, {
        ...exercise,
    });
};

export const callUpdateExercise = (exercise: IExercise, id: number) => {
    return axios.patch<IBackendRes<IExercise>>(`/api/v1/exercise/${id}`, {
        ...exercise,
    });
};

export const callDeleteExercise = (id: number) => {
    return axios.delete<IBackendRes<IExercise>>(`/api/v1/exercise/${id}`);
};

/**
 * 
Module Group
 */

export const callFetchGroup = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IGroup>>>(
        `/api/v1/group?${query}`
    );
};

export const callFetchGroupById = (id: string) => {
    return axios.get<IBackendRes<IGroup>>(`/api/v1/group/${id}`);
};

export const callCreateGroup = (groupName: string) => {
    return axios.post<IBackendRes<IGroup>>(`/api/v1/group`, {
        name: groupName,
    });
};

export const callUpdateGroup = (group: IGroup, id: number) => {
    return axios.patch<IBackendRes<IGroup>>(`/api/v1/group/${id}`, {
        ...group,
    });
};

export const callDeleteGroup = (id: number) => {
    return axios.delete<IBackendRes<IGroup>>(`/api/v1/group/${id}`);
};

/**
 * 
Module Classroom
 */

export const callFetchClassroom = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IClassroom>>>(
        `/api/v1/classroom?${query}`
    );
};

export const callFetchClassroomById = (id: number) => {
    return axios.get<IBackendRes<IClassroom>>(`/api/v1/classroom/${id}`);
};

export const callFetchClassroomByClassroomToken = (classroomToken: string) => {
    return axios.post<IBackendRes<IClassroom>>(
        `/api/v1/classroom/by-classroomToken?classroomToken=${classroomToken}`
    );
};

export const callCreateClassroom = (classroom: IClassroom) => {
    return axios.post<IBackendRes<IClassroom>>(`/api/v1/classroom`, {
        ...classroom,
    });
};

export const callUpdateClassroom = (classroom: IClassroom, id: number) => {
    return axios.patch<IBackendRes<IClassroom>>(`/api/v1/classroom/${id}`, {
        ...classroom,
    });
};

export const callDeleteClassroom = (id: number) => {
    return axios.delete<IBackendRes<IClassroom>>(`/api/v1/classroom/${id}`);
};

/**
 * 
Module UserClassroom
 */

export const callFetchUserClassroom = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUserClassroom>>>(
        `/api/v1/user-classroom?${query}`
    );
};

export const callFetchUserClassroomById = (id: number) => {
    return axios.get<IBackendRes<IUserClassroom>>(
        `/api/v1/user-classroom/${id}`
    );
};

export const callCreateUserClassroom = (userClassroom: IUserClassroom) => {
    return axios.post<IBackendRes<IUserClassroom>>(`/api/v1/user-classroom`, {
        ...userClassroom,
    });
};

export const callUpdateUserClassroom = (
    userClassroom: IUserClassroom,
    id: number
) => {
    return axios.patch<IBackendRes<IUserClassroom>>(
        `/api/v1/user-classroom/${id}`,
        {
            ...userClassroom,
        }
    );
};

export const callDeleteUserClassroom = (id: number) => {
    return axios.delete<IBackendRes<IUserClassroom>>(
        `/api/v1/user-classroom/${id}`
    );
};

export const callLeaveRoom = (leaveRoom: ILeaveRoom) => {
    return axios.post<IBackendRes<IUserClassroom>>(
        `/api/v1/user-classroom/leave-room`,
        {
            ...leaveRoom,
        }
    );
};

export const callFetchUserClassroomByUserIdAndClassroomId = (query: string) => {
    return axios.post<IBackendRes<IUserClassroom>>(
        `/api/v1/user-classroom/find-by-userId-and-classroomId?${query}`
    );
};

/**
 * 
Module ClassroomExercise
 */

export const callFetchClassroomExercise = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IClassroomExercise>>>(
        `/api/v1/classroom-exercise?${query}`
    );
};

export const callFetchClassroomExerciseById = (id: number) => {
    return axios.get<IBackendRes<IClassroomExercise>>(
        `/api/v1/classroom-exercise/${id}`
    );
};

export const callFetchClassroomExerciseByClassroomIdAndExerciseId = (
    classroomId: number,
    exerciseId: number
) => {
    return axios.post<IBackendRes<IClassroomExercise>>(
        `/api/v1/classroom-exercise/by-classroomId-and-exerciseId?classroomId=${classroomId}&exerciseId=${exerciseId}`
    );
};

export const callCreateClassroomExercise = (
    classroomExercise: IClassroomExercise
) => {
    return axios.post<IBackendRes<IClassroomExercise>>(
        `/api/v1/classroom-exercise`,
        {
            ...classroomExercise,
        }
    );
};

export const callUpdateClassroomExercise = (
    classroomExercise: IClassroomExercise,
    id: number
) => {
    return axios.patch<IBackendRes<IClassroomExercise>>(
        `/api/v1/classroom-exercise/${id}`,
        {
            ...classroomExercise,
        }
    );
};

export const callDeleteClassroomExercise = (id: number) => {
    return axios.delete<IBackendRes<IClassroomExercise>>(
        `/api/v1/classroom-exercise/${id}`
    );
};

/**
 * 
Module History
 */

export const callFetchHistory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IHistory>>>(
        `/api/v1/history?${query}`
    );
};

export const callFetchHistoryByClassroomExerciseIdAndUserId = (
    classroomExerciseId: number,
    userId: number
) => {
    return axios.post<IBackendRes<IHistory>>(
        `/api/v1/history/by-classroomExerciseId-and-userId?classroomExerciseId=${classroomExerciseId}&userId=${userId}`
    );
};

export const callFetchHistoryById = (id: number) => {
    return axios.get<IBackendRes<IHistory>>(`/api/v1/history/${id}`);
};

export const callCreateHistory = (history: IHistory) => {
    return axios.post<IBackendRes<IHistory>>(`/api/v1/history`, {
        ...history,
    });
};

export const callUpdateHistory = (history: IHistory, id: string) => {
    return axios.patch<IBackendRes<IHistory>>(`/api/v1/history/${id}`, {
        ...history,
    });
};

export const callDeleteHistory = (id: number) => {
    return axios.delete<IBackendRes<IHistory>>(`/api/v1/history/${id}`);
};

/**
 * 
Module History
 */

export const callFetchAnswerHistory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IAnswerHistory>>>(
        `/api/v1/answer-history?${query}`
    );
};

export const callFetchAnswerHistoryById = (id: string) => {
    return axios.get<IBackendRes<IAnswerHistory>>(
        `/api/v1/answer-history/${id}`
    );
};

export const callCreateAnswerHistory = (answerHistory: IAnswerHistory) => {
    return axios.post<IBackendRes<IAnswerHistory>>(`/api/v1/answer-history`, {
        ...answerHistory,
    });
};

export const callCreateBulkAnswerHistory = (
    bulkAnswerHistory: IAnswerHistory[]
) => {
    return axios.post<IBackendRes<IAnswerHistory[]>>(
        `/api/v1/answer-history/create-bulk`,
        [...bulkAnswerHistory]
    );
};

export const callUpdateAnswerHistory = (
    answerHistory: IAnswerHistory,
    id: string
) => {
    return axios.patch<IBackendRes<IAnswerHistory>>(
        `/api/v1/answer-history/${id}`,
        {
            ...answerHistory,
        }
    );
};

export const callDeleteAnswerHistory = (id: string) => {
    return axios.delete<IBackendRes<IAnswerHistory>>(
        `/api/v1/answer-history/${id}`
    );
};

/**
 * 
Module SchoolYear
 */

export const callFetchSchoolYear = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISchoolYear>>>(
        `/api/v1/school-year?${query}`
    );
};

export const callFetchSchoolYearById = (id: string) => {
    return axios.get<IBackendRes<ISchoolYear>>(`/api/v1/school-year/${id}`);
};

export const callCreateSchoolYear = (schoolYear: ISchoolYear) => {
    return axios.post<IBackendRes<ISchoolYear>>(`/api/v1/school-year`, {
        ...schoolYear,
    });
};

export const callUpdateSchoolYear = (schoolYear: ISchoolYear, id: number) => {
    return axios.patch<IBackendRes<ISchoolYear>>(`/api/v1/school-year/${id}`, {
        ...schoolYear,
    });
};

export const callDeleteSchoolYear = (id: number) => {
    return axios.delete<IBackendRes<ISchoolYear>>(`/api/v1/school-year/${id}`);
};

/**
 * 
Module Grade
 */

export const callFetchGrade = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IGrade>>>(
        `/api/v1/grade?${query}`
    );
};

export const callFetchGradeById = (id: string) => {
    return axios.get<IBackendRes<IGrade>>(`/api/v1/grade/${id}`);
};

export const callCreateGrade = (gradeName: string) => {
    return axios.post<IBackendRes<IGrade>>(`/api/v1/grade`, {
        name: gradeName,
    });
};

export const callUpdateGrade = (grade: IGrade, id: number) => {
    return axios.patch<IBackendRes<IGrade>>(`/api/v1/grade/${id}`, {
        ...grade,
    });
};

export const callDeleteGrade = (id: number) => {
    return axios.delete<IBackendRes<IGrade>>(`/api/v1/grade/${id}`);
};

/**
 * 
Module Subject
 */

export const callFetchSubject = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubject>>>(
        `/api/v1/subject?${query}`
    );
};

export const callFetchSubjectById = (id: string) => {
    return axios.get<IBackendRes<ISubject>>(`/api/v1/subject/${id}`);
};

export const callCreateSubject = (subjectName: string) => {
    return axios.post<IBackendRes<ISubject>>(`/api/v1/subject`, {
        name: subjectName,
    });
};

export const callUpdateSubject = (subject: ISubject, id: number) => {
    return axios.patch<IBackendRes<ISubject>>(`/api/v1/subject/${id}`, {
        ...subject,
    });
};

export const callDeleteSubject = (id: number) => {
    return axios.delete<IBackendRes<ISubject>>(`/api/v1/subject/${id}`);
};

/**
 * 
Module Question
 */

export const callFetchQuestion = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IQuestion>>>(
        `/api/v1/question?${query}`
    );
};

export const callFetchQuestionById = (id: string) => {
    return axios.get<IBackendRes<IQuestion>>(`/api/v1/question/${id}`);
};

export const callCreateQuestion = (question: IQuestion) => {
    return axios.post<IBackendRes<IQuestion>>(`/api/v1/question`, {
        ...question,
    });
};

export const callCreateBulkQuestion = (arrQuestion: IQuestion[]) => {
    return axios.post<IBackendRes<IQuestion[]>>(
        `/api/v1/question/create-bulk`,
        [...arrQuestion]
    );
};

export const callUpdateQuestion = (question: IQuestion, id: number) => {
    return axios.patch<IBackendRes<IQuestion>>(`/api/v1/question/${id}`, {
        ...question,
    });
};

export const callDeleteQuestion = (id: number) => {
    return axios.delete<IBackendRes<IQuestion>>(`/api/v1/question/${id}`);
};

/**
 * 
Module Answer
 */

export const callFetchAnswer = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IAnswer>>>(
        `/api/v1/answer?${query}`
    );
};

export const callFetchAnswerById = (id: string) => {
    return axios.get<IBackendRes<IAnswer>>(`/api/v1/answer/${id}`);
};

export const callCreateAnswer = (answer: IAnswer) => {
    return axios.post<IBackendRes<IAnswer>>(`/api/v1/answer`, {
        ...answer,
    });
};

export const callCreateBulkAnswer = (arrAnswer: IAnswer[]) => {
    return axios.post<IBackendRes<IAnswer[]>>(`/api/v1/answer/create-bulk`, [
        ...arrAnswer,
    ]);
};

export const callUpdateAnswer = (answer: IAnswer, id: number) => {
    return axios.patch<IBackendRes<IAnswer>>(`/api/v1/answer/${id}`, {
        ...answer,
    });
};

export const callDeleteAnswer = (id: number) => {
    return axios.delete<IBackendRes<IAnswer>>(`/api/v1/answer/${id}`);
};
