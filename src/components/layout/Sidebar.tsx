
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Upload, 
  MessagesSquare, 
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const location = useLocation();
  
  const menuItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      href: "/dashboard"
    },
    {
      title: "Customers",
      icon: <Users size={20} />,
      href: "/customers"
    },
    {
      title: "Analytics",
      icon: <BarChart3 size={20} />,
      href: "/analytics"
    },
    {
      title: "Data Import",
      icon: <Upload size={20} />,
      href: "/import"
    },
    {
      title: "Campaigns",
      icon: <MessagesSquare size={20} />,
      href: "/campaigns"
    },
    {
      title: "Settings",
      icon: <Settings size={20} />,
      href: "/settings"
    }
  ];

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      <div className="p-4 flex items-center justify-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-md bg-crm-purple text-white font-bold">
            LS
          </div>
          {!collapsed && <span className="text-lg font-bold text-crm-gray-dark">Lanka Smart</span>}
        </Link>
      </div>
      
      <div className="flex-1 py-8">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                location.pathname === item.href 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4">
        <Button 
          variant="outline"
          className="w-full flex items-center gap-2 justify-center border-sidebar-border text-sidebar-foreground"
        >
          <LogOut size={18} />
          {!collapsed && <span>Log Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
