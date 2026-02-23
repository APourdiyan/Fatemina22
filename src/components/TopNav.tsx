import { Link, useLocation } from "react-router-dom";
import { Home, Archive, BookOpen } from "lucide-react";
import CommandPalette from "./CommandPalette";

const navLinks = [
  { path: "/", label: "خانه", icon: Home },
  { path: "/archive", label: "آرشیو", icon: Archive },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-6 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl emerald-gradient flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-foreground leading-tight">میراث دیجیتال</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">آیت‌الله فاطمی‌نیا</p>
            </div>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl">
            <CommandPalette />
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
