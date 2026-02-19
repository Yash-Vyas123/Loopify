import { Link, useLocation } from "react-router";
import { BellIcon, HomeIcon, UsersIcon, UserCircleIcon } from "lucide-react";

const MobileNav = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    const navItems = [
        { to: "/", icon: HomeIcon, label: "Home" },
        { to: "/friends", icon: UsersIcon, label: "Friends" },
        { to: "/notifications", icon: BellIcon, label: "Alerts" },
        { to: "/profile", icon: UserCircleIcon, label: "Profile" },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-base-100 via-base-100/95 to-transparent">
            <nav className="flex items-center justify-around bg-base-200/80 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl">
                {navItems.map((item) => {
                    const isActive = currentPath === item.to;
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 relative ${isActive
                                    ? "text-primary scale-110"
                                    : "text-base-content/60 hover:text-base-content"
                                }`}
                        >
                            <item.icon className={`size-6 ${isActive ? "fill-primary/20" : ""}`} />
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-0 h-0 w-0 overflow-hidden"}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -bottom-1 size-1 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                            )}
                            {item.label === "Alerts" && (
                                <span className="absolute top-1 right-1 size-2 rounded-full bg-secondary animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileNav;
