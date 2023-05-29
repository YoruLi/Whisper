import { AppState } from "./types";

export const initialState: Readonly<AppState> = {
    openedChat: null,
    chats: [],
    activeList: {},
};

// { profile: null, chat: null, messages: [] }
