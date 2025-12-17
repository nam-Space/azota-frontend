export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
    result: T[];
}

export interface IAccount {
    access_token: string;
    user: {
        id: number;
        email: string;
        name: string;
        birthDay?: Date;
        phone: string;
        gender?: string;
        avatar?: string;
        role: IRole;
        permissions: IPermission[];
    };
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}

export interface IUser {
    id?: number;
    email?: string;
    password?: string;
    name?: string;
    birthDay?: Date;
    phone?: string;
    gender?: string;
    avatar?: string;
    passwordToken?: string;
    roleId?: number;
    role?: IRole;
    userClassrooms?: IUserClassroom[];
    histories?: IHistory[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IGenerateTokenPasswordDto {
    email: string;
    locale: string;
}

export interface IUserByEmailAndPasswordToken {
    email: string;
    passwordToken: string;
}

export interface IMail {
    notification: string;
}

export interface IUpdateUserPassword {
    password?: string;
    new_password: string;
    renew_password: string;
}

export interface IRole {
    id?: number;
    name?: string;
    users?: IUser[];
    rolePermissions?: IRolePermission[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IPermission {
    id?: number;
    name?: string;
    endpoint?: string;
    method?: string;
    module?: string;
    rolePermissions?: IRolePermission[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IRolePermission {
    id: number;
    roleId: number;
    permissionId: number;
    role: IRole;
    permission: IPermission;

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IExercise {
    id?: number;
    name?: string;
    type?: string;
    description?: string;
    timeStart?: Date | string;
    timeEnd?: Date | string;
    duration?: number;
    isRandomQuestion?: boolean;
    isRandomAnswer?: boolean;
    gradeId?: number;
    grade?: IGrade;
    subjectId?: number;
    subject?: ISubject;
    questions?: IQuestion[];
    classroomExercises?: IClassroomExercise[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IGrade {
    id?: number;
    name?: string;
    exercises?: IExercise[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface ISubject {
    id?: number;
    name?: string;
    exercises?: IExercise[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IUserClassroom {
    id?: number;
    classroomId?: number;
    classroom?: IClassroom;
    userId?: number;
    user?: IUser;

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface ILeaveRoom {
    classroomId: number;
    userId: number;
}

export interface IGroup {
    id?: number;
    name?: string;
    classrooms?: IClassroom[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface ISchoolYear {
    id?: number;
    name?: string;
    classrooms?: IClassroom[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IClassroom {
    id?: number;
    name?: string;
    userClassrooms?: IUserClassroom[];
    classroomExercises?: IClassroomExercise[];
    groupId?: number;
    group?: IGroup;
    schoolYearId?: number;
    schoolYear?: ISchoolYear;
    classroomToken?: string;

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IClassroomExercise {
    id?: number;
    classroomId?: number;
    classroom?: IClassroom;
    exerciseId?: number;
    exercise?: IExercise;
    histories?: IHistory[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IHistory {
    id?: number;
    userId?: number;
    user?: IUser;
    score?: number;
    totalCorrect?: number;
    duration?: number;
    classroomExerciseId?: number;
    classroomExercise?: IClassroomExercise;
    answerHistories?: IAnswerHistory[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IAnswerHistory {
    id?: number;
    historyId?: number;
    history?: IHistory;
    questionId?: number;
    question?: IQuestion;
    answerChoosenId?: number;
    answer?: IAnswer;

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IQuestion {
    id?: number;
    name?: string;
    exerciseId?: number;
    exercise?: IExercise;
    answers?: IAnswer[];
    answerHistories?: IAnswerHistory[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}

export interface IAnswer {
    id?: number;
    name?: string;
    questionId?: number;
    question?: IQuestion;
    isCorrect?: boolean;
    answerHistories?: IAnswerHistory[];

    createdBy?: number;
    updatedBy?: number;
    deletedBy?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;

    generatedMaps?: Array<any>;
    raw?: Array<any>;
    affected?: number;
}
