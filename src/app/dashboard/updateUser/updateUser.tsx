import Protected from '@/app/(component)/Protected'
import userStore from '@/states/store';
import { initialState, State, reducer } from '@/states/reducer';
import { useReducer, useState } from 'react';
import { Info } from 'lucide-react';
import { toast } from 'react-toastify';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface Payload {
    name: string;
    email: string;
    role: string;
    phone: string;
}

const UpdateUser = () => {
    const { userEmail, getUserByEmail, setState, role } = userStore();
    const [state,dispatch] = useReducer(reducer, initialState);

    if (!userEmail) {
        console.log('User email not found');
        return;
    }
    const user = getUserByEmail(userEmail);
    const [userName, setUserName] = useState(user?.name);
    const [userPhone, setUserPhone] = useState(user?.phone);
    const [email, setEmail] = useState(user?.email);
    const [userRole, setUserRole] = useState(user?.role);

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Partial<Payload> = {};
        if (user?.name !== userName && userName !== '') {
            payload.name = userName;
        }
        if (user?.email !== email && email !== '') {
            payload.name = email;
        }
        if (user?.phone !== userPhone && userPhone !== '') {
            payload.phone = userPhone;
        }
        if (user?.role !== userRole && userRole !== '') {
            payload.role = userRole;
        }

        try {
            // console.log(payload);
            const token = localStorage.getItem("token");
            const response = await fetch(`${SERVER}/edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
                body: JSON.stringify({ payload, userEmail })
            })

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message)
                console.log('Error updating user', data.message);
                return;
            }

            if (!data.user) {
                toast.error('Update unsuccessful')
                console.log('Update unsuccessful')
                return;
            }

            toast.success(data.message)
            console.log(data.message)
        } catch (error: any) {
            toast.error(error.message)
            console.log(error.message);
        }
    }

    return (
        <Protected>
            <div className='flex flex-col justify-center items-start px-6 md:px-20 w-full h-full'>
                <div className='flex flex-col justify-start mb-10 pt-20 w-full md:w-1/2'>
                    <div className='pb-4 border-b-2 w-full text-lg md:text-3xl'>Your details</div>
                </div>
                <div className='flex w-full'>
                    <form className='flex flex-col gap-7 w-full md:w-2/3'>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="name" className='w-1/4 md:w-1/3 font-sans text-gray-700 text-start md:text-lg'>Name :</label>
                            <input disabled type="text" placeholder={user?.name} onChange={(e) => setUserName(e.target.value)} className='border-2 border-gray-300 p-2 rounded-md w-3/4 md:w-full' />
                        </div>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="email" className='w-1/4 md:w-1/3 font-sans text-gray-700 text-start md:text-lg'>Email Address :</label>
                            <input type="text" placeholder={user?.email} onChange={(e) => setEmail(e.target.value)} className='border-2 border-gray-300 p-2 rounded-md w-3/4 md:w-full' />
                        </div>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="phone" className='w-1/3 font-sans text-gray-700 text-start md:text-lg'>Phone :</label>
                            <div className='relative flex flex-col w-full'>
                                <input type="text" placeholder={user?.phone} onChange={(e) => dispatch({ type: 'SET_USER_PHONE', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-full' />
                                {state.phoneError && (
                                    <div className='top-full absolute flex items-center my-1'>
                                        <Info size={16} className='text-red-500 text-xs md:text-sm' />
                                        <span className="text-red-500 text-sm">
                                            Phone number must be 10 digits.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="role" className='w-1/4 md:w-1/3 font-sans text-gray-700 text-start md:text-lg'>Role :</label>
                            <input type="text" placeholder={user?.role} onChange={(e) => setUserRole(e.target.value)} className='border-2 border-gray-300 p-2 rounded-md w-3/4 md:w-full text-black' />
                        </div>
                        <div className='flex justify-end w-full'>
                            <button onClick={handleEdit} className='bg-blue-600 mt-4 px-6 py-2 rounded-md text-white transition ease-in-out hover:scale-110'>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </Protected >
    )
}

export default UpdateUser