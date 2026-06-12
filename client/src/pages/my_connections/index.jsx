
import React from 'react'
import UserLayout from '../layout/Navbar'
import DashBoardLayout from '../layout/DashboardLayout'

export default function MyConnections() {
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
