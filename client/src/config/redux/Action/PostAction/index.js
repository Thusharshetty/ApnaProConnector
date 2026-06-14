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
);

export const deletePost=createAsyncThunk("post/deletePost",
    async(post_id,thunkAPI)=>{
        try{
            const response=await clientServer.delete("post/delete",{
                data:{
                    token:localStorage.getItem("token"),
                    post_id:post_id.post_id
                }
            });
            return thunkAPI.fulfillWithValue(response.data);

        }catch(e){
            return thunkAPI.rejectWithValue(error.message||"Something Went Wrong");
        }
    }
);

export const incrementLike=createAsyncThunk("post/incrementLike",
    async(post_id,thunkAPI)=>{
        try{
            const response=await clientServer.post("posts/like",{
              
                    token:localStorage.getItem("token"),
                    post_id:post_id.post_id
    

            })
            return thunkAPI.fulfillWithValue(response.data);

        }catch(e){
            return thunkAPI.rejectWithValue(error.message||"Something Went Wrong");
        }
    }
)