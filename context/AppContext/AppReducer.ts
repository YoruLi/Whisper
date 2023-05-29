import { initialState } from "./initialState";
import { AppAction, AppState, Type } from "./types.d";

export default function AppReducer(state: AppState, action: AppAction): AppState {
    const { type, payload } = action;

    switch (type) {
        case Type.SET_RESET:
            return initialState;
        case Type.SET_OPENED_CHAT:
            return {
                ...state,
                openedChat: payload,
            };

        case Type.SET_CHATS:
            return {
                ...state,
                chats: payload,
            };

        case Type.SET_UPDATE_CHATS:
            return {
                ...state,
                ...payload,
            };

        case Type.SET_ACTIVE_USERS:
            return {
                ...state,
                activeList: payload,
            };
        default:
            return state;
    }
}
