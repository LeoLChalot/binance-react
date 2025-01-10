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
        const user = users.find(u => u.accountData.email === userData.email && u.accountData.password === userData.password);
        if (user) {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            setShowAuth(false);
            return true;
        }
        return false;
    };

    const register = (userData) => {
        const users = getUsers();
        const existingUser = users.find(u => u.accountData.email === userData.email);
        
        if (existingUser) {
            return false;
        }
        
        const newUser = {
            accountData: {
                id: uuidv4(),
                email: userData.email,
                password: userData.password,
                profilePic: null,
                createdAt: new Date().toISOString()
            },
            walletData: {
                balance: 0,
                tokenData: [],
                investHistory: [],
                withdrawHistory: [],
                beneficiary: []
            }
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

    const updateUser = (updates) => {
        const updatedUser = { ...user };
        
        if (updates.profilePic !== undefined) {
            updatedUser.accountData.profilePic = updates.profilePic;
        }
        if (updates.balance !== undefined) {
            updatedUser.walletData.balance = updates.balance;
        }
        if (updates.tokenData) {
            updatedUser.walletData.tokenData = updates.tokenData;
        }
        if (updates.investHistory) {
            updatedUser.walletData.investHistory = updates.investHistory;
        }
        if (updates.withdrawHistory) {
            updatedUser.walletData.withdrawHistory = updates.withdrawHistory;
        }
        if (updates.beneficiary) {
            updatedUser.walletData.beneficiary = updates.beneficiary;
        }
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        const users = getUsers();
        const updatedUsers = users.map(u => u.accountData.id === updatedUser.accountData.id ? updatedUser : u);
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