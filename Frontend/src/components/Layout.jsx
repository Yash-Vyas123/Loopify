import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Layout = ({ children, showSidebar = false, showNavbar = true }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {showNavbar && <Navbar />}

          <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
            {children}
          </main>

          {showSidebar && <MobileNav />}
        </div>
      </div>
    </div>
  );
};

export default Layout;