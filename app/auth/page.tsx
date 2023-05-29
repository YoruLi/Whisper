import Link from "next/link";
import React from "react";

export default function page() {
    return (
        <div className="flex flex-col gap-8 py-3">
            <h1>Welcome to Whisper</h1>
            <div className="flex flex-row gap-3">
                <Link href={"/auth/login"} className="bg-emerald-500 px-3 py-1.5 ">
                    log in
                </Link>
                <Link href={"/auth/signup"} className="bg-emerald-500 px-3 py-1.5 ">
                    sign up
                </Link>
            </div>
        </div>
    );
}
