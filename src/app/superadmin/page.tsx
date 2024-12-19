'use client'
import userStore from "@/states/store"
import Dashboard from "../(component)/Dashboard"
import Navbar from "../(component)/Navbar"
import UserSidebar from "../dashboard/userSidebar"
import Protected from "../(component)/Protected"
import { cn } from "@/lib/utils"

const Dashboardhome = () => {
  const { isOpen } = userStore();

  return (
    <Protected>
    <div className='flex flex-col min-h-[100svh]'>
      <Navbar navbarName={'Dashboard'} />
      <div className="flex">
        <UserSidebar />
        <div className={cn(`flex mt-28 md:mt-36 flex-col ml-auto transition-all duration-300`,` ${isOpen ? 'w-5/6' : 'w-11/12'}`,'w-full')}>
          <Dashboard />
        </div>
      </div>
    </div>
    </Protected>
  )
}

export default Dashboardhome