import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

// User cơ bản
type User = {
    username: string;
    phone: string;
    password?: string;
    avatar?: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, pass: string) => boolean;
    register: (userData: User) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // Danh sách user đã đăng ký
    const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

    // Đăng ký
    const register = (userData: User) => {
        const exists = registeredUsers.find(u => u.username === userData.username);
        if (exists) {
            Alert.alert('Lỗi', 'Tài khoản này đã tồn tại!');
            return false;
        }
        setRegisteredUsers([...registeredUsers, userData]);
        return true;
    };

    // Đăng nhập
    const login = (username: string, pass: string) => {
        const foundUser = registeredUsers.find(u => u.username === username && u.password === pass);
        if (foundUser) {
            setUser(foundUser);
            return true;
        } else {
            // Tài khoản Admin test
            if (username === 'Admin' && pass === 'Admin@123') {
                setUser({ username: 'Admin', phone: '0909000000' });
                return true;
            }
            return false;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};