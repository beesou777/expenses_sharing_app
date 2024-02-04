import {create} from 'zustand';

export const useExpenseUpdateStore  = create((set)=> ({
    expense: {
        category: '',
        amount: '',
        date: '',
        description: '',
        member: ''
    },
    setExpense: (values) => set((state)=> ({expense: {...state.expense, ...values}}) )
}));