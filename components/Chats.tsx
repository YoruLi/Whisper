import React, { useContext } from "react";
import Search from "./Search";
import useSearch from "@/hooks/useQuery";
import useResults from "@/hooks/useResults";
import Results from "./Results";
import AppContext from "@/context/AppContext/AppContext";
import ChatList from "./ChatsList";

export default function Chats() {
    const { query, search, setSearch } = useSearch();
    const { getResults, results } = useResults(query);
    const { state, setOpenedChat } = useContext(AppContext);
    const { chats, openedChat } = state;

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
                            <ChatList chats={chats} setOpenedChat={setOpenedChat} />
                        )}
                    </section>
                </div>
            )}
        </div>
    );
}
