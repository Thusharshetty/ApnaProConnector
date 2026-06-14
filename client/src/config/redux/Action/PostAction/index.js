import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config/index"

export const getAllPosts = createAsyncThunk("post/getAllPosts",
    async (_,thunkAPI) => {
        try{
            const response  = await clientServer.get("posts");
            return thunkAPI.fulfillWithValue(response.data);

        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const createPost =createAsyncThunk("post/createPosts",
    async(userData,thunkAPI)=>{
        try{
            const {file,body}=userData;
            const formData=new FormData();
            formData.append("token",localStorage.getItem("token"));
            formData.append("body",body);
            formData.append("media",file);
            const response= await clientServer.post("post/create",formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            if(response.status ===200){
                return thunkAPI.fulfillWithValue("Post Created");
            }else{
                return thunkAPI.rejectWithValue(" Ooopps!!! Post Not Uploaded");
            }
            

        }catch(error){
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)