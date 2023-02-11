import React, { useContext } from 'react'
import { BrowserRouter , Routes, Route, Navigate } from "react-router-dom";
import Home from './routes/Home.js';
import Login from './routes/Login.js';
import Register from './routes/Register.js';
import PageNotFound from './routes/PageNotFound.js';
import { AuthContext } from './context/AuthContext.js';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

    const { user } = useContext(AuthContext);

    const ProtectedRoute = ({ children }) => {
        if (!user)  return <Navigate to='/login' replace={true}/>
        return children;
    }

    const RedirectRoute = ({children}) => {
        if(user) return <Navigate to='/'replace={true}/>
        return children;
    } 

    return (
        <main>
            <ToastContainer position="top-center" autoClose={2000} style={{ paddingTop: 'env(safe-area-inset-top)' }}/>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route index element={<ProtectedRoute><Home /></ProtectedRoute>}/>
                        <Route path="login" element={<RedirectRoute><Login /></RedirectRoute>} />
                        <Route path="register" element={<RedirectRoute><Register /></RedirectRoute>} />
                        <Route path="*" element={<PageNotFound />}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </main>
    )
}
