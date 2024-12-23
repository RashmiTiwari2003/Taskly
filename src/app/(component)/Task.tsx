'use client'
import React, { Dispatch, SetStateAction, useState, useRef, useEffect, createRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import { updateTask } from '@/states/taskApi';
import userStore from '@/states/store';
import Select, { MultiValue } from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Info } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

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

interface TaskType {
    id: string;
    name: string;
    content: string;
    assignedByEmail: string;
    assignedToEmails: string[];
    startDate?: Date | null;
    dueDate?: Date | null;
}

interface ColumnsState {
    [key: string]: {
        id: string;
        name: string;
        order: number;
        Tasks: TaskType[];
    };
}

interface TaskProps {
    openTask: boolean;
    setOpenTask: Dispatch<SetStateAction<boolean>>;
    taskId: string;
    taskColumnId: string;
    editingTask: TaskType;
    setEditingTask: Dispatch<SetStateAction<TaskType>>;
    setIsUpdated: () => void;
    columns: ColumnsState;
}

interface OptionType {
    value: string;
    label: string;
}

const Task = ({ openTask, setOpenTask, taskId, taskColumnId, editingTask, setEditingTask, setIsUpdated, columns }: TaskProps) => {
    // const { updated, setIsUpdated } = userStore()
    const [taskName, setTaskName] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [assignedToForTasks, setAssignedToForTasks] = useState<Record<string, string[]>>({});
    const [pendingAssignedToEmails, setPendingAssignedToEmails] = useState<string[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(editingTask.startDate || null);
    const [dueDate, setDueDate] = useState<Date | null>(editingTask.dueDate || null);
    const { users, setUsers } = userStore();

    const handleStartDateChange = (date: Date | null) => {
        if (!date) return;
        console.log(date)

        const DueDate = editingTask.dueDate ?? null;

        if (dueDate && dueDate < date) {
            toast.error("Start Data cannot be greater than due date")
            return;
        }

        setStartDate(date);

        updateTask(
            taskId,
            editingTask.name,
            editingTask.content,
            editingTask.assignedByEmail,
            editingTask.assignedToEmails,
            taskColumnId,
            date,
            DueDate,
            setIsUpdated
        );
    };

    const handleDueDateChange = (date: Date | null) => {
        if (!date) return;
        console.log(date)

        const StartDate = editingTask.startDate ?? null;

        if (startDate && startDate > date) {
            toast.error("Due Data cannot be less than start date")
            return;
        }

        setDueDate(date);

        updateTask(
            taskId,
            editingTask.name,
            editingTask.content,
            editingTask.assignedByEmail,
            editingTask.assignedToEmails,
            taskColumnId,
            StartDate,
            date,
            setIsUpdated
        );
    };

    useEffect(() => {
        if (editingTask && editingTask.id) {
            setAssignedToForTasks((prevState) => ({
                ...prevState,
                [editingTask.id]: editingTask.assignedToEmails || [],
            }));
            setPendingAssignedToEmails(editingTask.assignedToEmails || []);
            setStartDate(editingTask.startDate || null);
            setDueDate(editingTask.dueDate || null);
            setTaskName(editingTask.name);
            setTaskContent(editingTask.content);
        }
    }, [openTask]);

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
    }, []);

    const EmailSearch: OptionType[] = users.map((user) => ({
        value: user.email,
        label: user.email,
    }));

    const handleAssignedToChange = (selectedOptions: MultiValue<OptionType>) => {
        const updatedAssignedToEmails = selectedOptions.map(option => option.value);
        setPendingAssignedToEmails(updatedAssignedToEmails);

    };

    useEffect(() => {
        setAssignedToForTasks((prevState) => ({
            ...prevState,
            [taskId]: pendingAssignedToEmails,
        }));
    }, [pendingAssignedToEmails])

    const handleSave = () => {
        updateTask(
            taskId,
            taskName,
            taskContent,
            editingTask.assignedByEmail,
            pendingAssignedToEmails,
            taskColumnId,
            startDate,
            dueDate,
            setIsUpdated
        );
    };

    const handleColumnChange = (taskId: string, name: string, content: string, assignedByEmail: string, assignedToEmails: string[], columnId: string, startDate: Date | null, dueDate: Date | null) => {
        updateTask(taskId, name, content, assignedByEmail, assignedToEmails, columnId, startDate, dueDate, setIsUpdated)
        setOpenTask(false)
        toast.success("Task moved successfully")
    }

    return (
        <>
            <Dialog open={openTask} onOpenChange={setOpenTask}>
                <DialogContent className="flex md:flex-row flex-col py-4 md:py-12 min-w-[90%] md:min-h-[85%] max-h-[90%]">
                    <ToastContainer />
                    <DialogHeader>
                        <DialogTitle>
                            <div className='flex justify-end items-center md:hidden px-3'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button><ChevronDown size={20} absoluteStrokeWidth /></button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='flex flex-col md:hidden mx-4'>
                                        <DropdownMenuLabel>{columns[taskColumnId].name}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {
                                            Object.entries(columns)
                                                .filter(([id]) => id !== taskColumnId)
                                                .map(([id, column]) => {
                                                    const currentColumn = columns[taskColumnId]

                                                    return (
                                                        <div key={id} onClick={() => handleColumnChange(taskId, taskName, taskContent, editingTask.assignedByEmail, editingTask.assignedToEmails, column.id, startDate, dueDate)}>
                                                            <DropdownMenuItem>
                                                                {currentColumn.order < column.order ?
                                                                    `${currentColumn.name} >> ${column.name}` :
                                                                    `${column.name} << ${currentColumn.name}`}
                                                            </DropdownMenuItem>
                                                        </div>
                                                    );
                                                })
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div className='px-2 md:px-4 w-full md:w-2/3' >
                        <div className='flex flex-col justify-start items-start gap-4 h-full'>
                            <input className='p-2 rounded-md w-full text-lg md:text-3xl outline-1 outline-slate-200' type="text" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
                            <div className='w-full h-32 md:h-2/5'>
                                <textarea className='p-2 rounded-md ring-0 w-full h-full text-sm md:text-base outline-1 outline-slate-200' value={taskContent}
                                    placeholder={taskContent}
                                    onChange={(e) => setTaskContent(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='border-2 border-slate-200 rounded-lg w-full md:w-1/3 overflow-y-auto'>
                        <div className='flex items-center bg-slate-200 px-4 rounded-t-lg w-full h-8 md:h-12'>
                            Details
                        </div>
                        <div className='flex flex-col gap-2 md:gap-4 bg-white px-5 py-3 w-full h-[90%]'>
                            <div className='flex justify-start items-center gap-3 md:gap-5 w-full'>
                                <label className='text-sm'>Assigned By</label>
                                <input className='px-2 py-2 rounded-md w-2/3 text-slate-700 text-sm' type="text" disabled value={editingTask.assignedByEmail} />
                            </div>
                            <div className='flex flex-row md:flex-col justify-start md:justify-normal items-center md:items-baseline gap-3 w-full'>
                                <label className='text-sm'>Assigned To</label>
                                <Select<OptionType, true>
                                    defaultValue={[]}
                                    isMulti
                                    name="assignedTo"
                                    options={EmailSearch}
                                    value={
                                        assignedToForTasks[taskId]?.length > 0
                                            ? assignedToForTasks[taskId].map((email) => ({
                                                value: email,
                                                label: email,
                                            }))
                                            : []
                                    }
                                    className="w-2/3 md:w-full text-sm basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={(selectedOptions) => {
                                        handleAssignedToChange(selectedOptions || []);
                                    }}
                                />
                            </div>
                            <div className="flex flex-row md:flex-col justify-center md:justify-normal items-center md:items-baseline w-full">
                                <label className="block mb-2 w-1/2 md:w-auto font-semibold text-sm">Start Date</label>
                                <div className="customDatePickerWidth">
                                    <DatePicker
                                        className='border-2 border-slate-200 px-2 py-1 md:p-2 rounded-md w-fit md:w-full text-center'
                                        selected={startDate ?? new Date()}
                                        minDate={new Date()}
                                        popperPlacement="bottom-end"
                                        onChange={handleStartDateChange}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col justify-center md:justify-normal items-center md:items-baseline w-full">
                                <label className="block mb-2 w-1/2 md:w-auto font-semibold text-sm">Due Date</label>
                                <div className="customDatePickerWidth">
                                    <DatePicker
                                        className='border-2 border-slate-200 px-2 py-1 md:p-2 rounded-md w-fit md:w-full text-center'
                                        selected={dueDate ?? new Date()}
                                        minDate={new Date()}
                                        popperPlacement="bottom-end"
                                        onChange={handleDueDateChange}
                                    />
                                </div>
                            </div>
                            <div className='md:flex justify-center items-center hidden w-full text-center'>
                                <div className='flex items-center my-1'>
                                    <Info size={16} className='mr-1 text-red-500' />
                                    <span className="text-red-500 text-sm">
                                        Remember to click button to save changes
                                    </span>
                                </div>
                            </div>
                            <div className='flex justify-end items-end mt-3 md:mt-auto w-full'>
                                <button onClick={handleSave} className="bg-blue-500 ml-2 px-4 py-2 rounded text-white text-xs md:text-base">
                                    Update Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default Task