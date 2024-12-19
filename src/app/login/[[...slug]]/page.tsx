'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import userStore from '@/states/store';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const LoginHome = () => {
    const { slug } = useParams();
    const { email, setEmail } = userStore()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loginEmail, setLoginEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [existingUser, setExistingUser] = useState<{ email: string, role: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(loginEmail)
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
            localStorage.removeItem('token');
        }
        try {
            const payload = { email: loginEmail, password: password };
            const response = await fetch(`${SERVER}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payload })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message)
                console.log('Error logging user in: ', data.message);
            }

            if (data.message === 'Login successful') {
                toast.success(data.message)
                setEmail(loginEmail)
                localStorage.setItem('token', data.token);
                if (data.user.role === "SuperAdmin") {
                    router.replace(`/superadmin`)
                } else {
                    router.replace(`/dashboard`);
                }
            }
        } catch (error: any) {
            toast.error(error.message)
            console.log(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchEmail = async () => {
        try {
            const id = slug?.[0];
            const response = await fetch(`${SERVER}/findUser/${id}`);
            const data = await response.json();

            // console.log(data)
            setLoginEmail(data.email)
        } catch (error: any) {
            // console.log(error.message);
        }
    }

    useEffect(() => {
        if (slug && slug?.length > 0) {
            fetchEmail()
        }
    }, [slug])

    useEffect(() => {
        fetchExistingUser();
    }, [])

    const fetchExistingUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${SERVER}/validateToken`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setExistingUser({ email: data.user.email, role: data.user.role });
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('Error validating token: ', error);
            }
        }
    }

    const handleLoginAs = (e: React.FormEvent) => {
        e.preventDefault();
        setEmail(loginEmail)
        if (existingUser?.role === "SuperAdmin") {
            router.replace(`/superadmin`);
        } else {
            router.replace(`/dashboard`);
        }
    }

    return (
        <div className='flex justify-center items-center bg-[url(/images/mountain-photo.jpg)] bg-cover w-full h-screen'>
            <ToastContainer />
            <div className='flex justify-center items-center backdrop-blur-md w-full h-full'>
                <div className='flex justify-center items-center gap-5 border-2 border-gray-400 bg-white rounded-lg w-3/4 lg:w-3/5 md:h-1/2 lg:h-3/4'>
                    <div className='md:flex hidden w-64 xl:w-auto h-64 xl:h-auto'>
                        <Image src="/images/login-page.jpg" alt="profile" width={500} height={500} />
                    </div>
                    <div id='login-form' className='flex flex-col justify-center items-start md:items-start p-5 w-full md:w-1/2 lg:w-1/3 h-full'>
                        <div className='mb-3 font-semibold text-3xl'>Login</div>
                        <form className='flex flex-col justify-center items-start gap-2 w-full'>
                            <label htmlFor="email" className='text-gray-700'>Email Address</label>
                            <input type="email" placeholder={loginEmail?.length > 0 ? loginEmail : "Enter Email"} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className='border-2 border-gray-300 p-2 rounded-md w-full text-sm' />
                            <label htmlFor="password" className='text-gray-700'>Password</label>
                            <div className='relative w-full'>
                                <input type={showPassword ? 'text' : 'password'} placeholder='Enter 6 characters or more ' value={password} onChange={(e) => setPassword(e.target.value)} className='border-2 border-gray-300 p-2 rounded-md w-full text-sm' />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className='right-2 absolute inset-y-0'>
                                    {showPassword ? <Image src="/images/password-hide.png" alt='icon' width={20} height={20} /> : <Image src="/images/password-show.png" alt='icon' width={20} height={20} />}
                                </button>
                            </div>
                            <div className='flex justify-end w-full'>
                                {isLoading ? <div className='flex justify-center items-center'><Image src="/svgs/loader.svg" alt="Loading..." width={60} height={60} style={{ height: 'auto', width: 'auto' }} /></div> :
                                    <button onClick={handleSubmit} className='bg-blue-600 mt-4 px-6 py-2 rounded-md text-white transition ease-in-out hover:scale-110'>Log In</button>
                                }
                            </div>
                            {existingUser && (
                                <div className='flex flex-col justify-center items-center border-gray-300 bg-gray-100 mt-4 p-3 border rounded-md w-full'>
                                    <p className='mr-auto text-gray-700 text-sm'>Login as <strong>{existingUser.email}</strong></p>
                                    <button onClick={handleLoginAs} className='bg-green-500 mt-2 ml-auto px-4 py-1 rounded text-white transition ease-in-out hover:scale-110'>Login</button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginHome