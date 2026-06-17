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
            return thunkAPI.rejectWithValue(error.response.data.message);
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
            return thunkAPI.rejectWithValue(error.response.data.message);
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
            return thunkAPI.rejectWithValue(error.response.data.message);
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
            return thunkAPI.rejectWithValue(error.response.data.message);
        }

    }
);

export const sendConnectionRequest=createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response= await clientServer.post("user/send_connection_request",{
                token:user.token,
                receiverId:user.user_id
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.message.data.message);
        }
    }
)
export const getConnectionsRequest=createAsyncThunk(
    "user/getConnectionsRequest",
    async(user,thunkAPI)=>{
        try{
            const response= await clientServer.get("user/getConnectionRequests",{
                params:{
                    token:user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data.connections);
        }catch(error){
            return thunkAPI.rejectWithValue(error.message.data.messages);
        }
    }
);
export const getMyConnectionsRequest=createAsyncThunk(
    "user/getMyConnectionsRequest",
    async(user,thunkAPI)=>{
        try{
            const response= await clientServer.get("user/user_connection_request",{
                params:{
                    token:user.token
                }
            })
            return thunkAPI.fulfillWithValue(response.data.connections);
        }catch(error){
            return thunkAPI.rejectWithValue(error.message.data.messages);
        }
    }
);
export const AcceptConnectionsRequest=createAsyncThunk(
    "user/AcceptConnectionsRequest",
    async(user,thunkAPI)=>{
        try{
            const response= await clientServer.post("user/accept_connection_request",{
                token:user.token,
                requestId:user.connectionId,
                action_type:user.action
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.message.data.messages);
        }
    }
);

