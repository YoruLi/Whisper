import svgs from "@/data/svgs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import SvgButton from "./SvgButton";

export default function AsideIcons() {
    const pathname = usePathname();
    return (
        <>
            {svgs.asideIcons.map(svg => (
                <Link
                    key={svg.name}
                    href={`${svg.pathname}`}
                    className={`p-4 bg-[rgb(5 150 105)]  grid place-content-center transition-all duration-300 ease-linear w-full ${
                        pathname.includes(`${svg.pathname}`)
                            ? "bg-[#1e1f27] [&>button>svg]:fill-[#40f5c8]  "
                            : "[&>button>svg]:hover:fill-[#40f5c8]  hover:bg-[#1e1f27]"
                    }`}
                >
                    <SvgButton {...svg} />
                </Link>
            ))}
        </>
    );
}
