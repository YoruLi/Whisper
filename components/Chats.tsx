"use client";
import React, { useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import Search from "./Search";
import useSearch from "@/hooks/useQuery";
import useResults from "@/hooks/useResults";
import Results from "./Results";
import AppContext from "@/context/AppContext/AppContext";
import { useRouter } from "next/navigation";

export default function Chats() {
    const { query, search, setSearch } = useSearch();
    const { getResults, results } = useResults(query);
    const { state, setOpenedChat } = useContext(AppContext);
    const { chats, openedChat } = state;
    const router = useRouter();
    return (
        <div
            className={` border-r-[1px] bg-[#14161e] border-[#14141f] w-full h-full overflow-hidden lg:max-w-[330px] whitespace-nowrap z-20 `}
        >
            <div className="flex flex-col justify-center py-4 ">
                <header className="py-2 px-4 flex justify-between ">
                    <h2 className="font-medium text-lg">Messages</h2>
                </header>
                <Search search={search} setSearch={setSearch} getResults={getResults} />
            </div>
            {results ? (
                <Results results={results} setSearch={setSearch} />
            ) : (
                <div className="flex flex-col gap-3">
                    <header className="mx-4">
                        <span className="text-sm">All messages</span>
                    </header>
                    <section className="scrollbar overflow-y-auto  overflow-hidden min-h-[calc(100vh-150px)] max-h-[calc(100vh-150px)] ">
                        {!chats ? (
                            <span className="text-center text-lg font-bold text-emerald-400">¡No tienes chats!</span>
                        ) : (
                            <>
                                {chats?.map(chat => {
                                    const { id, profile } = chat;
                                    return (
                                        <div
                                            className=" flex gap-3.5 p-3.5 items-center hover:bg-[#1e1f27] cursor-pointer"
                                            key={id}
                                            role="button"
                                            onClick={() => {
                                                setOpenedChat(chat);
                                                router.push(`chats/${profile.id}`);
                                            }}
                                        >
                                            <div className="flex  gap-3 items-center w-full">
                                                <ProfilePicture email={profile.email} />
                                                <div className="flex flex-col">
                                                    <span className="text-base">{profile.email}</span>
                                                    <span className="text-slate-500 font-medium text-sm">
                                                        {profile.status}
                                                    </span>
                                                </div>

                                                {/* <span className="text-sm">15:20 PM</span> */}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
