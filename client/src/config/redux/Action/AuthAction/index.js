import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config/index"


export const loginuser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("login", {
                email: user.email,
                password: user.password
            });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({ message: "token not found" });
            }
            return thunkAPI.fulfillWithValue(response.data.token);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const registeruser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
        try {
            const response = await clientServer.post("register", {
                name: user.name,
                email: user.email,
                password: user.password,
                username: user.username
            });
            return thunkAPI.fulfillWithValue(response.data.message);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        } 
    }
);

export const getAboutUser = createAsyncThunk(
    "user/getAbout",
    async (user, thunkAPI) => {
        try{
            const response =await clientServer.get("get_user_and_profile",{
                params : {
                    token :user.token
                }
            });
            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const getAllUsers= createAsyncThunk(
    "user/getAllUsers",
    async(_, thunkAPI) =>{
        try{
             const response= await clientServer.get("user/get_all_users");
             return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }

    }
)