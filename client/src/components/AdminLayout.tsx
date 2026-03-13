import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin" || user?.role === "editor";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Button onClick={() => setLocation("/")} className="bg-primary text-primary-foreground">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      icon: Package,
    },
    {
      label: "Leads",
      href: "/admin/leads",
      icon: MessageSquare,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href: string) => location === href;

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-primary text-primary-foreground transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-primary-foreground/20 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-primary-foreground/10 rounded"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-primary-foreground/10"
                }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-primary-foreground/20">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-all"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{user?.name}</div>
                    <div className="text-xs text-primary-foreground/70 capitalize">
                      {user?.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>

            {userMenuOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-card text-foreground rounded-lg shadow-lg border border-border overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-muted transition-all text-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">
            {menuItems.find((item) => isActive(item.href))?.label || "Admin"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-muted rounded-lg transition-all"
              title="Logout"
            >
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
