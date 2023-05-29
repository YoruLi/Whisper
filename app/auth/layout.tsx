import { AuthFormProvider } from "@/context/AuthFormContext/AuthFormProvider";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <AuthFormProvider>
            <div className="grid min-h-screen w-full place-items-center  fixed z-50 bg-[#181920]">
                <div className="flex w-[90%] justify-center items-center text-center max-w-lg flex-col gap-8 py-8 px-6 sm:px-8 md:max-w-xl 2xl:max-w-2xl 2xl:p-10 [box-shadow:_1px_1px_4px_1px_rgba(0,0,0,0.75)] ">
                    {children}
                </div>
            </div>
        </AuthFormProvider>
    );
}
