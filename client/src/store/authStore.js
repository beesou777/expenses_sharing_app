import {create} from 'zustand';

export const useAuthStore  = create((set)=> ({
    auth: {
        username: ''
    },
    setUsername: (name) => set((state)=> ({auth: {...state.auth, username: name }}) )
}));