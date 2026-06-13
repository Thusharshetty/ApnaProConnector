import React, { useEffect } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser, getAllUsers } from '@/config/redux/Action/AuthAction';

export default function Discover() {

    const dispatch=useDispatch();
    const authState=useSelector((state)=>state.auth);

    useEffect(()=>{
        const token = localStorage.getItem("token");

        // Ensure the individual profile data is requested if the user reloads here
        if (token && !authState.profileFetched) {
       dispatch(getAboutUser({ token }));
     }

        if(!authState. all_profileFetched){
            dispatch(getAllUsers());
        }

    },[]);
  return (
    <UserLayout>
               <DashBoardLayout>
                 <div>
                    <h1>Discover</h1>
                 </div>
               </DashBoardLayout>
</UserLayout>
  )
}
