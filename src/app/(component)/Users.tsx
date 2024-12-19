import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import userStore from '@/states/store';
import { Trash2, UserPen } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import DeleteUserConfirm from './DeleteUserConfirm';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface Business {
    name: string | null;
};

interface User {
    name: string;
    email: string;
    phone: string;
    role: string;
    Business: Business;
}

const Users = () => {
    const [del, setDel] = useState(false)
    const { users, email, role, setUsers, getUserByEmail } = userStore();
    const setUserEmail = userStore((state) => state.setUserEmail);
    const router = useRouter();
    const [openDel, setOpenDel] = useState(false)
    const [allow, setAllow] = useState(false)
    const [delUser, setDelUser] = useState('')

    const handleEdit = (userEmail: string) => {
        setUserEmail(userEmail);
        const user = getUserByEmail(userEmail);

        if (role === 'User') {
            toast.warn("Access Denied! You are not authorized to perform this action.")
            console.log('Access Denied! You are not authorized to perform this action.');
            return;
        }
        if (role === 'Admin' && user?.role === 'SuperAdmin') {
            toast.warn("Access Denied! You are not authorized to perform this action.")
            console.log('Access Denied! Only SuperAdmin is authorized to perform this action.');
            return;
        }
        router.push('/dashboard/updateUser');
        return;
    };

    const handleDelete = async (userEmail: string) => {
        const user = getUserByEmail(userEmail);

        if (email === userEmail) {
            toast.error("You cannot delete yourself")
            console.log('You cannot delete yourself');
            return;
        }

        if (role === 'User') {
            toast.warn('Access Denied! You are not authorized to perform this action.')
            console.log('Access Denied! You are not authorized to perform this action.');
            return;
        }
        if (role === 'Admin' && user?.role === 'SuperAdmin') {
            toast.warn('Access Denied! Only SuperAdmin is authorized to perform this action.')
            console.log('Access Denied! Only SuperAdmin is authorized to perform this action.');
            return;
        }

        console.log('Delete user:', userEmail);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${SERVER}/delete/${userEmail}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
            })

            const data = await response.json();

            if (!response.ok) {
                console.log('Error updating user', data.message);
                return;
            }

            console.log(data.message)
            toast.success(data.message)
            setDel(!del);
        } catch (error: any) {
            toast.error(error.message)
            console.log(error);
        }
    };

    useEffect(() => {
        if (allow) {
            handleDelete(delUser)
            setAllow(false)
        }
    }, [allow])

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${SERVER}/users`);
            const data = await response.json();

            if (!response.ok) {
                console.log('Error displaying users: ', data.message);
                return;
            }

            const allUsers = data.users.map(({ name, role, phone, email, Business }: User) => ({
                name,
                role,
                phone,
                email,
                businessName: Business?.name || null,
            }));

            setUsers(allUsers);
        };

        fetchUsers();
    }, [del]);

    return (
        <div className='w-full max-h-[60vh] md:max-h-[49vh] overflow-x-auto overflow-y-auto'>
            <ToastContainer />
            <table className='border-collapse w-full'>
                <thead className='top-0 sticky bg-sky-100 font-bold text-left text-sm md:text-base'>
                    <tr>
                        <th className='border-slate-700 p-3 border'>Name</th>
                        <th className='border-slate-700 p-3 border'>Email</th>
                        <th className='border-slate-700 p-3 border'>Phone Number</th>
                        <th className='border-slate-700 p-3 border'>Role</th>
                        <th className='border-slate-700 p-3 border'>Business Name</th>
                        <th className="border-slate-700 p-3 border">Actions</th>
                    </tr>
                </thead>
                <tbody className='text-xs md:text-base'>
                    {users.map(user => (
                        <tr key={user.email}>
                            <td className='border-slate-700 p-3 border text-left'>{user.name}</td>
                            <td className='border-slate-700 p-3 border text-left'>{user.email}</td>
                            <td className='border-slate-700 p-3 border text-left'>{user.phone}</td>
                            <td className='border-slate-700 p-3 border text-left'>{user.role}</td>
                            <td className='border-slate-700 p-3 border text-left'>{user.businessName}</td>
                            <td className='border-slate-700 px-1 py-3 border text-center'>
                                <button onClick={() => handleEdit(user.email)} className='pr-2 hover:text-green-400 hover:animate-bounce'><UserPen className='size-5' /></button>
                                <button onClick={() => { setOpenDel(true); setDelUser(user.email); }} className='pl-2 hover:text-red-500 hover:animate-bounce'><Trash2 className='size-5' /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DeleteUserConfirm openDel={openDel} setOpenDel={setOpenDel} delUser={delUser} setAllow={setAllow} />
        </div >
    )
}

export default Users