import React from "react";
import { supabase } from "@/utils/supabase";
import Chat from "@/components/Chat";

async function getProfileId() {
    const { data: profile } = await supabase.from("profiles").select();

    return profile?.map(({ id }) => {
        id;
    });
}

export default async function page({ params: { id } }: { params: { id: string } }) {
    const { data } = await supabase.from("profiles").select().match({ id });
    return <Chat />;
}
