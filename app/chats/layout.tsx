"use client";

import Chats from "@/components/Chats";
import WithOutChats from "@/components/WithOutChats";
import AppContext from "@/context/AppContext/AppContext";
import React, { useContext } from "react";
export default function ChatsLayout({ children }: { children: React.ReactNode }) {
    const { state } = useContext(AppContext);
    return (
        <div className="relative flex w-full">
            <Chats />
            {!(state.openedChat && state.openedChat.messages?.length !== 0) ? (
                <WithOutChats />
            ) : (
                <div
                    className={`lg:static lg:min-h-screen lg:w-full lg:flex  w-full ${
                        state.openedChat ? "absolute z-30 min-h-screen" : "hidden"
                    }  `}
                >
                    {children}
                </div>
            )}
        </div>
    );
}
