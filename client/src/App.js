import React from 'react'
import {createBrowserRouter, RouterProvider,} from 'react-router-dom';

/** import all components */
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';
import Home from './components/Home';

import Summary from './components/home_components/Summary';
import AddExpense from './components/home_components/AddExpense';
import Expenses from './components//home_components/Expenses';
import Members from './components/home_components/Members';
import Profile from './components/home_components/Profile';
import UpdateExpense from './components/home_components/UpdateExpense';

import ShareExpenses from './components/home_components/summary_components/ShareExpenses';
import ExpensesAnalysis from './components/home_components/summary_components/ExpensesAnalysis';

/** auth middleware */
import { AuthorizeUser, ProtectRoute, RedirectLoginUser } from './middleware/auth';

/** root routes */
const router = createBrowserRouter([
    {
        path: '/',
        element: <RedirectLoginUser><Username /></RedirectLoginUser>
    },
    {
        path: '/home',
        element: <Home />,
        children: [
            {
                path: '',
                element: <Summary />,
                children: [
                    {
                        path: '',
                        element: <ShareExpenses />
                    },
                    {
                        path: 'expenses-analysis',
                        element: <ExpensesAnalysis />
                    }
                ]
            },
            {
                path: 'add-expense',
                element: <AddExpense />
            },
            {
                path: 'expenses',
                element: <Expenses />
            },
            {
                path: 'members',
                element: <Members />
            },
            {
                path: 'profile',
                element: <Profile />  
            },
            {
                path: 'update-expense',
                element: <UpdateExpense />
            }
        ]
    },
    {
        path: '/register',
        element: <Register></Register>
    },
    {
        path: '/password',
        element: <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path: '/profile',
        element: <AuthorizeUser><Profile /></AuthorizeUser>
    },
    {
        path: '/recovery',
        element: <ProtectRoute><Recovery /></ProtectRoute>
    },
    {
        path: '/reset',
        element: <ProtectRoute><Reset /></ProtectRoute>
    },
    {
        path: '*',
        element: <PageNotFound></PageNotFound>
    }
    
]);

export default function App() {

  return (
    <main className='h-full'>
        <RouterProvider router={router} />
    </main>
  )
}
