import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation, isPending } = useLogout();


  return (
    <nav className="bg-base-200/80 backdrop-blur-xl border-b border-base-300 sticky top-0 z-30 h-16 flex items-center transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full lg:justify-end">
          {/* LOGO - ONLY IN THE THE CHAT PAGE ON LARGE SCREENS */}
          {isChatPage && (
            <div className="mr-auto lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <ShipWheelIcon className="size-8 text-primary" />
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-tighter">
                  Loopify
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-2 sm:gap-4 ml-auto">
            {/* Search or extra tools could go here */}

            <Link to={"/notifications"} className="hidden sm:block">
              <button className="btn btn-ghost btn-circle hover:bg-primary/10 group">
                <BellIcon className="h-5 w-5 text-base-content/70 group-hover:text-primary transition-colors" />
              </button>
            </Link>

            <ThemeSelector />

            <div className="h-8 w-[1px] bg-base-300 mx-1 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2 group cursor-pointer">
              <div className="avatar ring-2 ring-primary/10 ring-offset-2 ring-offset-base-100 rounded-full group-hover:ring-primary/30 transition-all">
                <div className="w-8 rounded-full">
                  <img src={authUser?.profilePic} alt="User" />
                </div>
              </div>
              <span className="text-sm font-semibold hidden md:block opacity-80 group-hover:opacity-100 transition-opacity">
                {authUser?.fullName?.split(" ")[0]}
              </span>
            </div>

            <button
              className="btn btn-ghost btn-circle hover:text-error transition-colors disabled:bg-transparent"
              onClick={() => logoutMutation()}
              disabled={isPending}
              title="Logout"
            >
              {isPending ? <span className="loading loading-spinner loading-xs"></span> : <LogOutIcon className="h-5 w-5 opacity-70" />}
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;