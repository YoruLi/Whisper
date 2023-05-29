"use client";

import AuthFormContext from "@/context/AuthFormContext/AuthFormContext";
import React, { useContext } from "react";

export default function PasswordComponent({ signUp }: { signUp: boolean }) {
    const { handleSignUp, handleLogin } = useContext(AuthFormContext);

    return (
        <>
            <header>Enter your password</header>
            <section className="flex flex-col gap-6 p-4">
                <form className="flex flex-col items-center w-full gap-4" autoComplete="off" onSubmit={signUp ? handleSignUp : handleLogin}>
                    <div className="relative group  w-full ">
                        <input
                            type="password"
                            name="password"
                            placeholder="password"
                            autoComplete="on"
                            className="w-full select-none p-3 text-base appearance-none outline-none border-slate-300 bg-transparent border-[0.2px] rounded-lg border-opacity-50  focus:border-emerald-400 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                        />
                        <span className="pointer-events-none text-sm text-opacity-80 bg-[#181920] absolute left-3 top-3.5 px-1 transition duration-200 input-text">
                            Password
                        </span>
                    </div>

                    <span className="text-emerald-400 text-xs">Forgot Password?</span>
                    <button
                        type="submit"
                        className="p-3 w-full rounded-lg bg-emerald-500 capitalize font-semibold  hover:bg-emerald-900 transition-colors duration-500"
                    >
                        {signUp ? "sign up" : "log in"}
                    </button>
                </form>
            </section>
        </>
    );
}
