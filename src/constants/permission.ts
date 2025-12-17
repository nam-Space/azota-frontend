export const ALL_PERMISSIONS = {
    USER: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/user",
            module: "USER",
        },
        GET_BY_ID: {
            method: "GET",
            endpoint: "/api/v1/user/:id",
            module: "USER",
        },
        CREATE: { method: "POST", endpoint: "/api/v1/user", module: "USER" },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/user/:id",
            module: "USER",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/user/:id",
            module: "USER",
        },
    },
    GROUP: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/group",
            module: "GROUP",
        },
        CREATE: { method: "POST", endpoint: "/api/v1/group", module: "GROUP" },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/group/:id",
            module: "GROUP",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/group/:id",
            module: "GROUP",
        },
    },
    SCHOOL_YEAR: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/school-year",
            module: "SCHOOL_YEAR",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/school-year",
            module: "SCHOOL_YEAR",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/school-year/:id",
            module: "SCHOOL_YEAR",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/school-year/:id",
            module: "SCHOOL_YEAR",
        },
    },
    CLASSROOM: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/classroom",
            module: "CLASSROOM",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/classroom",
            module: "CLASSROOM",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/classroom/:id",
            module: "CLASSROOM",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/classroom/:id",
            module: "CLASSROOM",
        },
    },
    USER_CLASSROOM: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/user-classroom",
            module: "USER_CLASSROOM",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/user-classroom",
            module: "USER_CLASSROOM",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/user-classroom/:id",
            module: "USER_CLASSROOM",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/user-classroom/:id",
            module: "USER_CLASSROOM",
        },
        LEAVE_ROOM: {
            method: "POST",
            endpoint: "/api/v1/user-classroom/leave-room",
            module: "USER_CLASSROOM",
        },
    },
    EXERCISE: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/exercise",
            module: "EXERCISE",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/exercise",
            module: "EXERCISE",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/exercise/:id",
            module: "EXERCISE",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/exercise/:id",
            module: "EXERCISE",
        },
    },
    CLASSROOM_EXERCISE: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/classroom-exercise",
            module: "CLASSROOM_EXERCISE",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/classroom-exercise",
            module: "CLASSROOM_EXERCISE",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/classroom-exercise/:id",
            module: "CLASSROOM_EXERCISE",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/classroom-exercise/:id",
            module: "CLASSROOM_EXERCISE",
        },
    },
    SUBJECT: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/subject",
            module: "SUBJECT",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/subject",
            module: "SUBJECT",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/subject/:id",
            module: "SUBJECT",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/subject/:id",
            module: "SUBJECT",
        },
    },
    GRADE: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/grade",
            module: "GRADE",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/grade",
            module: "GRADE",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/grade/:id",
            module: "GRADE",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/grade/:id",
            module: "GRADE",
        },
    },
    HISTORY: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/history",
            module: "HISTORY",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/history",
            module: "HISTORY",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/history/:id",
            module: "HISTORY",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/history/:id",
            module: "HISTORY",
        },
    },
    ANSWER_HISTORY: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/answer-history",
            module: "ANSWER_HISTORY",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/answer-history",
            module: "ANSWER_HISTORY",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/answer-history/:id",
            module: "ANSWER_HISTORY",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/answer-history/:id",
            module: "ANSWER_HISTORY",
        },
    },
    QUESTION: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/question",
            module: "QUESTION",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/question",
            module: "QUESTION",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/question/:id",
            module: "QUESTION",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/question/:id",
            module: "QUESTION",
        },
    },
    ANSWER: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/answer",
            module: "ANSWER",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/answer",
            module: "ANSWER",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/answer/:id",
            module: "ANSWER",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/answer/:id",
            module: "ANSWER",
        },
    },

    ROLE: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/role",
            module: "ROLE",
        },
        CREATE: { method: "POST", endpoint: "/api/v1/role", module: "ROLE" },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/role/:id",
            module: "ROLE",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/role/:id",
            module: "ROLE",
        },
    },
    ROLE_PERMISSION: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/role-permission",
            module: "ROLE_PERMISSION",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/role-permission",
            module: "ROLE_PERMISSION",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/role-permission/:id",
            module: "ROLE_PERMISSION",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/role-permission/:id",
            module: "ROLE_PERMISSION",
        },
    },
    PERMISSION: {
        GET_PAGINATE: {
            method: "GET",
            endpoint: "/api/v1/permission",
            module: "PERMISSION",
        },
        CREATE: {
            method: "POST",
            endpoint: "/api/v1/permission",
            module: "PERMISSION",
        },
        UPDATE: {
            method: "PATCH",
            endpoint: "/api/v1/permission/:id",
            module: "PERMISSION",
        },
        DELETE: {
            method: "DELETE",
            endpoint: "/api/v1/permission/:id",
            module: "PERMISSION",
        },
    },
};

export const ALL_MODULES = {
    USER: "USER",
    FILE: "FILE",
    MAIL: "MAIL",
    AUTH: "AUTH",
    GROUP: "GROUP",
    SCHOOL_YEAR: "SCHOOL_YEAR",
    CLASSROOM: "CLASSROOM",
    USER_CLASSROOM: "USER_CLASSROOM",
    EXERCISE: "EXERCISE",
    CLASSROOM_EXERCISE: "CLASSROOM_EXERCISE",
    SUBJECT: "SUBJECT",
    GRADE: "GRADE",
    HISTORY: "HISTORY",
    ANSWER_HISTORY: "ANSWER_HISTORY",
    QUESTION: "QUESTION",
    ANSWER: "ANSWER",
    ROLE: "ROLE",
    ROLE_PERMISSION: "ROLE_PERMISSION",
    PERMISSION: "PERMISSION",
};
