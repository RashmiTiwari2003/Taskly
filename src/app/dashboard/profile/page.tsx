'use client'
import Navbar from '@/app/(component)/Navbar';
import React from 'react';
import UserSidebar from '../userSidebar';
import userStore from '@/states/store';
import Profile from './Profile';
import { cn } from '@/lib/utils';

const CreateUserPage = () => {
  const { isOpen } = userStore();
  return (
    <div className='flex flex-col'>
      <Navbar navbarName='User Profile' />
      <div className="flex">
        <UserSidebar />
        <div className={cn(`flex mt-2 md:mt-8 flex-col ml-auto transition-all duration-300`, `${isOpen ? 'w-5/6' : 'w-11/12'}`, 'w-full')}>
          <Profile />
        </div>
      </div>
    </div >
  )
}

export default CreateUserPage