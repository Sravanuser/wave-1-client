import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // NEW

    useEffect(() => {
        const savedUser = localStorage.getItem("userData");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false); // auth state ready
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                setUser,
                loading, // expose loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
