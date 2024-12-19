'use client'
import userStore from '@/states/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from './Loading';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

const Protected = ({ children }: { children: React.ReactNode }) => {
    const name = userStore((state) => state.name)
    const { setState, setEmail } = userStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/');
            return;
        }
        try {
            const response = await fetch(`${SERVER}/me`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                console.log('Error fetching data');
                return;
            }

            const data = await response.json();

            if (!data.user) {
                router.push('/')
                return;
            }

            setState(data.user.name, data.user.role, data.user.phone, data.user.businessName);
            setEmail(data.user.email);

            if (data.user.role === 'SuperAdmin') {
                router.push(`/superadmin`)
                return;
            }

            if (data.user.role === 'Admin' || data.user.role === 'User') {
                router.push('/dashboard')
                return;
            }
        } catch (error) {
            console.error('Error during fetch:', error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (!name) {
            handleLoad()
        } else {
            setIsLoading(false);
        }
    }, [name])

    return (
        <>{isLoading ? <Loader /> : <>{children}</>}</>
    )
}

export default Protected