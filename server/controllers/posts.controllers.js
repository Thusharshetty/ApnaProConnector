import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import mongoose from 'mongoose';


export const activeCheck=(req,res)=>{
    return res.status(200).json({message:'Active'})
}

export const createPost= async (req,res)=>{
    try{
        const {token}=req.body;
        if(!token){
            return res.status(401).json({message:'Unauthorized'})
        }
        const user= await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const post=new Post({
            userId:user._id,
            body:req.body.body,
            media:req.file !== undefined ? req.file.filename : '',
            fileType:req.file !== undefined ? req.file.mimetype.split('/')[1] : ''
        });
        await post.save();
        return res.status(201).json({message:'Post created successfully'})
    }catch(error){
        return res.status(500).json({message:'Error creating post'})
    }
}

export const getAllPosts= async (req,res)=>{
    try{
        const posts =await Post.find().populate('userId','name userName email profilePicture');
        return res.status(200).json(posts)

    }catch(error){ 
        return res.status(500).json({message:'Error fetching posts'})
    }
}


export const deletePost= async (req,res)=>{
    try{
        const {token,post_id}=req.body;
        if(!token){
            return res.status(401).json({message:'Unauthorized'})
        }
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const post =await Post.findById(post_id);
        if(!post){
            return res.status(404).json({message:'Post not found'})
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(403).json({message:'Forbidden'})
        }
        await Post.findByIdAndDelete(post_id);
        return res.status(200).json({message:'Post deleted successfully'})
    }catch(error){

        return res.status(500).json({message:`Error deleting post ${error}`})
    }
}

export const commentPost= async (req,res)=>{
    try{
        const {token,post_id,comment}=req.body;
        if(!token){
            return res.status(401).json({message:'Unauthorized'})
        }
        const user =await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const post =await Post.findById(post_id);
        if(!post){
            return res.status(404).json({message:'Post not found'})
        }
        const newComment= new Comment({
            userId:user._id,
            postId:post._id,
            body:comment
        });
        await newComment.save();
        return res.status(201).json({message:'Comment added successfully'})
    }catch(error){
        return res.status(500).json({message:'Error commenting on post'})
    }
};


export const getComments_post = async (req, res) => {
    try {
        const { post_id } = req.params;
        if (!post_id || !mongoose.Types.ObjectId.isValid(post_id)) {
            return res.status(400).json({ message: "Invalid or missing Post ID format" });
        }

        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        const comments = await Comment.find({ postId: post_id }).populate('userId', 'name userName email profilePicture');
        
        if (comments.length === 0) {
             return res.status(200).json({ comments: [], message: "No comments yet" });
        }

        return res.status(200).json({ comments });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching comments' });
    }
}


export const deletecomment= async (req,res)=>{
    try{
        const {token,comment_id}=req.body;
        if(!token){
            return res.status(401).json({message:'Unauthorized'})
        }
        const user =await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const comment =await Comment.findById(comment_id);
        if(!comment){
            return res.status(404).json({message:'Comment not found'})
        }
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(403).json({message:'Forbidden'})
        }
        await Comment.findByIdAndDelete(comment_id);
        return res.status(200).json({message:'Comment deleted successfully'})
    }catch(error){
        return res.status(500).json({message:'Error deleting comment'})
    }
};

export const likePost= async (req,res)=>{
    try{
        const {token,post_id}=req.body; 
        if(!token){
            return res.status(401).json({message:'Unauthorized'})
        }
        const user= await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const post= await Post.findById(post_id);
        if(!post){
            return res.status(404).json({message:'Post not found'})
        }
        post.likes +=1;
        await post.save();
        return res.status(200).json({message:'Post liked successfully'})    

    }catch(error){  
        return res.status(500).json({message:'Error liking post'})
    }
}