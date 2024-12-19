'use client'
import Navbar from '@/app/(component)/Navbar';
import React from 'react';
import UserSidebar from '../userSidebar';
import userStore from '@/states/store';
import NewUser from './newUser';
import { cn } from '@/lib/utils';

const CreateUserPage = () => {
  const { isOpen } = userStore();
  return (
    <div className='flex flex-col'>
      <Navbar navbarName='New User' />
      <div className="flex">
        <UserSidebar />
        <div className={cn(`flex mt-8 flex-col ml-auto transition-all duration-300`, `${isOpen ? 'w-5/6' : 'w-11/12'}`, 'w-full')}>
          <NewUser />
        </div>
      </div>
    </div>
  )
}

export default CreateUserPage