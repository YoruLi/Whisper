import AppContext from "@/context/AppContext/AppContext";
import React, { useContext } from "react";
import ProfilePicture from "./ProfilePicture";
import Image from "next/image";

export default function InfoChat() {
    const { state } = useContext(AppContext);
    const { profile: chatterProfile } = state.openedChat || {};

    return (
        <section className="xl:flex flex-col w-full h-full hidden bg-[#14161e] ">
            <div className="m-6 flex flex-col gap-[2px]  ">
                <header className=" flex flex-col justify-center items-center gap-2 py-10 border-b-4 border-[#8e8e8e2a]">
                    <ProfilePicture email={chatterProfile?.email} size="w-20 h-20" />
                    <div className="flex flex-col items-center ">
                        <span>{chatterProfile?.email}</span>
                        <div className="text-xs font-medium text-[#8e8e8e] flex gap-1.5">
                            <span>{chatterProfile?.last_seen ? chatterProfile.last_seen : ""}</span>
                        </div>
                    </div>
                </header>

                <article className="flex flex-col pt-3 pb-4 border-b-2 border-[#8e8e8e44]">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm capitalize">archivos, enlaces, documentos</h3>
                        <span className="text-xs">more</span>
                    </div>
                    <div className=" scrollbar whitespace-nowrap flex flex-row overflow-y-auto justify-center items-center gap-2 mt-4">
                        <div className="block min-w-[150px] ">
                            <Image src="/imgs/cat.png" alt="" width={600} height={600} />
                        </div>
                        <div className="block min-w-[150px] ">
                            <Image src="/imgs/cat.png" alt="" width={600} height={600} />
                        </div>
                        <div className="block min-w-[150px">
                            <Image src="/imgs/cat.png" alt="" width={600} height={600} />
                        </div>
                        <div className="block min-w-[150px] ">
                            <Image src="/imgs/cat.png" alt="" width={600} height={600} />
                        </div>
                        <div className="block min-w-[150px] ">
                            <Image src="/imgs/cat.png" alt="" width={600} height={600} />
                        </div>
                    </div>
                </article>

                <article className="py-3 border-b-2 border-[#8e8e8e44]">
                    <h1>Info.</h1>
                    <p>''¡Me encanta Supachat!''</p>
                </article>
                <article className="py-8 grid">
                    <div>
                        <ul className="flex flex-col gap-4">
                            <li>
                                <button>
                                    <span>Notificaciones</span>
                                </button>
                            </li>
                            <li>
                                <button>
                                    <span>Reaccionados</span>
                                </button>
                            </li>
                            <li>
                                <button>
                                    <span>Fondo de chat</span>
                                </button>
                            </li>
                            <li>
                                <button>
                                    <span>Eliminar chat</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </article>
            </div>
        </section>
    );
}
