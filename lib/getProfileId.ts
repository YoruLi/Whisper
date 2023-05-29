import { supabase } from "@/utils/supabase";

export default async function getProfileId() {
    const { data: profile, error } = await supabase.from("profiles").select();

    return profile?.map(({ id }) => {
        id;
    });
}
