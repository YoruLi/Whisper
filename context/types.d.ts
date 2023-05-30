import { Session, User, Provider, PostgrestError } from "@supabase/supabase-js";
import { openedChat } from "./AppContext/types";

export interface SupabaseState {
    session: Session | User | null;
    profile: Profile | null;
}

export type Chat = {
    id: string;
    profile: Profile;
    messages: Message[];
    chatroom_id: string;
};

export type Message = {
    id: string;
    profile_id: string;
    chatroom_id: string;
    content: string;
};
export type signUp = (email: any, password: any) => void;
export type login = (email: any, password: any, signUp?: boolean) => void;
export type signInWithProvider = (provider: Provider) => void;
export type sendMessageToChat = (chat: Chat, message: Message) => Promise<any>;
export type handleContinue = (event: React.FormEvent<HTMLFormElement>, signUp: boolean) => void;
export type handleSignUp = (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
export type handleLogin = (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
export type getChatRooms = (chatroomId: Chat[]) => Promise<void>;
export type logOut = () => void;
export type getMessages = (
    chat: openedChat["chat"]["chatroom_id"],
    abortControllerSignal: AbortSignal
) => Promise<{ [x: string]: Message }[] | { sucess: boolean; error: PostgrestError }>;

export type getChats = () => Promise<
    | {
          success: boolean;
          error: PostgrestError;
          sucess?: undefined;
          data?: undefined;
      }
    | {
          sucess: boolean;
          data: any;
          success?: undefined;
          error?: undefined;
      }
>;

interface SupabaseContext extends SupabaseState {
    signUp: signUp;
    logOut: signOut;
    signInWithProvider: signInWithProvider;
    sendMessageToChat: sendMessageToChat;
    login: login;
    searchQuery: any;
    getChats: getChats;
    getMessages: getMessages;
    updateLastSeen: any;
    getChatRooms: any;
}

export interface Profile {
    id: string;
    created_at?: Date;
    email: string;
    status?: string;
    profile_picture?: string;
    last_seen: string;
}
