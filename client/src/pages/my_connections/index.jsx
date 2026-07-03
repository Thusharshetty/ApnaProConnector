import React, { useEffect } from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'
import { AcceptConnectionsRequest, getAboutUser, getMyConnectionsRequest } from '@/config/redux/Action/AuthAction'
import styles from './styles.module.css';
import { BASEEURL } from '@/config'
import { useRouter } from 'next/router'

export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router=useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Fetch profile data if a token exists but state was wiped by a refresh
    if (token && !authState.profileFetched) {
      dispatch(getAboutUser({ token }));
    }
  }, []);

  useEffect(()=>{
    dispatch(getMyConnectionsRequest({token:localStorage.getItem("token")}));
  },[]);

  useEffect(()=>{
    if(authState.connectionRequests !==0){
      console.log(authState.connectionRequests);
      
    }

  },[authState.connectionRequests])

  return (
    <UserLayout>
      <DashBoardLayout>
        <div style={{display:"flex", flexDirection:"column", gap:"1.5rem"}} className={styles.myConnectionsContainer}>
          <h1>MyConnections</h1>
          {authState.connectionRequests.length ===0 && <div> <h1 style={{color:"burlywood"}}> No Connection request</h1></div>}
          {authState.connectionRequests.length !==0 && authState.connectionRequests.filter((connection)=> connection.status_accepted === null).map((user,index)=>{
            return(
              <div    onClick={()=>{
                router.push(`/view_profile/${user.userId.userName}`)
              }}  className={styles.userCard} key={index}>
                 <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                   <div className={styles.profilePicture}>
                     <img src={`${BASEEURL}/${user.userId.profilePicture}`} alt="" />
                   </div>
                   <div className={styles.profileInfo}>
                    <h3>{user.userId.name}</h3>
                    <p>{user.userId.userName}</p>
                   </div>
                   <button onClick={(e)=>{
                    e.stopPropagation();
                    dispatch(AcceptConnectionsRequest({
                      connectionId:user._id,
                      token:localStorage.getItem("token"),
                      action:"accept"
                    }))
                   }} className={styles.AcceptBtn}>Accept</button>
                 </div>

              </div>
            )
          })}
          <h4>My Network</h4>
           {authState.connectionRequests.length !==0 && authState.connectionRequests.filter((connection)=> connection.status_accepted != null).map((user,index)=>{
           const friend =
    user.userId._id === authState.user.userId._id
        ? user.connectionId
        : user.userId;
            return(
              <div    onClick={()=>{
                router.push(`/view_profile/${friend.userName}`)
              }}  className={styles.userCard} key={index}>
                 <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
                   <div className={styles.profilePicture}>
                     <img src={`${BASEEURL}/${friend.profilePicture}`} alt="" />
                   </div>
                   <div className={styles.profileInfo}>
                    <h3>{friend.name}</h3>
                    <p>{friend.userName}</p>
                   </div>

                 </div>

              </div>
            )
          })}
        </div>
      </DashBoardLayout>
    </UserLayout>
  )
}
