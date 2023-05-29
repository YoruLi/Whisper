import svgs from "@/data/svgs";
import React, { useContext } from "react";
import Svg from "./SvgButton";
import ProfilePicture from "./ProfilePicture";
import { useRouter } from "next/navigation";
import SupabaseContext from "@/context/SupabaseContext/SupabaseContext";
import AsideIcons from "./AsideIcons";

export default function Aside() {
    const router = useRouter();

    const { session, logOut, profile } = useContext(SupabaseContext);

    return (
        <aside className="  bg-[#181920] fixed z-30 bottom-0 left-0 w-full flex lg:relative lg:flex lg:flex-col  lg:w-20 lg:border-r-[1px] border-[#14141f] lg:min-h-screen">
            <div className="flex lg:flex-col items-center w-full lg:h-full lg:py-16">
                <div className="p-2">
                    <ProfilePicture email={profile?.email} />
                </div>
                <div className="lg:py-14 flex lg:flex-col  justify-evenly items-center w-full ">
                    <AsideIcons />
                    <div className="lg:last:absolute lg:last:bottom-10 grid place-content-center p-4 transition-all duration-300 ease-linear w-full [&>button>svg]:hover:fill-[#40f5c8] hover:bg-[#1e1f27]">
                        {!session ? (
                            <>
                                <Svg
                                    ariaLabel={svgs.logInIcon.ariaLabel}
                                    title={svgs.logInIcon.title}
                                    path={svgs.logInIcon.path}
                                    viewBox={svgs.logInIcon.viewBox}
                                    onClick={() => router.push("/auth")}
                                />
                            </>
                        ) : (
                            <Svg
                                ariaLabel={svgs.logOutIcon.ariaLabel}
                                title={svgs.logOutIcon.title}
                                path={svgs.logOutIcon.path}
                                viewBox={svgs.logOutIcon.viewBox}
                                onClick={logOut}
                            />
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
