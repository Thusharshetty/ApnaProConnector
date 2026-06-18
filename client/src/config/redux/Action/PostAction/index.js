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
                return thunkAPI.fulfillWithValue(response.data.message);
            }else{
                return thunkAPI.rejectWithValue(response.data.message);
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

        }catch(error){
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

        }catch(error){
            return thunkAPI.rejectWithValue(error.message||"Something Went Wrong");
        }
    }
);

export const getAllComments =createAsyncThunk("post/getAllComments",
    async({post_id},thunkAPI)=>{
        try{
            const response= await clientServer.get(`comments/${post_id}`,{
                params:{
                    post_id
                }
            });
            return thunkAPI.fulfillWithValue({ comments: response.data.comments,post_id});

        }catch(error){
            return thunkAPI.rejectWithValue(error.message||"Something Went Wrong");
        }
    }
);

export const postComment=createAsyncThunk("post/postComment",
    async(commentData,thunkAPI)=>{
        try{
            console.log( {post_id:commentData.post_id,
                comment:commentData.body,})

            const response= await clientServer.post("post/comment",{
                token:localStorage.getItem("token"),
                post_id:commentData.post_id,
                comment:commentData.body,
            });
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
             return thunkAPI.rejectWithValue(error.message||"Something Went Wrong");
        }
    }
)