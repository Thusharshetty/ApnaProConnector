import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from  "@/config/redux/Action/PostAction/index"

const initialState ={
    posts:[],
    isError:false,
    isLoading:false,
    isSuccess:false,
    message:"",
    postFetched:false,
    loggedIn:false,
    comments:[],
    postId:""
};


const postSlice = createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:() => initialState,
        resetPostID:(state) => {
            state.postId = "";
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllPosts.pending,(state)=>{
            state.isLoading = true;
            state.message ="fetching posts...";
        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.posts = action.payload.posts;
            state.postFetched = true;
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload || "something went wrong";
        })
    }
});


export const { reset, resetPostID } = postSlice.actions;
export default postSlice.reducer;