import { useState } from "react";
import { Outlet } from "react-router";
import TopBar from "../components/TopBar";
import Sidebar from "../components/SideBar";
import DynamicIsland from "../components/DynamicIsland";

function MainLayout() {
    const [category, setCategory] = useState("All");
    const [catOpen, setCatOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]" />
                <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[160px]" />
            </div>

            {/* Mobile / tablet top navigation — Pending */}
            <div className="fixed inset-x-0 top-0 z-50 lg:hidden">
                <DynamicIsland visible />
            </div>
            

            <div className="mx-auto flex max-w-[1600px] gap-6 p-3 sm:p-4 lg:p-6">
                <Sidebar />

                <main className="relative flex min-w-0 flex-1 flex-col gap-5 sm:gap-6 pt-16 lg:pt-0">
                    <TopBar
                        category={category}
                        setCategory={setCategory}
                        catOpen={catOpen}
                        setCatOpen={setCatOpen}
                    />
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;