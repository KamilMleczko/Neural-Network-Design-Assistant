"use client";

import dynamic from "next/dynamic";
//import navbar as client component to avoid hydration errors 
const Navbar = dynamic(
    () => import("@nndm/features/shared/navbar/navbar").then((mod) => mod.Navbar),
    {
        ssr: false,
    },
);

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="flex flex-1 flex-col overflow-x-hidden">{children}</div>
        </>
    );
}
