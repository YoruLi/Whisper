"use client";
import { setOpenedChat } from "@/context/AppContext/types";
import { Chat } from "@/context/types";
import Link from "next/link";
import React from "react";
import ProfilePicture from "./ProfilePicture";

export default function ChatsList({ chats, setOpenedChat }: { chats: Chat[]; setOpenedChat: setOpenedChat }) {
    return (
        <>
            {chats?.map(chat => {
                const { id, profile } = chat;
                return (
                    <Link
                        href={chat && `chats/${profile.email}`}
                        key={id}
                        passHref
                        className="flex gap-3.5 p-3.5 items-center hover:bg-[#1e1f27] cursor-pointer"
                        onClick={() => setOpenedChat(chat)}
                    >
                        <div className="flex gap-3 items-center w-full">
                            <ProfilePicture email={profile?.email} />
                            <div className="flex flex-col">
                                <span className="text-base">{profile?.email}</span>
                                <span className="text-slate-500 font-medium text-sm">{profile?.status}</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}
