import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AuthHelper from "../utils/AuthHelper";
import { useEffect } from "react";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthHelper.isLoggedIn()) {
      navigate("/signin");
      return;
    }

    let isUserSuperUser = false;
    let isAdminUser = false;
    let userRoles = AuthHelper.getUserRoles();

    if (Array.isArray(userRoles)) {
      if (userRoles.includes("SuperAdmin")) {
        isUserSuperUser = true;
      }
      if (userRoles.includes("Admin")) {
        isAdminUser = true;
      }
    } else if (userRoles === "SuperAdmin") {
      isUserSuperUser = true;
    } else if (userRoles === "Admin") {
      isAdminUser = true;
    }

    const isSuperAdminRoute = location.pathname.startsWith("/superuser");
    const isAdminRoute = location.pathname.startsWith("/admin");

    if (isSuperAdminRoute && !isUserSuperUser) {
      navigate("/not-authorized");
    } else if (isAdminRoute && !isAdminUser) {
      navigate("/not-authorized");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;

