"use client";

import Chats from "@/components/Chats";
import WithOutChats from "@/components/WithOutChats";
import AppContext from "@/context/AppContext/AppContext";
import React, { useContext } from "react";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
    const { state } = useContext(AppContext);

    const isChatOpen = state.openedChat && state.openedChat.messages && state.openedChat.messages.length === 0 && !state.openedChat.profile;

    return (
        <div className="relative flex w-full min-h-full">
            <Chats />

            {isChatOpen ? (
                <WithOutChats />
            ) : (
                <div className={`${!isChatOpen ? "absolute z-50 h-full w-full" : "hidden"} lg:static lg:h-full lg:w-full lg:flex w-full`}>
                    {children}
                </div>
            )}
        </div>
    );
}
