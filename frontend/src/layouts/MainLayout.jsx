
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScrollToTop from "@/components/utility/ScrollToTop";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
