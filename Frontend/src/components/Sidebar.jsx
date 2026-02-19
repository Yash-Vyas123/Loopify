import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, UserCircleIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { to: "/", icon: HomeIcon, label: "Home" },
    { to: "/friends", icon: UsersIcon, label: "Friends" },
    { to: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <aside className="w-64 bg-base-200/50 backdrop-blur-xl border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-base-300">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <ShipWheelIcon className="size-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-2xl font-black font-sans bg-clip-text text-transparent bg-gradient-to-br from-primary via-secondary to-accent tracking-tighter">
            Loopify
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = currentPath === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${isActive
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20"
                  : "hover:bg-base-300 text-base-content/70 hover:text-base-content"
                }`}
            >
              <item.icon className={`size-5 transition-transform group-hover:scale-110 ${isActive ? "text-primary-content" : "opacity-70"}`} />
              <span className="font-semibold">{item.label}</span>
              {item.label === "Notifications" && (
                <span className="ml-auto size-2 rounded-full bg-secondary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE SECTION - CLICKABLE */}
      <Link
        to="/profile"
        className={`p-6 border-t border-base-300 m-4 rounded-3xl bg-base-300/30 backdrop-blur-sm border border-white/5 transition-all hover:bg-base-300/60 group ${currentPath === "/profile" ? "ring-2 ring-primary" : ""}`}
      >
        <div className="flex items-center gap-4">
          <div className="avatar ring-2 ring-primary/20 ring-offset-2 ring-offset-base-200 rounded-full group-hover:ring-primary/40 transition-all">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt={authUser?.fullName} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate group-hover:text-primary transition-all">{authUser?.fullName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-success opacity-80 group-hover:opacity-100 transition-all">My Profile</span>
            </div>
          </div>
        </div>
      </Link>
    </aside>
  );
};

export default Sidebar;