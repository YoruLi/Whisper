import Image from "next/image";
import React from "react";

interface Props {
    profile_picture?: string | undefined;
    email: string | undefined;
    size?: string;
    classname?: string;
}
export default function ProfilePicture({ profile_picture, email, size, classname }: Props) {
    return (
        <button
            className={`${
                size ? size : "w-10 h-10"
            } md:12 md:12 grid place-content-center  border-[2px] border-transparent hover:border-emerald-500 rounded-full transition-colors duration-500 `}
        >
            <Image
                src={profile_picture ?? "../imgs/placeholder.svg"}
                className={`${classname} rounded-full block min-h-full`}
                alt={`Foto de perfil de ${email}`}
                width={600}
                height={600}
                referrerPolicy="no-referrer"
                priority
            />
        </button>
    );
}
