import { useState } from "react";
import { Home, Archive, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/", label: "خانه", icon: Home },
  { path: "/archive", label: "آرشیو", icon: Archive },
];

export default function MobileNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Bottom nav for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden player-surface border-t border-border/20 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg transition-colors ${
                  isActive ? "text-gold" : "text-player-foreground/50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
