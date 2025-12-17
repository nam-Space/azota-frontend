import { createSlice } from "@reduxjs/toolkit";

interface IState {
    name: string;
}

const initialState: IState = {
    name:
        (typeof window !== "undefined" &&
            JSON.parse(localStorage.getItem("theme") as any)) ||
        "#1E40AF",
};

export const themeSlide = createSlice({
    name: "theme",
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        changeTheme: (state, action) => {
            state.name = action.payload.name;
            localStorage.setItem("theme", JSON.stringify(action.payload.name));
        },
    },
});

export const { changeTheme } = themeSlide.actions;

export default themeSlide.reducer;
