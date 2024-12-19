'use client'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { createPortal } from "react-dom";
import droppableDefault from '@/default';
import { CalendarPlus, Check, CircleX, Edit, Plus, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import userStore from '@/states/store';

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

interface Task {
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
        Tasks: Task[];
    };
}

interface LayoutProps {
    changeLayout: boolean;
    setChangeLayout: Dispatch<SetStateAction<boolean>>;
    columns: ColumnsState;
    setColumns: Dispatch<SetStateAction<ColumnsState>>;
    tempColumns: ColumnsState;
    setTempColumns: Dispatch<SetStateAction<ColumnsState>>;
}

const DraggablePortalAware: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const element = document.body;
    return element ? createPortal(children, element) : null;
};

const ColumnLayout = ({ tempColumns, setTempColumns }: LayoutProps) => {
    const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
    const [tempName, setTempName] = useState<string>('');

    const onClient = typeof window !== 'undefined'

    const updateColumnName = async (id: string, name: string) => {
        try {
            const token = localStorage.getItem("token");
            const payload = { id, name }
            const response = await fetch(`${SERVER}/columnName`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
                body: JSON.stringify({ payload })
            })

            const data = await response.json();

            toast.success(data.message)
            console.log(data)
        } catch (error: any) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const handleEditClick = (id: string, currentName: string) => {
        setEditingColumnId(id);
        setTempName(currentName);
    };

    const handleSaveName = (id: string) => {
        setTempColumns((prevState) => ({
            ...prevState,
            [id]: { ...prevState[id], name: tempName },
        }));

        updateColumnName(id, tempName)

        setEditingColumnId(null);
    };

    const handleCancelEdit = () => {
        setEditingColumnId(null);
        setTempName('');
    };

    const renderColumnName = (columnId: string, columnName: string) => {
        if (editingColumnId === columnId) {
            return (
                <div className="flex justify-center items-center gap-2 w-full">
                    <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={() => handleSaveName(columnId)}
                        className="bg-gray-100 px-2 py-1 rounded w-36 text-sm"
                        autoFocus
                    />
                    <button
                        onClick={() => handleSaveName(columnId)}
                        className="text-green-500"
                    >
                        <Check className='size-5' />
                    </button>
                    <button
                        onClick={handleCancelEdit}
                        className="text-red-500"
                    >
                        <CircleX className='size-5' />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex justify-center items-center gap-2 w-48">
                <span>{columnName}</span>
                <button
                    onClick={() => handleEditClick(columnId, columnName)}
                    className="flex justify-center items-center ml-auto text-blue-500 hover:underline"
                >
                    <Edit className="inline size-5" />
                </button>
            </div>
        );
    };

    const handleCreateColumn = async (index: number) => {
        try {

            const token = localStorage.getItem("token");
            const payload = { name: 'New Column', index }
            const response = await fetch(`${SERVER}/columns`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
                body: JSON.stringify({ payload })
            })

            const data = await response.json();

            toast.success(data.message)
            console.log(data)

            setTempColumns((prevState) => {
                const newColumnsArray = Object.entries(prevState);
                newColumnsArray.splice(index, 0, [data.column.id, { ...data.column, Tasks: [] }]);

                return Object.fromEntries(newColumnsArray);
            });
        } catch (error: any) {
            toast.error(error.message)
            console.log(error)
        }

    }

    const handleDeleteColumn = async (columnId: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${SERVER}/columns/${columnId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                }
            })

            const data = await response.json();

            toast.success(data.message)
            console.log(data);

            setTempColumns((prevState) => {
                const newState = { ...prevState };
                delete newState[columnId];
                return newState;
            });
        } catch (error: any) {
            toast.error(error.message)
            console.error("Error deleting column:", error.message);
        }
    }

    return (
        <Droppable droppableId='droppabledId' key='droppabledId' {...droppableDefault}>
            {(provided) => (
                <div
                    key='droppabledId'
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='flex flex-nowrap justify-start gap-x-4 bg-white px-4 py-4 rounded-md w-full max-w-full h-full overflow-x-auto'
                >
                    {Object.entries(tempColumns).map(([key, column], index) => {
                        return (
                            <div key={index}>
                                <div>
                                    <button onClick={() => handleCreateColumn(index + 1)} className='flex flex-row justify-center items-center ml-auto px-2 rounded-md text-black transition ease-in-out group hover:scale-110'><Plus className='group-hover:animate-shake size-5' /></button>
                                </div>
                                <Draggable key={column.id} draggableId={column.id} index={index}>
                                    {(provided) => (
                                        <div
                                            key={index}
                                            className='border-1 bg-slate-200 my-1 p-2 rounded-sm w-64 h-96 overflow-y-auto'
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div className='flex justify-center items-center gap-4 w-full'>
                                                {renderColumnName(column.id, column.name)}
                                                <div className='flex justify-center items-center'>
                                                    <button
                                                        disabled={column.name === "To do"}
                                                        onClick={() => handleDeleteColumn(column.id)} className={`${column.name === "To do" ? 'cursor-not-allowed' : 'hover:text-red-500'}`}>
                                                        <Trash2 className='size-5' />
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                {column.Tasks.map((item, index) => {
                                                    return (
                                                        <div key={index} className='flex gap-4 bg-white mt-2 p-4 rounded-md min-h-10 text-black'>
                                                            <div className='flex flex-col justify-center items-center w-full'>
                                                                <div className='flex flex-col justify-center items-start gap-1 w-full'>
                                                                    <div className='text-sm'>{item.name}</div>
                                                                    <div className='text-xs'> {item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            </div>
                        )
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )

}

const PopupColumnLayout = ({ changeLayout, setChangeLayout, columns, setColumns, tempColumns, setTempColumns }: LayoutProps) => {
    const { role } = userStore();
    // console.log(role)

    useEffect(() => {
        if (changeLayout) {
            setTempColumns(columns);
        }
    }, [changeLayout, columns]);

    const handleSave = async () => {
        try {
            const columns = Object.values(tempColumns).filter((tempColumn) => {
                return tempColumn.Tasks.length === 0;
            });

            if (columns.length === 0) {
                toast.info("No changes detected")
                console.log("No changes detected.");
                return;
            }

            console.log(columns)
            const token = localStorage.getItem("token");
            const response = await fetch(`${SERVER}/columns`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
                body: JSON.stringify(columns),
            });

            const data = await response.json();
            toast.success(data.message)
            console.log(data);
        } catch (error: any) {
            toast.error(error.message)
            console.error("Error creating task:", error);
        }
        setColumns(tempColumns);
    };

    return (
        <div>
            <button onClick={() => setChangeLayout(true)} className={`hidden flex-row justify-center items-center gap-2 border-2 ml-auto px-2 py-2 border-blue-600 rounded-md text-black transition ease-in-out group hover:scale-110 ${role === "User"?"hidden":'md:flex'}`}>Change Layout<CalendarPlus className='group-hover:animate-shake size-5' /></button>
            {changeLayout && (
                <DraggablePortalAware>
                    <ToastContainer />
                    <div
                        className='top-0 left-0 z-40 fixed flex flex-col justify-center items-center w-full h-full'
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                        onClick={() => setChangeLayout(false)}
                    >
                        <div
                            className='bg-white shadow-md p-4 rounded-lg max-w-[90%]'
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='flex justify-center items-center mb-2'>
                                <div
                                    className='mx-4 mr-auto text-lg'
                                >
                                    Drag & Drop Columns
                                </div>

                            </div>
                            <div className='px-6 w-full min-h-96'>
                                <ColumnLayout
                                    changeLayout={false}
                                    setChangeLayout={() => { }}
                                    columns={columns}
                                    setColumns={setColumns}
                                    tempColumns={tempColumns}
                                    setTempColumns={setTempColumns}
                                />
                            </div>
                            <div
                                className='flex justify-end gap-4 mt-4 w-full'
                            >
                                <button
                                    onClick={handleSave}
                                    className='bg-green-400 px-5 py-2 rounded-sm cursor-pointer'
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setChangeLayout(false)}
                                    className='bg-red-400 px-5 py-2 rounded-sm cursor-pointer'
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </DraggablePortalAware>
            )}
        </div>
    );
};

export default PopupColumnLayout;