import { toast } from "react-toastify";
import userStore from "./store";

const SERVER = process.env.NEXT_PUBLIC_SERVER_URL;

export const updateTask = async (taskId: string, name: string, content: string, assignedByEmail: string, assignedToEmails: string[], columnId: string, startDate: Date | null, dueDate: Date | null, setIsUpdated: () => void) => {
    try {
        const payload = { name, content, assignedByEmail, assignedToEmails, columnId, startDate, dueDate };
        // console.log("API call payload:", { taskId, name, content, assignedByEmail, assignedToEmails, columnId, startDate, dueDate });
        const response = await fetch(`${SERVER}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payload }),
        });

        const data = await response.json();
        console.log(data);
        setIsUpdated();
    } catch (error) {
        console.error('Error updating task:', error);
    }
};