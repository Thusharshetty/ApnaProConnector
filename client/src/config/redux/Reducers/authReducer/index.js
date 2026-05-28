import { createSlice } from "@reduxjs/toolkit";
import { loginuser, registeruser } from "@/config/redux/Action/AuthAction/index"

const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginuser: (state) => {
            state.message = "hello";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginuser.pending, (state) => {
            state.isLoading = true,
                state.message = "Knocking the Door..."
        })
            .addCase(loginuser.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isError = false,
                    state.isSuccess = true,
                    state.loggedIn = true,
                    state.message = "Loggin is Successfull"
            })
            .addCase(loginuser.rejected, (state, action) => {
                state.isLoading = false,
                    state.isError = true,
                    state.message = action.payload;
            })
            .addCase(registeruser.pending, (state) => {
                state.isLoading = true,
                    state.message = "Registering..."
            })
            .addCase(registeruser.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.isError = false,
                    state.isSuccess = true,
                    state.message = "Registration is Successfull"
            })
            .addCase(registeruser.rejected, (state, action) => {
                state.isLoading = false,
                    state.isError = true,
                    state.message = action.payload;
            })
    }
});

export default authSlice.reducer;