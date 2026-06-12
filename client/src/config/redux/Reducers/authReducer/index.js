import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, loginuser, registeruser } from "../../Action/AuthAction";  

const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    isTokenThere:false,
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    all_profileFetched:false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: () => initialState,
        handleLoginuser: (state) => {
            state.message = "hello";
        },
        setTokenIsThere: (state)=>{
            state.isTokenThere=true;
        },
        setTokenISNotThere:(state)=>{
            state.isTokenThere=false;
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
                    state.message = action.payload;
            })
            .addCase(registeruser.rejected, (state, action) => {
                state.isLoading = false,
                    state.isError = true,
                    state.message = action.payload;
            })
            .addCase(getAboutUser.fulfilled,(state,action) => {
                state.isLoading = false,
                state.isError = false,
                state.isSuccess = true,
                state.profileFetched = true,
                state.user = action.payload.profile
            })
            .addCase(getAllUsers.fulfilled,(state,action)=>{
                state.isLoading=false,
                state.isError=false,
                state.user=action.payload.profiles
            })
    }
});

export const { reset, handleLoginuser, setTokenIsThere,setTokenISNotThere } = authSlice.actions;

export default authSlice.reducer;