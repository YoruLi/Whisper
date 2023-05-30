"use client";

import React, { useCallback, useEffect, useState } from "react";
import SupabaseContext from "./SupabaseContext";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";
import { SupabaseState, login, signInWithProvider, logOut, signUp, sendMessageToChat, Message, Chat, Profile, getMessages } from "../types";

const LOADING_TIME = 2000;
export const SupabaseProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<SupabaseState["session"]>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);

    const pathname = usePathname();
    const router = useRouter();

    // const removeLoadingScreen = (timelapse = 0) => {
    //     setTimeout(() => {
    //         setIsLoading(false);
    //         timelapse < LOADING_TIME ? LOADING_TIME - timelapse : 0;
    //     });
    // };

    const fetchProfile = async (newSession: any) => {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", newSession?.user?.id).maybeSingle();

        if (error) {
            return { success: false, error };
        }

        const profileData = data as SupabaseState["profile"];

        setProfile({ ...profileData });

        console.log(profileData);

        return { success: true };
    };
    const insertProfile = async (profile: any) => {
        const { data, error } = await supabase
            .from("profiles")
            .insert({ ...profile })
            .select()
            .maybeSingle();

        if (error) {
            console.log(error);
            return { success: false, error };
        }

        const profileData = data as SupabaseState["profile"];
        setProfile(profileData);

        return { success: true };
    };
    const signUp: signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error?.status === 400) {
            return login(email, password, true);
        }

        if (error) {
            return { success: false, error };
        }

        console.log("te registraste", { data });

        const { success, error: insertProfileError } = await insertProfile({ email });

        if (!success) {
            return { success, insertProfileError };
        }

        // todo: manipulate errors
        setSession(data.session);

        return { success: true };
    };

    const login: login = async (email, password, signUp = false) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            return { success: false, error };
        }
        // todo: manipulate errors
        setSession(data.session);
    };

    const searchQuery = async (query: string) => {
        console.log("searching...");
        const { data, error } = await supabase.from("profiles").select().neq("id", profile?.id).ilike("email", `${query}%`);

        if (error) {
            return { success: false, error };
        }
        return data.map(result => ({ ...result, created_at: new Date(result.created_at) }));
    };

    const signInWithProvider: signInWithProvider = async provider => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                queryParams: {
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        });
    };

    interface SendMessageResponse {
        created_chat: Date | null;
        inserted_message: Message | null;
    }

    const sendMessageToChat = async (chatData: Chat, messageData: Message): Promise<any> => {
        const { data, error }: { data: SendMessageResponse | null; error: any } = await supabase
            .rpc("send_message_to_chat", {
                sender_profile_id: profile?.id,
                receiver_profile_id: chatData.profile.id,
                chat: chatData,
                message: messageData,
            })
            .single();
        if (error) {
            console.error(error);
            return { success: false, error };
        }

        const { created_chat, inserted_message } = data as SendMessageResponse;

        return {
            ...chatData,
            ...created_chat,
            messages: [...chatData.messages, inserted_message],
        };
    };
    const getChats = async () => {
        const { data: chats, error } = await supabase.rpc("get_profile_chats", {
            p_id: profile?.id,
        });

        if (error) {
            console.log(error);
            return { success: false, error };
        }
        console.log({ chats });
        return chats.map(({ chat, profile }: { chat: Chat; profile: Profile }) => ({
            ...chat,
            profile,
        }));
    };

    const getChatRooms = async (chatroomId: Chat) => {
        const { data, error } = await supabase
            .rpc("get_chatroom_info", {
                cr_id: chatroomId,
                p_id: profile.id,
            })
            .single();

        if (error) {
            return { success: false, error };
        }

        const { messages, profile: senderProfile }: any = data;

        return {
            ...(messages as object),
            profile: {
                ...(senderProfile as object),
            },
        };
    };

    const getMessages: getMessages = async (chat: any, signal) => {
        const { data: messages, error } = await supabase.from("messages").select().eq("chatroom_id", chat.chatroom_id).abortSignal(signal);

        if (error) {
            console.log("message error", error);
            return { sucess: false, error };
        }

        console.log({ messages });

        return messages;
    };

    const updateLastSeen = async (date: any, user: any) => {
        const { data, error } = await supabase.from("profiles").update({ last_seen: date }).eq("id", user).select();

        if (error) {
            return { sucess: false, error };
        }

        console.log(data);
        return { sucess: true, data };
    };

    const handleAuthStateChange = useCallback(() => {
        supabase.auth.onAuthStateChange((eventSessionChange, changedSession) => {
            setSession(changedSession?.user ?? null);
            if (eventSessionChange === "SIGNED_OUT") {
                router.push("/home");
            }
        });
    }, []);

    const logOut: logOut = () => supabase.auth.signOut();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error || !session) return console.log("error", error);
            fetchProfile(session).then(({ success }) => {
                if (success) setSession(session);
            });
        });

        handleAuthStateChange();
    }, []);

    useEffect(() => {
        if (session && pathname.includes("/auth")) {
            return router.push("/home");
        }

        if (!session && !pathname.includes("/auth/")) {
            router.push("/auth");
        }
    }, [pathname, session]);

    return (
        <SupabaseContext.Provider
            value={{
                signUp,
                login,
                session,
                logOut,
                signInWithProvider,
                profile,
                searchQuery,
                sendMessageToChat,
                getChats,
                getMessages,
                updateLastSeen,
                getChatRooms,
            }}
        >
            {children}
        </SupabaseContext.Provider>
    );
};
