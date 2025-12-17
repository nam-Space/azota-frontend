import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchAccount } from "@/config/api";
import { IPermission, IRole } from "@/types/backend";

// First, create the thunk
export const fetchAccount = createAsyncThunk(
    "account/fetchAccount",
    async () => {
        const response = await callFetchAccount();
        return response.data;
    }
);

interface IState {
    isAuthenticated: boolean;
    isLoading: boolean;
    isRefreshToken: boolean;
    errorRefreshToken: string;
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
    activeMenu: string;
}

const initialState: IState = {
    isAuthenticated: false,
    isLoading: true,
    isRefreshToken: false,
    errorRefreshToken: "",
    user: {
        id: 0,
        email: "",
        name: "",
        birthDay: new Date(),
        phone: "",
        gender: "",
        avatar: "",
        role: {
            id: 0,
            name: "",
        },
        permissions: [
            {
                id: 0,
                name: "",
                endpoint: "",
                method: "",
                module: "",
            },
        ],
    },

    activeMenu: "home",
};

export const accountSlide = createSlice({
    name: "account",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            state.activeMenu = action.payload;
        },
        setUserLoginInfo: (state, action) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user.id = action?.payload?.id;
            state.user.email = action.payload.email;
            state.user.name = action.payload.name;
            state.user.birthDay = action.payload.birthDay;
            state.user.phone = action.payload.phone;
            state.user.gender = action.payload.gender;
            state.user.avatar = action.payload?.avatar;
            state.user.role = action.payload.role;
            state.user.permissions = action.payload.permissions;
        },
        setLogoutAction: (state, action) => {
            localStorage.removeItem("access_token");
            state.isAuthenticated = false;
            state.user = {
                id: 0,
                email: "",
                name: "",
                birthDay: new Date(),
                phone: "",
                gender: "",
                avatar: "",
                role: {
                    id: 0,
                    name: "",
                },
                permissions: [
                    {
                        id: 0,
                        name: "",
                        endpoint: "",
                        method: "",
                        module: "",
                    },
                ],
            };
        },
        setRefreshTokenAction: (state, action) => {
            state.isRefreshToken = action.payload?.status ?? false;
            state.errorRefreshToken = action.payload?.message ?? "";
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchAccount.pending, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = true;
            }
        });

        builder.addCase(fetchAccount.fulfilled, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.user.id = action?.payload?.user?.id;
                state.user.email = action.payload?.user?.email;
                state.user.name = action.payload?.user?.name;
                state.user.birthDay = action.payload?.user?.birthDay;
                state.user.phone = action.payload?.user?.phone;
                state.user.gender = action.payload?.user?.gender;
                state.user.avatar = action.payload?.user?.avatar;
                state.user.role = action?.payload?.user?.role;
                state.user.permissions = action?.payload?.user?.permissions;
            }
        });

        builder.addCase(fetchAccount.rejected, (state, action) => {
            if (action.payload) {
                state.isAuthenticated = false;
                state.isLoading = false;
            }
        });
    },
});

export const {
    setActiveMenu,
    setUserLoginInfo,
    setLogoutAction,
    setRefreshTokenAction,
} = accountSlide.actions;

export default accountSlide.reducer;
