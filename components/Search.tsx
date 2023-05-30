"use client";
import React, { FormEvent } from "react";
import Spinner from "./Spinner";
import SvgButton from "./SvgButton";
import svgs from "@/data/svgs";

interface Props {
    search: string;
    setSearch: (value: string) => void;
    getResults: (query: string) => void;
}

export default function Search({ search, setSearch, getResults }: Props) {
    const handleSearch = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
    };
    return (
        <>
            <form className="flex-1 px-3 justify-center items-center flex relative" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search chat..."
                    className="w-full bg-[#1e1f27] pl-6 rounded-lg outline-none py-2.5 text-sm  "
                    value={search}
                    onChange={evt => setSearch(evt.target.value)}
                />
                <div className="absolute right-5">
                    {!search ? (
                        <SvgButton
                            ariaLabel={svgs.search.ariaLabel}
                            title={svgs.search.title}
                            viewBox={svgs.search.viewBox}
                            path={svgs.search.path}
                            size="w-5 h-5"
                        />
                    ) : (
                        <Spinner sm={true} />
                    )}
                </div>
            </form>
        </>
    );
}
