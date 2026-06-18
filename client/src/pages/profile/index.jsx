import React, { useEffect, useState } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAboutUser, getAllUsers } from '@/config/redux/Action/AuthAction';
import { getAllPosts } from '@/config/redux/Action/PostAction';
import styles from './style.module.css'
import { BASEEURL } from '@/config';

export default function ProfilePage() {
    const dispatch=useDispatch();
     const authState = useSelector((state) => state.auth);
     const postState=useSelector((state)=>state.posts);
     const [userProfile, setUserProfile]=useState({});
     const [userPosts, setUserposts]=useState([]);
    useEffect(()=>{
         const token = localStorage.getItem("token");
              

            if(token && !authState.profileFetched){
                 dispatch(getAboutUser({token}));
            }
         
},[]);

 useEffect(()=>{
    dispatch(getAllPosts());
 },[])

useEffect(() => {
    if (authState.user) {
        setUserProfile(authState.user);

        const posts = postState.posts.filter(
            (post) =>
                post.userId.userName === authState.user.userId.userName
        );

        setUserposts(posts);
    }
}, [authState.user, postState.posts]);



  return (
    <UserLayout>
        <DashBoardLayout>
            {authState.user && userProfile.userId &&
<div className={styles.profileContainer}>
  <div className={styles.backdropContainer}>
    <label className={styles.backdrop_overlay} htmlFor='profilePictureUpload'>
        <p style={{margin:"0",padding:"0", fontWeight:"bolder"}}>Edit</p>
    </label>
    <input type="file" id='profilePictureUpload' />
    <img
      src={`${BASEEURL}/${userProfile.userId.profilePicture}`}
      className={styles.profileImage}
    />
  </div>
  <div className={styles.profileBody}>
    <div className={styles.nameSection}>
      <h1>{userProfile.userId.name}</h1>
      <p className={styles.username}>
        @{userProfile.userId.userName}
      </p>
    </div>
    <div className={styles.sectionCard}>
      <h2>About</h2>
      <p>
        {userProfile.bio || "No bio available"}
      </p>
    </div>

    <div className={styles.sectionCard}>
      <h2>Experience</h2>

      <div className={styles.workHistoryContainer}>


        {(!userProfile.pastWork || userProfile.pastWork.length === 0) && (
    <div className={styles.workHistoryCard}>
       <h3>No Work Experience Yet 🚀</h3>
    </div>
  )}
        {
          userProfile.pastWork.map((work, index) => (
            <div
              key={index}
              className={styles.workHistoryCard}
            >
              <h3>{work.position}</h3>

              <p>{work.company}</p>

              <span>{work.years}</span>
            </div>
          ))
        }
      </div>

    </div>


    {/* Recent Activity */}

    <div className={styles.sectionCard}>
      <h2>Recent Activity</h2>

      <div className={styles.activityContainer}>

        {
          userPosts.map(post => (
            <div
              key={post._id}
              className={styles.activityCard}
            >

              {
                post.media &&
                <img
                  src={`${BASEEURL}/${post.media}`}
                  className={styles.activityImage}
                />
              }

              <div className={styles.activityContent}>
                <p>{post.body}</p>
              </div>

            </div>
          ))
        }

      </div>
    </div>

  </div>

</div>
}
        </DashBoardLayout>
    </UserLayout>
  )
}
