'use client'
import { useRouter } from 'next/navigation';
import Protected from './Protected';
import Users from './Users';
import userStore from '@/states/store';
import { UserPlus } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const Dashboard = () => {
    const { role } = userStore();
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
            <ToastContainer />
            <div className='relative flex flex-col items-center w-full h-full'>
                <div className='font-semibold text-xl md:text-3xl'>Users List</div>
                <div className='flex flex-col justify-center items-center mt-2 md:mt-5 px-3 w-full md:w-5/6'>
                    <div className='flex justify-between items-center py-3 w-full'>
                        <div className='flex justify-center items-center w-full'>
                            <button onClick={createUser} className='flex flex-row justify-center items-center gap-2 bg-blue-600 ml-auto px-2 py-2 rounded-md text-sm text-white md:text-base transition ease-in-out group hover:scale-110'>Add User<UserPlus className='group-hover:animate-shake size-5' /></button>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className=''>
                            <Users />
                        </div>
                    </div>
                </div>
            </div>
        </Protected>
    )
}

export default Dashboard