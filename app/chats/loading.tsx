import Spinner from "@/components/Spinner";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background-900 ">
            <Spinner sm={false} />
        </div>
    );
}
