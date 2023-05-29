import { Svg } from "@/data/svgs";
import React from "react";

interface Props extends Svg {
    onClick?: any;
    size?: string;
    type?: string;
}

export default function SvgButton({
    viewBox,
    path,
    onClick,
    ariaLabel,
    title,
    size,
    type,
    ...props
}: Props) {
    return (
        <button
            aria-label={ariaLabel}
            role={type}
            title={title}
            className={`group/svg grid place-content-center  ${size ? size : " w-6 h-6"}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBox}
                className={`fill-[#8e8e8e] transition-colors group-hover/svg:fill-[#40f5c8] group-focus/svg:fill-[#40f5c8] duration-300   ${
                    size ? size : " w-6 h-6"
                }`}
                onClick={onClick}
                {...props}
            >
                <path d={path}></path>
            </svg>
        </button>
    );
}
