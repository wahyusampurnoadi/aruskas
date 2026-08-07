"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Sidebar from "@/components/dashboard/Sidebar";

export default function MainLayout({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });

        return () => unsub();
    }, []);

    const logout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

            {/* Sidebar Utama Dipanggil Hanya Di Sini */}
            <Sidebar
                user={user}
                onLogout={logout}
            />

            <div className="relative lg:ml-[280px] min-h-screen">

                {/* Background Pattern */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
                    <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-[600px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full" />
                </div>

                {/* Container Halaman (children) */}
                <main className="relative z-10 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8 w-full">
                    {children}
                </main>

            </div>
        </div>
    );
}