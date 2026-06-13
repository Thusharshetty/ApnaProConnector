import React, { useEffect } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser } from '@/config/redux/Action/AuthAction'

export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Fetch profile data if a token exists but state was wiped by a refresh
    if (token && !authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
  }, []);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div>
          <h1>MyConnections</h1>
        </div>
      </DashBoardLayout>
    </UserLayout>
  )
}
