import React, { useState } from 'react';
import Link from 'next/link';
import userStore from '@/states/store';
import Image from 'next/image';

const UserSidebar = () => {
  const { isOpen, setIsOpen } = userStore();
return (<></>)
  return (
    <div className={`fixed top-0 z-20 left-0 h-screen ${isOpen ? 'w-1/6' : 'w-1/12'} transition-all duration-300 flex text-white flex-col bg-blue-500`} >
      <div className='flex flex-col h-screen'>
        <button className={`flex items-center mx-5 mt-5 mb-2 ${isOpen ? 'justify-end' : 'justify-center'}`} onClick={setIsOpen}>
          <Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} />
        </button>
        {isOpen ? (
          <div className='flex flex-col mt-2 p-3 w-full text-black'>
            <Link className='flex justify-between items-center my-3 px-2 w-full' href="/">Home<Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} /></Link>
            <Link className='flex justify-between items-center my-3 px-2 w-full' href="/">About<Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} /></Link>
            <Link className='flex justify-between items-center my-3 px-2 w-full' href="/">Services<Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} /></Link>
            <Link className='flex justify-between items-center my-3 px-2 w-full' href="/">Contact<Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} /></Link>
          </div>
        ) :
          <div className='flex flex-col items-center mt-2 p-3 w-full h-screen'>
            <div className='my-3'>
              <Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} />
            </div>
            <div className='my-3'>
              <Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} />
            </div>
            <div className='my-3'>
              <Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} />
            </div>
            <div className='my-3'>
              <Image src="/images/sidebar-icon.png" alt='icon' width={30} height={30} />
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default UserSidebar;
