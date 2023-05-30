import React, { Dispatch, SetStateAction, useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import AppContext from "@/context/AppContext/AppContext";
import { useRouter } from "next/navigation";
import { Chat as IChat } from "@/context/types";

interface SearchResult {
    id: string;
    created_at: string;
    email: string;
    status: string;
    profile_picture: string;
}

interface Props {
    results: SearchResult[] | null;
    setSearch: Dispatch<SetStateAction<string>>;
}
export default function Results({ results, setSearch }: Props) {
    const router = useRouter();
    const { setOpenedChat, state } = useContext(AppContext);
    const handleResultClick = (profileResult: SearchResult) => {
        const foundedChat = state.chats.find((chat: IChat) => chat.profile.id === profileResult.id);
        setSearch("");

        setOpenedChat(foundedChat ? foundedChat : { profile: profileResult, messages: [] });

        router.push(`chats/${profileResult.id}`);
    };

    const withoutResults = results?.length === 0;
    return (
        <div {...(withoutResults && { className: "grid place-content-center h-full" })}>
            {withoutResults ? (
                <span className="text-center">No se encontraron resultados...</span>
            ) : (
                results &&
                results.map(profileResult => {
                    const { email, status, id } = profileResult;

                    return (
                        <div key={id} className="p-3.5 flex hover:bg-[#130c1886]" onClick={() => handleResultClick(profileResult)}>
                            <ProfilePicture {...profileResult} />

                            <div className="flex flex-col items-center w-full ">
                                <span className="text-sm font-medium text-secondary">{email}</span>
                                <span className="text-xs text-secondary-dark">{status}</span>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
