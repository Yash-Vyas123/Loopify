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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2 bg-gradient-to-t from-base-100 via-base-100/95 to-transparent">
            <nav className="flex items-center justify-around bg-base-200/90 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl">
                {navItems.map((item) => {
                    const isActive =
                        item.to === "/"
                            ? currentPath === "/"
                            : currentPath.startsWith(item.to);
                    return (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 relative min-w-[60px] ${isActive
                                    ? "text-primary scale-105"
                                    : "text-base-content/60 hover:text-base-content"
                                }`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? "bg-primary/15" : ""}`}>
                                <item.icon className={`size-5 transition-all ${isActive ? "fill-primary/20 stroke-primary" : ""}`} />
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${isActive ? "opacity-100" : "opacity-50"}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -bottom-1 size-1 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                            )}
                            {item.label === "Alerts" && (
                                <span className="absolute top-1 right-2 size-2 rounded-full bg-secondary animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileNav;
