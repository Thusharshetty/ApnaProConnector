import { createSlice } from "@reduxjs/toolkit";
import { createPost, getAllComments, getAllPosts } from "@/config/redux/Action/PostAction/index"

const initialState = {
    posts: [],
    isError: false,
    isLoading: false,
    isSuccess: false,
    message: "",
    postFetched: false,
    loggedIn: false,
    comments: [],
    postId: ""
};


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: () => initialState,
        resetPostID: (state) => {
            state.postId = "";
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
            state.message = "fetching posts...";
        })
            .addCase(getAllPosts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.posts = action.payload.reverse();
                state.postFetched = true;
            })
            .addCase(getAllPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload || "something went wrong";
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.message = action.payload;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.message = action.payload;
            })
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.postId = action.payload.post_id;
                state.comments = Array.isArray(action.payload.comments)
                    ? action.payload.comments
                    : [];
            })
    }
});


export const { reset, resetPostID } = postSlice.actions;
export default postSlice.reducer;