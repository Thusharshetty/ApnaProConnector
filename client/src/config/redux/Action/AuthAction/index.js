import { createAsyncThunk } from "@reduxjs/toolkit";   
import {clientServer} from "@/config/index" 


export const loginuser=createAsyncThunk(
    "user/login",
    async(user,thunkAPI)=>{
        try{
            const response=await clientServer.post("login",{
                email:user.email,
                password:user.password
            });
            if(response.data.token){
            localStorage.setItem("token",response.data.token);
            }else{
                return thunkAPI.rejectWithValue({message:"token not found"});
            }
            return thunkAPI.fulfillWithValue(response.data.token);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const registeruser=createAsyncThunk(
    "user/register",
    async(user,thunkAPI)=>{
        try{
            const response= await clientServer.post("register",{
                username:user.username,
                email:user.email,
                password:user.password,
                name:user.name
            })
            return thunkAPI.fulfillWithValue(response.data.message);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }

);