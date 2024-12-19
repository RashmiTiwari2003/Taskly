'use client'
import userStore from "@/states/store"
import Navbar from "../(component)/Navbar"
import Tasks from "../(component)/Tasks"
import UserSidebar from "./userSidebar"
import Protected from "../(component)/Protected"
import { cn } from "@/lib/utils"

const Dashboardhome = () => {

  const { isOpen } = userStore();

  return (
    <Protected>
    <div className='flex flex-col h-[100svh]' >
      <Navbar navbarName={'Dashboard'} />
      <div className="flex mt-20">
        <UserSidebar />
        <div className={cn('flex  flex-col ml-auto transition-all duration-300',`${isOpen ? 'w-5/6' : 'w-11/12'}`,'w-full')}>
          {/* <Dashboard /> */}
          <Tasks />
          {/* <Projects /> */}
        </div>
      </div>
    </div>
    </Protected>
  )
}

export default Dashboardhome