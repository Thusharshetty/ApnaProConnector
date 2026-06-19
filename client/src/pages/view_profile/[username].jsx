import { BASEEURL, clientServer } from '@/config';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import UserLayout from '../layout/Navbar';
import DashBoardLayout from '../layout/DashboardLayout';
import styles from './styles.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/Action/PostAction';
import { useRouter } from 'next/router';
import { getConnectionsRequest, getMyConnectionsRequest, sendConnectionRequest } from '@/config/redux/Action/AuthAction';

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
    await dispatch(getMyConnectionsRequest({token:localStorage.getItem("token")}))
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
    if(authState.connectionRequests.some(user=>user.userId._id === userProfile.userId._id)){
     setIsCurrentUserInConnection(true);
     if(authState.connectionRequests.find(user=>user.userId._id === userProfile.userId._id).status_accepted === true){
      setIsConnectionNull(false);
     }
   }
   
 },[authState.connections,authState.connectionRequests]);

  return (
    <UserLayout>
    <DashBoardLayout>

     <div className={styles.profileContainer}>
  <div className={styles.backdropContainer}>
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
    <div className={styles.buttonContainer}>
      {
        isCurrentUserInConnection ?
          <button className={styles.connectedButton}>
            {isConnectionNull ? "Pending" : "Connected"}
          </button>
          :
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
      }

      <button
        className={styles.resumeBtn}
        onClick={async () => {
          const response = await clientServer.get(
            `/user/download_resume?id=${userProfile.userId._id}`
          );
          window.open(
            `${BASEEURL}/${response.data.outputPath}`,
            "_blank"
          );
        }}
      >
        Download Resume
      </button>
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
       <h3>No Work Experience Yet.. 🚀</h3>
    </div>
  )}
        {
          userProfile.pastWork.filter(work => work.position || work.company || work.years ).map((work, index) => (
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
 <div className={styles.sectionCard}>
      <h2>Education</h2>

      <div className={styles.workHistoryContainer}>


        {(!userProfile.education || userProfile.education.length === 0) && (
    <div className={styles.workHistoryCard}>
       <h3>Not updated about education..!! 🚀</h3>
    </div>
  )}
        {
          userProfile.education.map((edu, index) => (
            <div
              key={index}
              className={styles.workHistoryCard}
            >
              <h3>{edu.school}</h3>

              <p>{edu.degree}</p>

              <span>{edu.fieldOfStudy}</span>
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