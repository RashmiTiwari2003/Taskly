'use client'
import Protected from '@/app/(component)/Protected'
import userStore from '@/states/store';
import Image from 'next/image';
import { Info } from 'lucide-react';
import React, { useReducer, useState } from 'react'
import { initialState, reducer } from '@/states/reducer';
import { toast, ToastContainer } from 'react-toastify';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface Payload {
  name: string;
  email: string;
  role: string;
  password: string;
  phone: string;
}

const Profile = () => {
  const { name, email, role, phone, businessName, setState } = userStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEditable, setIsEditable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [confirmPass, setConfirmPass] = useState('');

  const toggleEditability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditable) {
      const payload: Partial<Payload> = {};
      if (name !== state.userName && state.userName !== '') {
        payload.name = state.userName;
      }
      if (phone !== state.userPhone && state.userPhone !== '') {
        payload.phone = state.userPhone;
      }
      if (state.userPassword !== '') {
        payload.password = state.userPassword
      }
      if (state.userPassword !== confirmPass) {
        toast.error('Passwords do not match.')
        console.log('Passwords do not match.');
        return;
      }

      try {
        const response = await fetch(`${SERVER}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ payload, email })
        })

        const data = await response.json();

        if (!response.ok) {
          console.log('Error updating user', data.message);
          return;
        }

        if (!data.user) {
          toast.error('Update unsuccessful')
          console.log('Update unsuccessful')
          return;
        }

        console.log(data.message)
        toast.success(data.message)

        setState(data.user.name, data.user.role, data.user.phone, data.user.businessName);
      } catch (error: any) {
        toast.error(error.message)
        console.log(error.message);
      }
    }
    setIsEditable(!isEditable);
  }

  const handlePasswordConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPass(e.target.value);
    setConfirmError(e.target.value !== state.userPassword);
  }

  return (
    <Protected>
      <div className='relative flex flex-col justify-center items-start px-4 md:px-20 w-full h-full'>
        <ToastContainer />
        <div className='flex flex-col justify-start mb-10 pt-20 w-full md:w-1/2'>
          <div className='pb-4 border-b-2 w-full text-lg md:text-3xl'>Your details</div>
        </div>
        <div className='flex w-full'>
          <form className='flex flex-col gap-7 mb-2 md:mb-6 w-full md:w-2/3'>
            <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
              <label htmlFor="name" className='w-1/3 font-sans text-gray-700 text-md text-start md:text-lg'>Name :</label>
              {isEditable ? (
                <input type="text" placeholder={name ?? ''} value={state.userName} onChange={(e) => dispatch({ type: 'SET_USER_NAME', payload: e.target.value })} className={`p-2 rounded-md w-3/4 md:w-full border-2 ${isEditable ? 'border-black' : 'border-gray-300'}  p-2 rounded-md w-full`} />) :
                (<span className='inline-block border-2 border-gray-300 p-2 rounded-md w-full h-11'>
                  {name ?? 'No name provided'}
                </span>
                )}
            </div>
            <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
              <label htmlFor="email" className='w-1/3 font-sans text-gray-700 text-md text-start md:text-lg'>Email Address :</label>
              <input disabled type="text" placeholder={email ? email : 'No email provided'} onChange={(e) => dispatch({ type: 'SET_USER_EMAIL', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-full' />
            </div>
            <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
              <label htmlFor="phone" className='w-1/3 font-sans text-gray-700 text-md text-start md:text-lg'>Phone :</label>
              <div className='relative flex flex-col w-full'>
                {isEditable ? (
                  <input type="text" placeholder={phone ?? ''} value={state.userPhone} onChange={(e) => dispatch({ type: 'SET_USER_PHONE', payload: e.target.value })} className={`p-2 rounded-md w-3/4 md:w-full border-2 ${isEditable ? 'border-black' : 'border-gray-300'}  p-2 rounded-md w-full`} />) :
                  (<span className='inline-block border-2 border-gray-300 p-2 rounded-md w-full h-11'>
                    {phone ?? 'No phone number'}
                  </span>
                  )}
                {state.phoneError && (
                  <div className='top-full absolute flex items-center my-1'>
                    <Info size={16} className='mr-1 text-red-500' />
                    <span className="text-red-500 text-sm">
                      Phone number must be 10 digits.
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
              <label htmlFor="password" className='w-1/3 font-sans text-gray-700 text-md text-start md:text-lg'>Update Password :</label>
              <div className='relative flex flex-col w-full'>
                <div className='relative w-full'>
                  <input type={showPassword ? 'text' : 'password'} disabled={!isEditable} placeholder='Enter 6 characters or more ' value={state.userPassword} onChange={(e) => dispatch({ type: 'SET_USER_PASSWORD', payload: e.target.value })} className={`p-2 rounded-md w-3/4 md:w-full border-2 ${isEditable ? 'border-black' : 'border-gray-300'}  p-2 rounded-md w-full`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className='right-2 absolute inset-y-0'>
                    {showPassword ? <Image src="/images/password-hide.png" alt='icon' width={20} height={20} /> : <Image src="/images/password-show.png" alt='icon' width={20} height={20} />}
                  </button>
                </div>
                {state.passwordError && (
                  <div className='top-full absolute flex items-center my-1'>
                    <Info size={16} className='mr-1 text-red-500' />
                    <span className="text-red-500 text-sm">
                      Password must be at least 6 characters long.
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
              <label htmlFor="password" className='w-1/3 font-sans text-gray-700 text-md text-start md:text-lg'>Confirm Password :</label>
              <div className='relative flex flex-col w-full'>
                <div className='relative w-full'>
                  <input type={showConfirmPass ? 'text' : 'password'} disabled={!isEditable} placeholder='Enter same password ' value={confirmPass} onChange={handlePasswordConfirm} className={`p-2 rounded-md w-3/4 md:w-full border-2 ${isEditable ? 'border-black' : 'border-gray-300'}  p-2 rounded-md w-full`} />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className='right-2 absolute inset-y-0'>
                    {showConfirmPass ? <Image src="/images/password-hide.png" alt='icon' width={20} height={20} /> : <Image src="/images/password-show.png" alt='icon' width={20} height={20} />}
                  </button>
                </div>
                {confirmError && (
                  <div className='top-full absolute flex items-center my-1'>
                    <Info size={16} className='mr-1 text-red-500' />
                    <span className="text-red-500 text-sm">
                      Password must be the same.
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
              <label htmlFor="role" className='w-1/3 font-sans text-gray-700 text-md text-start md:text-lg'>Role :</label>
              <input disabled type="text" placeholder={role ?? ''} value={state.userRole} onChange={(e) => dispatch({ type: 'SET_USER_ROLE', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-full' />
            </div>
            <div className='flex justify-start md:justify-center items-center gap-2 md:gap-4'>
              <label htmlFor="business" className='w-1/3 font-sans text-gray-700 text-md text-start md:text-lg'>Business :</label>
              <input disabled type="business" placeholder={businessName ?? ''} value={state.businessName} onChange={(e) => dispatch({ type: 'SET_BUSINESS_NAME', payload: e.target.value })} className='border-2 border-gray-300 p-2 rounded-md w-full' />
            </div>
            <div className='flex justify-end w-full'>
              <button onClick={toggleEditability} className='bg-blue-600 px-6 py-2 rounded-md text-white transition ease-in-out hover:scale-110'>{isEditable ? 'Save' : 'Update'}</button>
            </div>
          </form>
        </div>
      </div>
    </Protected >
  )
}

export default Profile