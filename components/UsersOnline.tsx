"use client";

import AppContext from "@/context/AppContext/AppContext";
import React, { useContext } from "react";
import ProfilePicture from "./ProfilePicture";

function UsersOnline() {
    const { state } = useContext(AppContext);
    const { activeList } = state;

    if (Object.entries(activeList).length === 0) return null;

    return (
        <div className="fixed right-0 top-0 p-3 flex flex-col lg:-bottom-[90%] lg:right-0  lg:flex-row ">
            <div className="flex lg:flex-row flex-col lg:justify-center lg:items-center ">
                <span className="text-emerald-400  text-sm lg:pr-3 ">En linea</span>
                {Object.values(activeList).map(([{ id, email, profile_picture }]) => {
                    return (
                        <div className="relative grid place-content-center" key={id}>
                            <ProfilePicture email={email} />
                            <span className="absolute bg-emerald-400 w-2 h-2 rounded-full bottom-1 lg:left-1.5 left-2.5"></span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default UsersOnline;
