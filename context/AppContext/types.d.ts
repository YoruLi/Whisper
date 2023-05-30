import { Chat, Message, Profile } from "../types";

export type AppAction = {
    type: string;
    payload?: any;
};
export type ActiveList = { [key: string]: User[] };
export interface User {
    id: string;
    online_at: string;
    email: string;
    profile_picture: string;
}

type openedChat = {
    id: string | null;
    profile: null | Profile;
    chat: Chat | null;
    messages: null | Message[];
};
export interface AppState {
    openedChat: openedChat;
    chats: Chat[];
    activeList: ActiveList;
}

export type setOpenedChat = (chat: any) => void;
export type sendMessage = (chat: any, message: any) => Promise<void>;
export type sendTypingEvent = any;

export interface AppContextType {
    state: AppState;
    isTyping: any;
    setOpenedChat: setOpenedChat;
    sendMessage: sendMessage;
    sendTypingEvent: sendTypingEvent;
    reset: () => void;
}

export enum Type {
    SET_OPENED_CHAT = "SET_OPENED_CHAT",
    SET_CHATS = "SET_CHATS",
    SET_UPDATE_CHATS = "SET_UPDATE_CHATS",
    SET_MESSAGE_LOADING = "SET_MESSAGE_LOADING",
    SET_RESET = "SET_RESET",
    SET_ACTIVE_USERS = "SET_ACTIVE_USERS",
}
