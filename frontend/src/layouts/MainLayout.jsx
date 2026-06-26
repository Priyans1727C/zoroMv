import { Outlet } from "react-router";
// import { Nav, Footer } from "../components/";

function MainLayout() {
    return (
        <> 
            {/* <Nav/> */}
            <h1 className="text-3xl font-bold underline">
                Header
            </h1>

            <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
                <Outlet />
            </main>    
            {/* <Footer/> */}
            <h1 className="text-3xl font-bold underline">
                footer
            </h1>
        </>

    );
}

export default MainLayout;