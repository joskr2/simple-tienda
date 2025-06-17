// import { useContext } from "react";
// import Footer from "./footer";
// import Header from "./header";
import { Outlet } from "react-router";
import Header from "./header";
import Footer from "./footer";
//import { UserContext } from "@/context/user-context";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
