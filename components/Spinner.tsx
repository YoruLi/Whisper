import Image from "next/image";
import React from "react";

export default function Spinner({ sm = false }) {
    return (
        <Image
            alt="Loading..."
            src="/imgs/spinner.svg"
            height={sm ? "20" : "32"}
            width={sm ? "20" : "32"}
            priority
        />
    );
}
