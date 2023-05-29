import AppContext from "@/context/AppContext/AppContext";
import { openedChat } from "@/context/AppContext/types";
import { MutableRefObject, useContext, useEffect, useRef, useState } from "react";

export default function useMessage(chat: openedChat) {
    const { messages } = chat;
    const { sendMessage } = useContext(AppContext);

    const [message, setMessage] = useState("");
    const lastMessageRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    const sendMessageToChat = () => {
        const messageNoSpaces = message.trim();
        if (!messageNoSpaces) return;

        sendMessage(chat, messageNoSpaces);
        setMessage("");
    };

    useEffect(() => {
        if (!messages || messages.length === 0) {
            return;
        }
        lastMessageRef.current?.scrollIntoView();
    }, [messages]);

    return { message, sendMessageToChat, updateMessage: setMessage, lastMessageRef };
}
