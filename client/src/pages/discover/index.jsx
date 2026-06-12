import React, { useEffect } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '@/config/redux/Action/AuthAction';

export default function Discover() {

    const dispatch=useDispatch();
    const authState=useSelector((state)=>state.auth);

    useEffect(()=>{
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
