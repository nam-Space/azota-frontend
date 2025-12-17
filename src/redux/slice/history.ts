import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchHistory } from "@/config/api";
import { IHistory } from "@/types/backend";

interface IState {
    isFetching: boolean;
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
    result: IHistory[];
}
// First, create the thunk
export const fetchHistory = createAsyncThunk(
    "history/fetchHistory",
    async ({ query }: { query: string }) => {
        const response = await callFetchHistory(query);
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

export const historySlide = createSlice({
    name: "history",
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
        builder.addCase(fetchHistory.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        });

        builder.addCase(fetchHistory.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        });

        builder.addCase(fetchHistory.fulfilled, (state, action) => {
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

export const { setActiveMenu } = historySlide.actions;

export default historySlide.reducer;
