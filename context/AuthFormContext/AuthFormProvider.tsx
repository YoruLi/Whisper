"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthFormContext from "./AuthFormContext";
import SupabaseContext from "../SupabaseContext/SupabaseContext";
import { handleContinue, handleSignUp } from "../types";

export const AuthFormProvider = ({ children }: { children: React.ReactNode }) => {
    const { signUp, login } = useContext(SupabaseContext);
    const [emailData, setEmailData] = useState<any>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const router = useRouter();

    const handleContinue: handleContinue = (
        event: React.FormEvent<HTMLFormElement>,
        signUp = false
    ) => {
        if (errorMessage) setErrorMessage("");

        const form = event.currentTarget;
        const formData = new FormData(form);
        const { email } = Object.fromEntries(formData.entries());
        if (!email) {
            return setErrorMessage("¡Todos los campos son obligatorios!");
        }

        setEmailData(email);
        router.push(`/auth/${signUp ? "signup" : "login"}/password`);
    };

    const handleSignUp: handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (errorMessage) setErrorMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);
        const { password } = Object.fromEntries(formData.entries());
        if (!password) {
            return setErrorMessage("¡Todos los campos son obligatorios!");
        }

        signUp(emailData, password);
    };

    const handleLogin: handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (errorMessage) setErrorMessage("");
        const form = event.currentTarget;
        const formData = new FormData(form);
        const { password } = Object.fromEntries(formData.entries());

        if (!password) {
            return setErrorMessage("¡Todos los campos son obligatorios!");
        }

        login(emailData, password);
    };

    return (
        <AuthFormContext.Provider value={{ handleContinue, handleSignUp, handleLogin }}>
            {children}
        </AuthFormContext.Provider>
    );
};
