import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const navigationItems = [
  { path: "/admin", icon: LayoutDashboard, label: "داشبورد", exact: true },
  { path: "/admin/content", icon: FileText, label: "مدیریت محتوا" },
  { path: "/admin/analytics", icon: BarChart3, label: "آمار و تحلیل" },
  { path: "/admin/settings", icon: Settings, label: "تنظیمات" },
];

export default function AdminLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl emerald-gradient flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">پنل مدیریت</h2>
            <p className="text-xs text-muted-foreground">میراث دیجیتال فاطمی‌نیا</p>
          </div>
        </Link>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          asChild
        >
          <Link to="/">
            <LogOut className="w-5 h-5" />
            بازگشت به سایت
          </Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="flex h-screen">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col border-l border-border bg-card">
          <NavContent />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 p-0">
                  <NavContent />
                </SheetContent>
              </Sheet>

              <h1 className="text-lg font-bold text-foreground">
                {navigationItems.find((item) => isActive(item.path, item.exact))?.label || "داشبورد"}
              </h1>
            </div>

            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              مشاهده سایت
            </Link>
          </header>

          <main className="flex-1 overflow-y-auto bg-background">
            <div className="p-4 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
