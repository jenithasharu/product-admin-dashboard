"use client";


import { useState } from "react";
import api from "../lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const[username, setUsername]=useState("");
    const[password, setPassword]= useState("");
    const[error, setError]= useState("");
    const[loading, setLoading]= useState(false);
    const router = useRouter();

    const handleSubmit= async (e) => {
        e.preventDefault();
        if(loading) return;
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", {username, password});
            localStorage.setItem("token", res.data.accessToken);
            router.push("/products");
        }   catch(err){
            setError("Invalid username or password");
        }   finally{ setLoading(false);
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
                <h1 className="text-xl font-bold">Login</h1>
                <input className="border p-2 rounded" placeholder="Username" value={username} onChange={(e)=> setUsername(e.target.value)}/>
                <input className="border p-2 rounded" type="password" placeholder="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="bg-black text-white p-2 rounded disabled: opacity-50">
                    {loading ? "Logging in..." : "login"}
                </button>
            </form>
        </div>
    )
}
