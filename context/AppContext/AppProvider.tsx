"use client";

import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import AppContext from "./AppContext";
import AppReducer from "./AppReducer";
import throttle from "lodash.throttle";
import SupabaseContext from "../SupabaseContext/SupabaseContext";
import { ActiveList, setOpenedChat } from "./types.d";
import { Type } from "./types.d";
import { initialState } from "./initialState";
import { supabase } from "@/utils/supabase";
import { usePathname } from "next/navigation";
import { RealtimeChannel } from "@supabase/realtime-js";
import { formatDate } from "@/data/formatDate";

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const { getChats, session, profile, getMessages, updateLastSeen, sendMessageToChat, getChatRooms } = useContext(SupabaseContext);
    const [state, dispatch] = useReducer(AppReducer, initialState);

    const [isTyping, setIsTyping] = useState(false);
    const channelTypingRef = useRef<RealtimeChannel | undefined>();

    const pathname = usePathname();
    const reset = () => {
        dispatch({
            type: Type.SET_RESET,
        });
    };
    const setOpenedChat: setOpenedChat = (chat: any) => {
        dispatch({
            type: Type.SET_OPENED_CHAT,
            payload: chat,
        });
    };

    const setChats = (chats: any) => {
        dispatch({
            type: Type.SET_CHATS,
            payload: chats,
        });
    };

    const updateChats = (chat: any) => {
        const { openedChat, chats } = state;
        // updated chats array with new chat object
        const updatedChats = chats.map(stateChat => (stateChat.id === chat.id ? chat : stateChat));

        // check if chat already exists
        const alreadyExists = chats.some(c => c.id === chat.id);

        // check if chat is currently opened
        const isOpenedChat = openedChat && (openedChat.chat?.id === chat.id || !openedChat.chat?.id);

        dispatch({
            type: Type.SET_UPDATE_CHATS,
            payload: {
                chats: alreadyExists ? updatedChats : [chat, ...chats],
                ...(isOpenedChat && {
                    openedChat: chat,
                }),
            },
        });
    };

    const sendMessage = async (chat: any, message: any) => {
        const updatedChat = await sendMessageToChat(chat, message);

        if (!updatedChat) {
            return console.log("Ocurrio un error al enviar el mensaje!");
        }

        updateChats(updatedChat);
    };

    const setActiveUserList = (newValue: ActiveList) => {
        dispatch({
            type: Type.SET_ACTIVE_USERS,
            payload: newValue,
        });
    };

    useEffect(() => {
        if (!session || !profile) {
            return;
        }
        getChats().then(chats => {
            if (!chats) {
                return console.log("!Hubo un error al intentar encontrar chats!");
            }
            setChats(chats ?? []);
        });
    }, [session, profile]);
    useEffect(() => {
        const { openedChat } = state;

        if (!openedChat || openedChat.messages) return;

        getMessages(openedChat).then((message: any) => {
            if (!message) {
                return console.log("Hubo un error al cargar los mensajes");
            }

            updateChats({ ...openedChat, messages: message ?? [] });
        });
    }, [state.openedChat]);

    // message on realtime

    useEffect(() => {
        if (!state.chats || !Array.isArray(state.chats) || !profile) return;

        const chatsSubscription = supabase
            .channel("chats:insert")
            .on(
                "postgres_changes",
                {
                    schema: "public",
                    event: "INSERT",
                    table: "chats",
                    filter: `profile_id=eq.${profile.id}`,
                },
                async ({ new: chat }) => {
                    const chatroomInfo = await getChatRooms(chat.chatroom_id);
                    if (!chatroomInfo) {
                        return;
                    }

                    const updatedChat = {
                        ...chat,
                        ...chatroomInfo,
                    };

                    updateChats(updatedChat);
                }
            )
            .subscribe();

        const messageSubscription = supabase
            .channel("test")
            .on(
                "postgres_changes",
                {
                    schema: "public",
                    event: "INSERT",
                    filter: `chatroom_id=in.(${state.chats.map(({ chatroom_id }) => chatroom_id).join(",")})`,
                },
                ({ new: receivedMessage }) => {
                    const chat = state.chats.find(({ chatroom_id }) => chatroom_id === receivedMessage.chatroom_id);

                    const isOpenedChat = state.openedChat && state.openedChat.id === chat?.id;

                    updateChats({
                        ...chat,
                        ...(isOpenedChat && {
                            messages: [...(chat?.messages ? chat?.messages.flatMap(msg => msg) : []), receivedMessage],
                        }),
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(chatsSubscription);
            supabase.removeChannel(messageSubscription);
        };
    }, [state.chats, state.openedChat]);

    const handleFocus = useCallback(() => {
        updateLastSeen("en linea", profile?.id);
        console.log("en linea");
    }, [updateLastSeen]);

    const handleBlur = useCallback(() => {
        updateLastSeen(`ult. vez a las ${formatDate(new Date(), "status")}`, profile?.id);
        console.log("no esta en linea");
    }, [updateLastSeen]);

    useEffect(() => {
        if (!session || !profile) {
            return;
        }
        const channel = supabase
            .channel("test", {
                config: {
                    presence: {
                        key: profile?.id,
                    },
                },
            })
            .on("presence", { event: "sync" }, () => {
                const usersList: ActiveList = channel.presenceState();
                setActiveUserList(usersList);
            })

            .subscribe(async status => {
                if (status === "SUBSCRIBED") {
                    const status = await channel.track({
                        id: profile?.id,
                        last_seen: profile?.last_seen,
                        email: profile?.email,
                        status: profile.status,
                        profile_picture: profile?.profile_picture,
                    });

                    console.log(status);
                }
            });

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
            supabase.removeChannel(channel);
            channel.untrack();
        };
    }, [session, profile, updateLastSeen]);

    useEffect(() => {
        if (!session || !profile) {
            return;
        }
        const { openedChat } = state;
        const profileChannelSubscription = supabase
            .channel("test:profile")
            .on(
                "postgres_changes",
                {
                    schema: "public",
                    event: "UPDATE",
                    filter: `id=eq.${state.openedChat?.profile?.id}`,
                    table: "profiles",
                },
                ({ new: user }) => {
                    const chat = state.chats.find(({ profile }) => user);
                    const isOpenedChat = state.openedChat && state.openedChat.profile?.id === chat?.profile.id;

                    updateChats({
                        ...chat,
                        ...(isOpenedChat && {
                            profile: {
                                ...openedChat.profile,
                                last_seen: user.last_seen,
                            },
                        }),
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(profileChannelSubscription);
        };
    }, [state.openedChat]);

    useEffect(() => {
        const { openedChat } = state;
        if (!profile || !openedChat) {
            return;
        }
        const channelTyping = supabase.channel(`typing:${openedChat.chat?.id}`);
        const hideTextTypingIndicator = () => {
            setTimeout(() => {
                setIsTyping(false);
            }, 2000);
        };

        const onTyping = () => {
            setIsTyping(true);
            hideTextTypingIndicator();
            console.log("esta escribiendo");
        };

        channelTyping.on("broadcast", { event: "typing" }, onTyping).subscribe();

        channelTypingRef.current = channelTyping;

        return () => {
            supabase.removeChannel(channelTyping);
        };
    }, [profile, state.openedChat, setIsTyping]);

    const onTyPingEvent = throttle(() => {
        if (!channelTypingRef.current) return;
        channelTypingRef.current.send({
            type: "broadcast",
            event: "typing",
            payload: profile?.id,
        });
    }, 3000);

    const sendTypingEvent = useCallback(() => {
        onTyPingEvent();
    }, [onTyPingEvent]);

    return (
        <AppContext.Provider value={{ state, setOpenedChat, sendMessage, reset, isTyping, sendTypingEvent }}>
            {children}
        </AppContext.Provider>
    );
}
