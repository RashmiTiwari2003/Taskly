import { create } from 'zustand';
import { persist } from "zustand/middleware";

interface User {
    name: string;
    email: string;
    phone: string;
    role: string;
    businessName: string;
}

interface TaskUpdate {
    updated: boolean;
}

interface State {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    phone?: string | null;
    businessName?: string | null;
    isOpen: boolean;
    users: User[];
    userEmail: string | null;
    updated: boolean;
    setIsUpdated: () => void;
    setEmail: (email: string) => void;
    setUserEmail: (userEmail: string) => void;
    setUsers: (users: User[]) => void;
    getUserByEmail: (email: string) => User | undefined;
    setState: (name: string, role: string, phone: string, businessName: string) => void;
    setIsOpen: () => void;
}

const userStore = create<State>((set, get) => ({
    name: null,
    email: null,
    role: null,
    phone: null,
    businessName: null,
    isOpen: false,
    users: [],
    userEmail: null,
    updated: false,
    setIsUpdated: () => set((State) => ({ updated: !State.updated })),
    setEmail: (email) => set({ email }),
    setState: (name, role, phone, businessName) => set({ name, role, phone, businessName }),
    setIsOpen: () => set((State) => ({ isOpen: !State.isOpen })),
    setUsers: (users) => set({ users }),
    getUserByEmail: (email) => {
        const { users } = get();
        return users.find((user) => user.email === email);
    },
    setUserEmail: (userEmail) => set({ userEmail }),
}));

export default userStore