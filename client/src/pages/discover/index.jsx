import React, { useEffect } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser, getAllUsers } from '@/config/redux/Action/AuthAction';
import styles from "./styles.module.css";
import { BASEEURL } from '@/config';
import { useRouter } from 'next/router';

export default function Discover() {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router=useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Ensure the individual profile data is requested if the user reloads here
    if (token && !authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
    if (!authState.all_profileFetched) {
      dispatch(getAllUsers());
    }

  }, []);
  return (
    <UserLayout>
      <DashBoardLayout>
        <div>
          <h1 className={styles.discoverTitle}>
    Discover
</h1>
          {authState.all_profileFetched &&
        authState.allUser
    .filter(user => user.userId) // remove null users
    .filter(user => user.userId._id !== authState.user?.userId?._id) // remove current user
    .map((user) => (
      <div
        key={user._id}
        className={styles.userCard}
        onClick={() => {
          router.push(`/view_profile/${user.userId.userName}`);
        }}
      >
        <img
          src={`${BASEEURL}/${user.userId.profilePicture}`}
          alt=""
        />

        <div className={styles.userInfo}>
          <h2>{user.userId.name}</h2>
          <p>@{user.userId.userName}</p>
        </div>
      </div>
    ))
}
        </div>
      </DashBoardLayout>
    </UserLayout>
  )
}
