import { AppState } from "./types";

export const initialState: Readonly<AppState> = {
    openedChat: { id: null, profile: null, chat: null, messages: [] },
    chats: [],
    activeList: {},
};

// { profile: null, chat: null, messages: [] }
