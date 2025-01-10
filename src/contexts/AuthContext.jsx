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
                firstName: userData.firstName,
                lastName: userData.lastName,
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
        
        // Mise à jour des données du compte
        if (updates.firstName !== undefined) {
            updatedUser.accountData.firstName = updates.firstName;
        }
        if (updates.lastName !== undefined) {
            updatedUser.accountData.lastName = updates.lastName;
        }
        if (updates.email !== undefined) {
            updatedUser.accountData.email = updates.email;
        }
        if (updates.phone !== undefined) {
            updatedUser.accountData.phone = updates.phone;
        }
        if (updates.address !== undefined) {
            updatedUser.accountData.address = updates.address;
        }
        if (updates.city !== undefined) {
            updatedUser.accountData.city = updates.city;
        }
        if (updates.country !== undefined) {
            updatedUser.accountData.country = updates.country;
        }
        if (updates.notifications !== undefined) {
            updatedUser.accountData.notifications = updates.notifications;
        }
        if (updates.profilePic !== undefined) {
            updatedUser.accountData.profilePic = updates.profilePic;
        }
        if (updates.walletData !== undefined) {
            updatedUser.walletData = {
                ...updatedUser.walletData,
                ...updates.walletData
            };
        }
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        const users = getUsers();
        const userIndex = users.findIndex(u => u.accountData.id === updatedUser.accountData.id);
        if (userIndex !== -1) {
            users[userIndex] = updatedUser;
            saveUsers(users);
        }

        return updatedUser;
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