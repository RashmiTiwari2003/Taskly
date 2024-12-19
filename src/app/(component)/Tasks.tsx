'use client'
import React, { useEffect, useState } from 'react'
import Protected from './Protected'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import Task from './Task';
import { updateTask } from '@/states/taskApi';
import userStore from '@/states/store';
import { cn } from '@/lib/utils';
import { CalendarPlus, ExternalLink, Trash2 } from 'lucide-react';
import PopupColumnLayout from './columnLayout';
import droppableDefault from '@/default';
import { toast, ToastContainer } from 'react-toastify';

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

interface BackendColumn {
    id: string
    name: string;
    order: number
    Tasks: Task[];
}

interface ColumnsState {
    [key: string]: {
        id: string;
        name: string;
        order: number;
        Tasks: Task[];
    };
}

const Tasks = () => {
    const { role, email, updated, setIsUpdated } = userStore();
    const [columns, setColumns] = useState<ColumnsState>({});
    const [trigger, setTrigger] = useState(false);
    const [editingTask, setEditingTask] = useState<Task>({ id: '', name: '', content: '', assignedByEmail: '', assignedToEmails: [], startDate: null, dueDate: null });
    const [openTask, setOpenTask] = useState(false);
    const [taskId, setTaskId] = useState('')
    const [taskColumnId, setTaskColumnId] = useState('')
    const [changeLayout, setChangeLayout] = useState(false);
    const [tempColumns, setTempColumns] = useState(columns);

    const onDragEnd = async (result: { destination: any; source?: any; }, columns: { [x: string]: any; }, setColumns: (arg0: any) => void) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId]
            const destColumn = columns[destination.droppableId]
            const sourceItems = [...sourceColumn.Tasks]
            const destItems = [...destColumn.Tasks]
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed)
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    Tasks: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    Tasks: destItems
                }
            })

            try {
                await updateTask(removed.id, removed.name, removed.content, removed.assignedByEmail, removed.assignedToEmails, destination.droppableId, removed.startDate, removed.dueDate, setIsUpdated)
            } catch (error: any) {
                console.log("Error occured: ", error)
            }
        }
        else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.Tasks]
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed)
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    Tasks: copiedItems
                }
            })
        }
    }

    useEffect(() => {
        const fetchColumns = async () => {
            try {
                console.log(email)
                const response = await fetch(`${SERVER}/columns/${email}`);
                const data = await response.json();

                setColumns(Object.fromEntries(
                    data.columns.map((column: BackendColumn) => [
                        column.id,
                        {
                            id: column.id,
                            name: column.name,
                            order: column.order,
                            Tasks: column.Tasks.map((task) => ({
                                id: task.id,
                                name: task.name,
                                content: task.content,
                                assignedByEmail: task.assignedByEmail,
                                assignedToEmails: task.assignedToEmails,
                                startDate: task.startDate ?? null,
                                dueDate: task.dueDate ?? null
                            })),
                        },
                    ])
                ));
            } catch (error: any) {
                console.error("Error fetching columns:", error.message);
            }
        };

        fetchColumns()
    }, [trigger, openTask, email, changeLayout, updated])

    const handleCreateTask = async () => {
        try {
            const token = localStorage.getItem("token");
            const columnId = Object.values(columns).find((col) => col.name === "To do")?.id;
            const payload = { name: `New Task`, content: `Task-content` };
            const response = await fetch(`${SERVER}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
                body: JSON.stringify({ payload, columnId }),
            });

            const newTask = await response.json();

            toast.success(newTask.message)
            console.log(newTask);
            setTrigger(!trigger);
        } catch (error: any) {
            toast.error(error.message)
            console.error("Error creating task:", error);
        }
    };

    const handleDeleteTask = async (taskId: string, columnId: string) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${SERVER}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Beaerer ${token}`,
                },
            });

            const data = await response.json();

            toast.success(data.message)
            console.log(data);

            setColumns((prevColumns) => {
                const updatedTasks = prevColumns[columnId].Tasks.filter((task) => task.id !== taskId);

                return {
                    ...prevColumns,
                    [columnId]: {
                        ...prevColumns[columnId],
                        Tasks: updatedTasks,
                    },
                };
            });
            setTrigger(!trigger)
        } catch (error: any) {
            toast.error(error.message)
            console.error('Error deleting task:', error);
        }
    };

    return (
        <Protected>
            <div className='flex flex-col justify-center items-center mt-4 w-full h-full'>
                <ToastContainer />
                <div className='flex justify-center items-center px-8 md:px-20 w-full'>
                    <div className='flex flex-col justify-start items-center md:mb-6 w-2/3 md:w-1/2'>
                        <div className='md:pb-4 md:border-b-2 w-full text-2xl'>Tasks</div>
                    </div>
                    <div className='flex justify-center items-center gap-4 ml-auto md:px-12'>
                        <div>
                            <DragDropContext onDragEnd={(result: DropResult) => {
                                const { source, destination } = result;

                                if (!destination) return;

                                const sortedColumns = Object.entries(tempColumns).sort(([, a], [, b]) => a.order - b.order);

                                const sourceColumn = sortedColumns[source.index][1];
                                const destinationColumn = sortedColumns[destination.index][1];

                                if (sourceColumn.name === "To do" || destinationColumn.name === "To do") {
                                    toast.info("To do cannot be rearranged.")
                                    console.log("To do cannot be rearranged.");
                                    return;
                                }

                                if (sourceColumn.Tasks.length > 0 || destinationColumn.Tasks.length > 0) {
                                    toast.info("Columns with tasks cant be rearranged.")
                                    console.log("Columns with tasks cant be rearranged.");
                                    return;
                                }

                                const [removed] = sortedColumns.splice(source.index, 1);
                                sortedColumns.splice(destination.index, 0, removed);

                                const reorderedColumns: ColumnsState = Object.fromEntries(
                                    sortedColumns.map(([key, column], index) => [
                                        key,
                                        {
                                            ...column,
                                            order: index,
                                        },
                                    ])
                                );

                                setTempColumns(reorderedColumns);
                            }}>
                                <PopupColumnLayout
                                    changeLayout={changeLayout}
                                    setChangeLayout={setChangeLayout}
                                    columns={columns}
                                    setColumns={setColumns}
                                    tempColumns={tempColumns}
                                    setTempColumns={setTempColumns}
                                />
                            </DragDropContext>
                        </div>
                        <button onClick={handleCreateTask} className='flex flex-row justify-center items-center gap-2 bg-blue-600 ml-auto px-2 py-2 rounded-md w-40 md:w-auto text-white transition ease-in-out group hover:scale-110'>Create Task<CalendarPlus className='group-hover:animate-shake size-5' /></button>
                    </div>
                </div>
                <div className='px-6 py-2 md:py-0 w-full'>
                    <div className='flex flex-nowrap justify-start items-center px-2 md:px-12 w-full max-w-full overflow-x-auto'>
                        <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
                            {
                                Object.entries(columns).map(([id, column]) => {
                                    return (
                                        <div key={id} className='m-4'>
                                            <div className='flex items-center bg-slate-200 px-4 rounded-t-lg w-full h-12'>
                                                {column.name.toUpperCase()}
                                            </div>
                                            <Droppable droppableId={id} key={id} {...droppableDefault}>
                                                {(provided, snapshot) => {
                                                    return (
                                                        <div
                                                            key={id}
                                                            {...provided.droppableProps}
                                                            ref={provided.innerRef}
                                                            className={cn(`p-1 min-w-64 h-96 overflow-y-auto border-2 rounded-b-lg border-slate-200`, `${snapshot.isDraggingOver ? 'bg-blue-400' : 'bg-blue-600'}`, 'bg-slate-100')}
                                                        >
                                                            {
                                                                column.Tasks.map((item, index) => {
                                                                    return (
                                                                        <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={window.innerWidth < 768}>
                                                                            {(provided, snapshot) => {
                                                                                return (
                                                                                    <div onClick={() => { setTaskId(item.id); setTaskColumnId(id); setOpenTask(true); setEditingTask({ id: item.id, name: item.name, content: item.content, assignedByEmail: item.assignedByEmail, assignedToEmails: item.assignedToEmails, startDate: item.startDate, dueDate: item.dueDate }); }}
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        style={{
                                                                                            ...provided.draggableProps.style,
                                                                                            cursor: snapshot.isDragging ? 'grab' : 'pointer',
                                                                                        }}
                                                                                        className={cn(`p-4 mt-2 gap-4 flex min-h-10 rounded-md text-black`, `${snapshot.isDragging ? 'bg-blue-300' : 'bg-blue-200'}`, 'bg-white')}
                                                                                    >
                                                                                        <div className='flex flex-col justify-center items-center w-full'>
                                                                                            <div className='flex flex-col justify-center items-start gap-1 w-full'>
                                                                                                <div className='text-sm'>{item.name}</div>
                                                                                                <div className='text-xs'> {item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content}</div>
                                                                                            </div>
                                                                                            <div className='flex items-center gap-2 ml-auto'>
                                                                                                <button
                                                                                                    onClick={(e) => { e.stopPropagation(); handleDeleteTask(item.id, id) }}
                                                                                                    className={`hover:text-red-500 ${role === "User" ? "hidden" : ''}`}
                                                                                                >
                                                                                                    <Trash2 className='size-5' />
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }}
                                                                        </Draggable>
                                                                    )
                                                                })
                                                            }
                                                            {provided.placeholder}
                                                        </div>
                                                    )
                                                }}
                                            </Droppable>
                                        </div>
                                    )
                                })
                            }
                        </DragDropContext>
                    </div>
                </div>
            </div>

            <Task openTask={openTask} setOpenTask={setOpenTask} taskId={taskId} taskColumnId={taskColumnId} editingTask={editingTask} setEditingTask={setEditingTask} setIsUpdated={setIsUpdated} />
        </Protected>
    )
}

export default Tasks