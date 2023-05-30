import React from "react";
import { supabase } from "@/utils/supabase";
import Chat from "@/components/Chat";

export async function generateMetadata({ params: { chatId } }: { params: { chatId: string } }) {
    return { title: `${chatId} | chat` };
}
async function getProfileId() {
    const { data: profile } = await supabase.from("profiles").select();

    return profile?.map(({ id }) => {
        id;
    });
}

interface PageProps {
    params: {
        chatId: string;
    };
}
export default function page({ params: { chatId } }: PageProps) {
    return <Chat />;
}
