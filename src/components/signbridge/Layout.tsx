import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BackgroundDoodles from "./BackgroundDoodles";

const Layout = () => (
  <div className="min-h-svh flex flex-col relative">
    <BackgroundDoodles />
    <Navbar />
    <main className="flex-1 pt-16 relative z-10">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
