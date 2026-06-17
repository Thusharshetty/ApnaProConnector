import { BASEEURL, clientServer } from '@/config';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import UserLayout from '../layout/Navbar';
import DashBoardLayout from '../layout/DashboardLayout';
import styles from './styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/Action/PostAction';
import { useRouter } from 'next/router';
import { getConnectionsRequest, sendConnectionRequest } from '@/config/redux/Action/AuthAction';

export default function ViewProfilePage({userProfile}) {
  const router=useRouter();
  const searchParameter = useSearchParams();
  const postReducer=useSelector((state)=>state.posts);
  const dispatch=useDispatch();
  const authState=useSelector((state)=>state.auth);
  const [userPosts,setUserPosts]=useState([]);
  const [isCurrentUserInConnection,setIsCurrentUserInConnection]=useState(false);
  const [isConnectionNull,setIsConnectionNull]=useState(true);

  const getUserPost =async ()=>{
    await dispatch(getAllPosts());
    await dispatch(getConnectionsRequest({token:localStorage.getItem("token")}));
  }
  useEffect(() => {
    getUserPost();
  },[]);

 useEffect(()=>{
  let post= postReducer.posts.filter((post)=>{
    return post.userId.userName===router.query.username;
  });

  setUserPosts(post);
 },[postReducer.posts]);

 useEffect(()=>{
   console.log(authState.connections,userProfile.userId._id);
   if(authState.connections.some(user=>user.connectionId._id === userProfile.userId._id)){
     setIsCurrentUserInConnection(true);
     if(authState.connections.find(user=>user.connectionId._id === userProfile.userId._id).status_accepted === true){
      setIsConnectionNull(false);
     }
   }
   
 },[authState.connections]);

  return (
    <UserLayout>
    <DashBoardLayout>

      <div className={styles.profileContainer}>

        <div className={styles.backdropContainer}>
          <img
            src={`${BASEEURL}/${userProfile.userId.profilePicture}`}
            alt=""
            className={styles.profileImage}
          />
        </div>

        <div className={styles.profileBody}>
          <div className={styles.profileInfo}>

            <div className={styles.nameSection}>
              <h1>{userProfile.userId.name}</h1>

              <p className={styles.username}>
                @{userProfile.userId.userName}
              </p>
            </div>

            {
              isCurrentUserInConnection ? (
                <button className={styles.connectedButton}>
                 {isConnectionNull? "Pending" : "Connected"}
                </button>
              ) : (
                <button
                  className={styles.connectBtn}
                  onClick={() => {
                    dispatch(
                      sendConnectionRequest({
                        token: localStorage.getItem("token"),
                        user_id: userProfile.userId._id
                      })
                    )
                  }}
                >
                  Connect
                </button>
              )
            }

            <div className={styles.bioSection}>
              <h3>About</h3>
              <p>
                {userProfile.bio || "No bio available"}
              </p>
            </div>
          </div>



          <div className={styles.activitySection}>

            <h2>Recent Activity</h2>

            {
              userPosts.map((post) => (
                <div
                  key={post._id}
                  className={styles.postCard}
                >

                  {
                    post.media !== "" &&
                    <div className={styles.cardImage}>
                      <img
                        src={`${BASEEURL}/${post.media}`}
                        alt=""
                      />
                    </div>
                  }

                  <div className={styles.postBody}>
                    {post.body}
                  </div>

                </div>
              ))
            }

          </div>

        </div>

        <div> 
          <h4>Work History</h4>
        </div>

      </div>

    </DashBoardLayout>
  </UserLayout>
  )
}

export async function getServerSideProps(context) {
  console.log("HIII!!");
  console.log(context.query.username);

  const req= await clientServer.get("/user/get_profile_by_userName",{
    params:{
      username:context.query.username
    }
  });

  const res= await req.data;
  console.log(res);
  return { props: {userProfile:req.data.profile} }
}