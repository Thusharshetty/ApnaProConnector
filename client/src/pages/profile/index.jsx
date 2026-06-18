import React, { useEffect, useState } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser, getAllUsers } from '@/config/redux/Action/AuthAction';
import { getAllPosts } from '@/config/redux/Action/PostAction';


export default function ProfilePage() {
    const dispatch=useDispatch();
     const authState = useSelector((state) => state.auth);
     const postState=useSelector((state)=>state.posts);
     const [userProfile, setUserProfile]=useState({});
     const [userPosts, setUserposts]=useState({});
    useEffect(()=>{
         const token = localStorage.getItem("token");
              

            if(token && !authState.profileFetched){
                 dispatch(getAboutUser({token}));
            }
         
},[]);

 useEffect(()=>{
 if(authState.user !=undefined){
    setUserProfile(authState.user);
 let posts=postState.posts.filter((post)=>{
    post.userId.userName === authState.user.userName
 });
 setUserposts(posts);
}
 },[authState.user],[postState.posts]);

 useEffect(()=>{
    dispatch(getAllPosts());
 },[])

  return (
    <UserLayout>
        <DashBoardLayout>
            {authState.user && authState.user.userId.name}
        </DashBoardLayout>
    </UserLayout>
  )
}
