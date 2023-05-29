"use client";

import InfoChat from "@/components/InfoChat";
import ProfilePicture from "@/components/ProfilePicture";
import AppContext from "@/context/AppContext/AppContext";
import SupabaseContext from "@/context/SupabaseContext/SupabaseContext";
import useMessage from "@/hooks/useMessage";

import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import React, { FormEvent, useContext, useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import svgs from "@/data/svgs";
import SvgButton from "./SvgButton";

export default function Chat() {
    const router = useRouter();
    const { profile } = useContext(SupabaseContext);

    const { state, setOpenedChat, isTyping, sendTypingEvent } = useContext(AppContext);
    const { message, sendMessageToChat, updateMessage, lastMessageRef } = useMessage(state.openedChat);
    const { profile: chatterProfile, messages } = state.openedChat || {};

    const [showPickerSelect, setShowPickerSelect] = useState(false);
    const picker = useRef<HTMLDivElement>(null);
    const textCursor = useRef<HTMLInputElement>(null);

    const handleSubmitMessage = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        sendMessageToChat();
    };

    const handleBackClick = () => {
        setOpenedChat(null);
        router.push("/chats");
    };

    const handleShowPickerEmoji = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        textCursor.current?.focus();
        setShowPickerSelect(!showPickerSelect);
    };

    const addSelectedEmoji = (event: any) => {
        const emojiToAdd = event.unified;
        let emoji = String.fromCodePoint(parseInt("0x" + emojiToAdd, 16));

        const startPos = textCursor.current?.selectionStart ?? 0;
        const endPos = textCursor.current?.selectionEnd ?? 0;

        const before = message.substring(0, startPos);
        const after = message.substring(startPos);
        updateMessage(before + emoji + after);
        textCursor.current?.focus();
    };

    const handleClickOutsidePickerEmoji = (event: MouseEvent) => {
        const pickerEmoji = picker.current;
        if (pickerEmoji && !pickerEmoji.contains(event.target as Node) && !textCursor.current?.contains(event.target as Node)) {
            setShowPickerSelect(false);
        }
    };

    useEffect(() => {
        return () => {
            setOpenedChat(null);
        };
    }, []);

    useEffect(() => {
        if (showPickerSelect) {
            document.addEventListener("click", handleClickOutsidePickerEmoji);
        } else {
            document.removeEventListener("click", handleClickOutsidePickerEmoji);
        }

        return () => {
            document.removeEventListener("click", handleClickOutsidePickerEmoji);
        };
    }, [showPickerSelect]);

    return (
        <>
            <div className="bg-[#101218] w-full flex flex-col min-h-screen">
                <header className="bg-[#101218] hover:bg-[#1e1f27] transition-colors duration-500 flex items-center justify-between p-2 lg:p-3 ">
                    <div className=" flex gap-3 justify-center items-center ">
                        <SvgButton path={svgs.leftArrow.path} viewBox={svgs.leftArrow.viewBox} onClick={handleBackClick} />

                        <ProfilePicture email={profile?.email} />

                        <div className="flex flex-col">
                            <span className="text-base">{chatterProfile?.email}</span>
                            <span className="text-slate-500 font-medium text-sm">
                                {isTyping ? "Escribiendo..." : chatterProfile?.last_seen}
                            </span>
                        </div>
                    </div>
                </header>
                <main className="scrollbar max-h-[calc(100vh-140px)] lg:max-h-[calc(100vh-68px)] [overflow-y:overlay]  ">
                    <div
                        className={`min-h-[calc(100vh-60px-80px)] lg:min-h-[calc(100vh-60px-80px)] gap-1 flex ${
                            messages ? "flex flex-col gap-4 p-4 md:px-8 lg:justify-end 2xl:px-16 landscape:px-6" : "grid place-items-center"
                        }  `}
                    >
                        {messages ? (
                            messages.map((msg, index) => {
                                const { content, id, profile_id } = msg;
                                const ownMessage = profile?.id === profile_id;
                                const isLastMessage = index === messages.length - 1;

                                return (
                                    <div key={id} className="flex flex-col gap-2 ">
                                        <div className={` ${ownMessage ? "justify-end" : ""} flex `}>
                                            <div
                                                {...(isLastMessage && { ref: lastMessageRef })}
                                                className={`${
                                                    ownMessage ? "bg-emerald-600  rounded-ownmessage " : "bg-[#181c2c] rounded-message "
                                                } flex px-2 py-1.5  justify-between  relative  gap-3 min-w-[75px] max-w-[85%] lg:max-w-[66.666667%]`}
                                            >
                                                <span
                                                    className={`absolute  top-0 w-[8px] h-[13px] ${
                                                        ownMessage ? "-right-[8px] fill-#10B981" : "-left-[8px]"
                                                    }`}
                                                >
                                                    <svg viewBox={svgs.MessageIcon.viewBox}>
                                                        <path
                                                            d={ownMessage ? svgs.ownMessageIcon.path : svgs.MessageIcon.path}
                                                            fill={ownMessage ? "rgb(5 150 105)" : "#181c2c"}
                                                        ></path>
                                                    </svg>
                                                </span>
                                                <span className="whitespace-normal break-all">{content}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <Spinner sm={false} />
                        )}
                    </div>
                </main>

                <footer className=" w-full p-3.5 static bottom-auto mt-auto">
                    <form onSubmit={handleSubmitMessage} className="mx-auto flex gap-3.5 items-center justify-center w-[95%] lg:w-full">
                        <div className="relative flex gap-2">
                            <div ref={picker}>
                                <SvgButton
                                    type={"button"}
                                    viewBox={svgs.EmojiIcon.viewBox}
                                    path={svgs.EmojiIcon.path}
                                    onClick={handleShowPickerEmoji}
                                />
                                <div className="absolute bottom-full">
                                    {showPickerSelect && <Picker data={data} previewPosition={"none"} onEmojiSelect={addSelectedEmoji} />}
                                </div>
                            </div>

                            <SvgButton type={"button"} viewBox={svgs.attach.viewBox} path={svgs.attach.path} />
                        </div>
                        <input
                            type="text"
                            className="placeholder:capitalize w-full bg-[#1e1f27] px-3.5 py-2.5 border-transparent rounded-xl outline-none caret-[#505050] focus:border-emerald-500 placeholder:text-[#505050] text-[#ededed] text-sm"
                            placeholder="send message..."
                            value={message}
                            ref={textCursor}
                            onChange={e => {
                                updateMessage(e.target.value);
                            }}
                            onKeyDown={() => sendTypingEvent()}
                        />

                        <SvgButton path={svgs.send.path} viewBox={svgs.send.viewBox} type="submit" />
                    </form>
                </footer>
            </div>

            <div className="hidden border-l-[1px] w-full  xl:flex xl:max-w-[300px] border-[#14141f]">
                <InfoChat />
            </div>
        </>
    );
}
