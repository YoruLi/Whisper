"use client";

import AuthFormContext from "@/context/AuthFormContext/AuthFormContext";
import SupabaseContext from "@/context/SupabaseContext/SupabaseContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useContext } from "react";
import SvgButton from "./SvgButton";
import svgs from "@/data/svgs";

export default function Auth({ signUp }: { signUp: boolean }) {
    const router = useRouter();
    const authContinue = signUp ? true : false;
    const { handleContinue } = useContext(AuthFormContext);
    const { signInWithProvider } = useContext(SupabaseContext);

    const handleSubmit = (event: any) => {
        event.preventDefault();
        handleContinue(event, authContinue);
    };
    return (
        <>
            <div className="flex self-start">
                <SvgButton
                    onClick={() => {
                        router.push("/auth");
                    }}
                    viewBox={svgs.leftArrow.viewBox}
                    path={svgs.leftArrow.path}
                />
            </div>
            <header className="flex">
                <h1 className="text-3xl">{signUp ? "Create your account " : "Welcome Back"}</h1>
            </header>
            <section className="flex flex-col gap-4 p-4 w-full">
                <form className="flex flex-col items-center w-full gap-4" onSubmit={handleSubmit}>
                    <div className="relative group  w-full ">
                        <input
                            type="text"
                            name="email"
                            placeholder="email address"
                            className="w-full   p-3 text-sm appearance-none outline-none border-slate-300 bg-transparent  border-[0.2px] rounded-md border-opacity-50  focus:border-emerald-400 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
                        />
                        <span className="pointer-events-none text-sm bg-[#14161e] absolute left-3 top-3.5 px-1 transition duration-200 input-text">
                            Email address
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="p-3 w-full rounded-md bg-emerald-500 capitalize font-semibold  hover:bg-emerald-900 transition-colors duration-500"
                    >
                        Continue
                    </button>
                    <div className="flex  justify-center gap-2 items-center">
                        <legend className="text-sm">{signUp ? "Already have an account? " : "Dont have an account?"}</legend>
                        <Link href={"/auth/signup"} className="capitalize text-emerald-400 text-sm">
                            {signUp ? "Log in" : "Sign up"}
                        </Link>
                    </div>
                </form>
                <span className="text-emerald-400 text-xs md:text-sm">or</span>
                <div className="flex flex-col gap-2">
                    <button
                        className="hover:bg-[#0c080f] bg-black p-3 rounded-md transition-colors duration-500  "
                        onClick={() => signInWithProvider("google")}
                    >
                        Google
                    </button>
                    <button
                        className="hover:bg-[#0c080f] bg-black p-3 rounded-md transition-colors duration-500 "
                        onClick={() => signInWithProvider("github")}
                    >
                        GitHub
                    </button>
                </div>
            </section>
        </>
    );
}
