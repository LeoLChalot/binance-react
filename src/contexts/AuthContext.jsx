import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [showAuth, setShowAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setShowAuth(false);
        } else {
            setShowAuth(true);
        }
    }, []);

    const getUsers = () => {
        return JSON.parse(localStorage.getItem('users') || '[]');
    };

    const saveUsers = (users) => {
        localStorage.setItem('users', JSON.stringify(users));
    };

    const login = (userData) => {
        const users = getUsers();
        const user = users.find(u => u.email === userData.email && u.password === userData.password);
        if (user) {
            const defaultUser = {
                id: user.id,
                email: user.email,
                password: user.password,
                balance: user.balance || 0,
                history: user.history || [],
                profilePic: user.profilePic || null,
                createdAt: user.createdAt || new Date().toISOString()
            };

            const updatedUser = { ...defaultUser, ...user };
            
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
            saveUsers(updatedUsers);

            setShowAuth(false);
            return true;
        }
        return false;
    };

    const register = (userData) => {
        const users = getUsers();
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
            return false;
        }
        
        const newUser = {
            id: uuidv4(),
            email: userData.email,
            password: userData.password,
            balance: 0,
            history: [],
            profilePic: null,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setShowAuth(false);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setShowAuth(false);
        navigate('/');
    };

    const updateUser = (newUserData) => {
        const updatedUser = { ...user, ...newUserData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        const users = getUsers();
        const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
        saveUsers(updatedUsers);
        
        setUser(updatedUser);
    };

    const value = {
        user,
        setUser,
        login,
        register,
        logout,
        showAuth,
        setShowAuth,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}