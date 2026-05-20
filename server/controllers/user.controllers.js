import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'




 export const register=async(req,res)=>{
    try{
        const {name,email,password,username}=req.body;

        if(!name || !email || !password || !username){
            return res.status(400).json({message:'Please fill all the fields'})
        }
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:'User already exists'})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            userName:username
        });
        await newUser.save();
        const profile=new Profile({
            userId:newUser._id,
        })
        await profile.save();
        return res.status(201).json({message:'User registered successfully'})


    }catch(error){
        return res.status(500).json({message:'Server error',error:error.message})
    }
}


export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:'Please fill all the fields'})
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:'User does not exist'})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:'Invalid credentials'})
        }
        const token=await crypto.randomBytes(64).toString('hex');
        user.token=token;
        await user.save();
        return res.status(200).json({message:'Login successful',token})
    }catch(error){
        return res.status(500).json({message:'Server error',error:error.message})
    }
}

export const uploadProfilePic=async(req,res)=>{
     const {token}=req.body;
        if(!token){
            return res.status(400).json({message:'Token is required'})
        }
    try{
       const user=await User.findOne({token});
       if(!user){
        return res.status(404).json({message:'User not found'})
       }

         if(!req.file){
            return res.status(400).json({message:'No file uploaded'})
         }
            user.profilePicture=req.file.filename;
            await user.save();
            return res.status(200).json({message:'Profile picture uploaded successfully',profilePicture:req.file.path})
    }catch(error){
        return res.status(500).json({message:'Server error',error:error.message})
    }

}

export const updateUserprofile=async(req,res)=>{
    try{
        const {token,...newUserData}=req.body;
        if(!token){
            return res.status(400).json({message:'Token is required'})
        }
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const {userName,email}=newUserData;
        if(userName){
            const existingUserName=await User.findOne({userName});
            if(existingUserName && existingUserName._id.toString()!==user._id.toString()){
                return res.status(400).json({message:'Username already taken'})
            }
        }
        if(email){
            const existingEmail=await User.findOne({email});
            if(existingEmail && existingEmail._id.toString()!==user._id.toString()){
                return res.status(400).json({message:'Email already taken'})
            }
        }
        Object.assign(user,newUserData);
        await user.save();
        return res.status(200).json({message:'Profile updated successfully'})

    }catch(error){
        return res.status(500).json({message:'Server error',error:error.message})
    }
}

export const getUserAndProfile=async(req,res)=>{
    try{
        const {token}=req.body;
        if(!token){
            return res.status(400).json({message:'Token is required'})
        }
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const userprofile=await Profile.findOne({userId:user._id}).populate('userId','name userName email profilePicture');
        return res.status(200).json({profile:userprofile})
    }catch(error){
        return res.status(500).json({message:'Server error',error:error.message})
    }
}

export const updateProfileData=async(req,res)=>{
    try{
        const {token,...newProfileData}=req.body;
        if(!token){
            return res.status(400).json({message:'Token is required'})
        }
        const user=await User.findOne({token});
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        const profile=await Profile.findOne({userId:user._id});
        if(!profile){
            return res.status(404).json({message:'Profile not found'})
        }
        Object.assign(profile,newProfileData);
        await profile.save();
        return res.status(200).json({message:'Profile updated successfully'})
    }catch(error){
        return res.status(500).json({message:'Server error',error:error.message})
    }
}

export const getAllUserProfile=async(req,res)=>{
    try{
        const profiles=await Profile.find().populate('userId','name userName email profilePicture');
        if(!profiles){
            return res.status(404).json({message:'No profiles found'})
        }
        return res.status(200).json({profiles:profiles})
    }catch(error){
        return res.status(500).json({message:'Server error',error:error.message})
    }
}