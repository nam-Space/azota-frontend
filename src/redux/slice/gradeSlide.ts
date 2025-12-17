import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    callFetchExercise,
    callFetchGrade,
    callFetchGroup,
} from "@/config/api";
import { IGrade, IGroup } from "@/types/backend";

interface IState {
    isFetching: boolean;
    meta: {
        itemsPerPage: number;
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
    result: IGrade[];
}
// First, create the thunk
export const fetchGrade = createAsyncThunk(
    "grade/fetchGrade",
    async ({ query }: { query: string }) => {
        const response = await callFetchGrade(query);
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

export const gradeSlide = createSlice({
    name: "grade",
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
        builder.addCase(fetchGrade.pending, (state, action) => {
            state.isFetching = true;
            // Add user to the state array
            // state.courseOrder = action.payload;
        });

        builder.addCase(fetchGrade.rejected, (state, action) => {
            state.isFetching = false;
            // Add user to the state array
            // state.courseOrder = action.payload;
        });

        builder.addCase(fetchGrade.fulfilled, (state, action) => {
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

export const { setActiveMenu } = gradeSlide.actions;

export default gradeSlide.reducer;
