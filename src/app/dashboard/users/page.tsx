'use client'
import userStore from "@/states/store"
import { cn } from "@/lib/utils"
import UsersBusiness from "./UsersBusiness"
import Protected from "@/app/(component)/Protected"
import UserSidebar from "../userSidebar"
import Navbar from "@/app/(component)/Navbar"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from 'react-toastify';
import { UserPlus } from "lucide-react"

const Dashboardhome = () => {
    const { role, isOpen } = userStore();
    const router = useRouter();
    const createUser = () => {
        if (role === 'User') {
            toast.error('Access Denied! You are not authorized to perform this action.')
            console.log('Access Denied! You are not authorized to perform this action.');
            return;
        }
        router.push('/dashboard/newUser');
        return;
    }

    return (
        <Protected>
            <div className='flex flex-col min-h-[100svh]'>
                <ToastContainer />
                <Navbar navbarName={'Dashboard'} />
                <div className="flex">
                    <UserSidebar />
                    <div className={cn(`flex mt-28 md:mt-36 flex-col ml-auto transition-all duration-300`, ` ${isOpen ? 'w-5/6' : 'w-11/12'}`, 'w-full')}>
                        <div className='relative flex flex-col items-center w-full h-full'>
                            <div className='font-semibold text-xl md:text-3xl'>Users List</div>
                            <div className='flex flex-col justify-center items-center mt-2 md:mt-5 px-3 w-full md:w-5/6'>
                                <div className='flex justify-between items-center py-3 w-full'>
                                    <div className='flex justify-center items-center w-full'>
                                        <button onClick={createUser} className={`flex flex-row justify-center items-center gap-2 bg-blue-600 ml-auto px-2 py-2 rounded-md text-sm text-white md:text-base transition ease-in-out group hover:scale-110 ${role==='User'?'hidden':''}`}>Add User<UserPlus className='group-hover:animate-shake size-5' /></button>
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <div className=''>
                                        <UsersBusiness />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Protected>
    )
}

export default Dashboardhome