import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchRole, callFetchRolePermission } from "@/config/api";
import { IRolePermission } from "@/types/backend";

interface IState {
    isFetching: boolean;
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
    result: IRolePermission[];
}
// First, create the thunk
export const fetchRolePermission = createAsyncThunk(
    "rolePermission/fetchRolePermission",
    async ({ query }: { query: string }) => {
        const response = await callFetchRolePermission(query);
        return response;
    }
);

const initialState: IState = {
    isFetching: true,
    meta: {
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        totalItems: 0,
    },
    result: [],
};

export const rolePermissionSlide = createSlice({
    name: "role",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setActiveMenu: (state, action) => {
            // state.activeMenu = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchRolePermission.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        });

        builder.addCase(fetchRolePermission.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        });

        builder.addCase(fetchRolePermission.fulfilled, (state, action) => {
            if (action.payload && action.payload.data) {
                state.isFetching = false;
                state.meta = action.payload.data.meta;
                state.result = action.payload.data.result;
            }
            // Add user to the state array

            // state.courseOrder = action.payload;
        });
    },
});

export const { setActiveMenu } = rolePermissionSlide.actions;

export default rolePermissionSlide.reducer;
