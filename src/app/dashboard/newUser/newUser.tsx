'use client'
import Protected from '@/app/(component)/Protected';
import Image from 'next/image';
import React, { useReducer, useState } from 'react';
import { Copy, Info } from 'lucide-react';
import { reducer, initialState } from '@/states/reducer';
import Select, { SingleValue } from 'react-select';
import { toast, ToastContainer } from 'react-toastify';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface RoleOption {
    value: string;
    label: string;
}

const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'SuperAdmin', label: 'SuperAdmin' },
    { value: 'User', label: 'User' },
];

const NewUser = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [openLoginLink, setOpenLoginLink] = useState(false);
    const [loginLink, setLoginLink] = useState('');

    const onClient = typeof window !== 'undefined';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (state.passwordError) {
            toast.error('Cant submit form')
            return;
        }

        const token = localStorage.getItem("token");
        const payload = {
            name: state.userName,
            email: state.userEmail,
            phone: state.phoneError ? null : state.userPhone,
            password: state.userPassword,
            role: state.userRole,
            businessName: state.businessName
        };

        if (!payload.name || !payload.email || !payload.role || !payload.businessName) {
            toast.error('Missing Fields');
            return;
        }

        try {
            const response = await fetch(`${SERVER}/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
                body: JSON.stringify({ payload })
            })

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message)
                console.log('Error creating user: ', data.message);
                return;
            }

            toast.success(data.message)

            setLoginLink(`${BASE_URL}/login/${data.id}`);
            setOpenLoginLink(true)
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    const handleRoleChange = (selectedOption: SingleValue<RoleOption>) => {
        if (selectedOption) {
            dispatch({ type: 'SET_USER_ROLE', payload: selectedOption.value });
        } else {
            dispatch({ type: 'SET_USER_ROLE', payload: '' });
        }
    };

    return (
        <Protected>
            <div className='relative flex flex-col justify-center items-start px-6 md:px-20 w-full h-full'>
            <ToastContainer />
                <div className='flex flex-col justify-start mb-10 pt-20 w-full md:w-1/2'>
                    <div className='pb-4 border-b-2 w-full text-lg md:text-3xl'>Account Information</div>
                </div>
                <div className='flex w-full'>
                    <form className='flex flex-col gap-5 md:gap-7 w-full md:w-2/3'>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="name" className='w-1/4 md:w-1/3 font-sans text-gray-700 text-start md:text-lg'>Name :</label>
                            <input type="name" placeholder='User Name' value={state.userName} onChange={(e) => dispatch({ type: 'SET_USER_NAME', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-3/4 md:w-full' />
                        </div>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="email" className='w-1/4 md:w-1/3 font-sans text-gray-700 text-start md:text-lg'>Email Address :</label>
                            <input type="email" placeholder='UserEmail@example.com' value={state.userEmail} onChange={(e) => dispatch({ type: 'SET_USER_EMAIL', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-3/4 md:w-full' />
                        </div>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="phone" className='w-1/3 font-sans text-gray-700 text-start md:text-lg'>Phone :</label>
                            <div className='relative flex flex-col w-full'>
                                <input type="phone" placeholder='0123456789' value={state.userPhone} onChange={(e) => dispatch({ type: 'SET_USER_PHONE', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-full' />
                                {state.phoneError && (
                                    <div className='top-full absolute flex items-center my-1'>
                                        <Info size={16} className='mr-1 text-red-500' />
                                        <span className="text-red-500 text-xs md:text-sm">
                                            Phone number must be 10 digits.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4 mt-2 md:mt-0'>
                            <label htmlFor="password" className='w-1/3 font-sans text-gray-700 text-start md:text-lg'>Password :</label>
                            <div className='relative flex flex-col w-full'>
                                <div className='relative w-full'>
                                    <input type={showPassword ? 'text' : 'password'} placeholder='Enter 6 characters or more ' value={state.userPassword} onChange={(e) => dispatch({ type: 'SET_USER_PASSWORD', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-full' />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className='right-2 absolute inset-y-0'>
                                        {showPassword ? <Image src="/images/password-hide.png" alt='icon' width={20} height={20} /> : <Image src="/images/password-show.png" alt='icon' width={20} height={20} />}
                                    </button>
                                </div>
                                {state.passwordError && (
                                    <div className='top-full absolute flex items-center my-1'>
                                        <Info size={16} className='mr-1 text-red-500' />
                                        <span className="text-red-500 text-xs md:text-sm">
                                            Password must be at least 6 characters long.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-start md:justify-center items-center gap-2 md:gap-4 mt-6 md:mt-0">
                            <label htmlFor="role" className="w-1/3 font-sans text-gray-700 text-start md:text-lg">
                                Role :
                            </label>
                            <div className="w-full">
                                <Select
                                    id="role"
                                    options={roleOptions}
                                    value={roleOptions.find((option) => option.value === state.userRole)}
                                    onChange={handleRoleChange}
                                    placeholder="Select Role"
                                    className="rounded-md text-sm md:text-base"
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        {/* <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="role" className='w-1/4 md:w-1/3 font-sans text-gray-700 text-start md:text-lg'>Role :</label>
                            <input type="role" placeholder='Role' value={state.userRole} onChange={(e) => dispatch({ type: 'SET_USER_ROLE', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-3/4 md:w-full' />
                        </div> */}
                        <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
                            <label htmlFor="business" className='w-1/4 md:w-1/3 font-sans text-gray-700 text-start md:text-lg'>Business :</label>
                            <input type="business" placeholder='Business Name' value={state.businessName} onChange={(e) => dispatch({ type: 'SET_BUSINESS_NAME', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-3/4 md:w-full' />
                        </div>
                        <div className='flex justify-center items-center w-full'>
                            <div className={`flex justify-center items-center mr-auto w-3/5 ${openLoginLink ? 'block' : 'hidden'}`}>
                                <input
                                    type="text"
                                    value={loginLink}
                                    disabled
                                    className="border-2 border-gray-300 bg-gray-100 p-2 rounded-l-md w-full text-gray-600"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (onClient) {
                                            navigator.clipboard.writeText(loginLink)
                                        }
                                    }}
                                    className="border-2 bg-blue-600 px-4 py-2 border-blue-600 rounded-r-md text-white transition ease-in-out group hover:scale-110"
                                >
                                    <Copy className='group-hover:animate-shake' />
                                </button>
                            </div>
                            <button onClick={handleSubmit} className='bg-blue-600 ml-auto px-4 md:px-6 py-2 rounded-md text-sm text-white md:text-base transition ease-in-out hover:scale-110'>Create User</button>
                        </div>
                    </form>
                </div>
            </div>
        </Protected>
    )
}

export default NewUser