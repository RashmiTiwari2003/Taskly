import { useRouter } from 'next/navigation';
import userStore from '@/states/store';
import Avatar from './Avatar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';

interface NavbarProps {
    navbarName: string;
}

const Navbar: React.FC<NavbarProps> = ({ navbarName }) => {
    const router = useRouter();
    const { name, role, isOpen, setState } = userStore();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setState('', '', '', '');
        router.push('/');
    }

    return (
        <div className={cn(`top-0 right-0 z-20 fixed flex bg-blue-500  text-white opacity-85  transition-all duration-300 h-16`, `${isOpen ? 'w-5/6' : 'w-11/12'}`, 'w-full')}>
            <div className='flex mx-8'>
                <div className='flex items-center font-semibold text-2xl'>{navbarName}</div>
            </div>
            <div className='flex ml-auto'>
                <div className='md:flex justify-center items-center gap-8 hidden mx-6 md:w-full text-lg'>
                    {role !== 'SuperAdmin' && (
                        <div className='font-semibold text-sm cursor-pointer' onClick={() => router.push('/dashboard/users')}>
                            Users
                        </div>
                    )}
                    <button className='font-semibold text-sm hover:text-orange-200' onClick={handleLogout}>Logout</button>
                    <div onClick={() => router.push('/dashboard/profile')} className="cursor-pointer">
                        <Avatar name={`${name}`} size={40} />
                    </div>
                </div>
                <div className='flex justify-center items-center md:hidden px-3'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button><ChevronDown size={35} absoluteStrokeWidth /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='mx-4'>
                            {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                {role !== 'SuperAdmin' && (
                                    <div className='text-sm cursor-pointer' onClick={() => router.push('/dashboard/users')}>
                                        Users
                                    </div>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <div onClick={() => router.push('/dashboard/profile')} className="cursor-pointer">
                                    {name}
                                    {/* <Avatar name={`${name}`} size={40} /> */}
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <button className='text-sm hover:text-orange-200' onClick={handleLogout}>Logout</button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

export default Navbar