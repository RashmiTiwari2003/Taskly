import React, { Dispatch, SetStateAction } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { ToastContainer } from 'react-toastify'

interface LayoutProps {
    openDel: boolean;
    setOpenDel: Dispatch<SetStateAction<boolean>>;
    delUser: string
    setAllow: Dispatch<SetStateAction<boolean>>;
}

const DeleteUserConfirm = ({ openDel, setOpenDel, delUser, setAllow }: LayoutProps) => {
    return (
        <>
            <Dialog open={openDel} onOpenChange={setOpenDel}>
                <DialogContent className="px-5 rounded-lg md:w-auto max-w-[80%]">
                    <ToastContainer />
                    <DialogHeader>
                        <DialogTitle className='text-center'>Confirm User Delete</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col justify-center items-center gap-5 text-sm md:text-base'>
                        <div className='text-center'>
                            Are you sure you want to delete {delUser}?
                        </div>
                        <div className='flex justify-center items-center gap-3'>
                            <button
                                onClick={() => { setAllow(true); setOpenDel(false); }}
                                className='bg-green-400 px-5 py-2 rounded-sm cursor-pointer'
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => { setAllow(false); setOpenDel(false); }}
                                className='bg-red-400 px-5 py-2 rounded-sm cursor-pointer'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default DeleteUserConfirm