import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar, { SidebarResponsive, SIDEBAR_TOTAL_EXPANDED, SIDEBAR_TOTAL_COLLAPSED } from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import { useAuth } from 'contexts/AuthContext';
import { SearchProvider } from 'contexts/SearchContext';
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from 'routes.js';

export default function AdminLayout(props) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const { token, user } = useAuth();

  // Desktop sidebar: expanded (full) or collapsed (icons only) — always visible
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const toggleDesktopSidebar = () => setSidebarExpanded((prev) => !prev);

  // Mobile drawer state
  const { isOpen: mobileOpen, onOpen: onMobileOpen, onClose: onMobileClose } = useDisclosure();

  if (!token) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const sidebarW = sidebarExpanded ? SIDEBAR_TOTAL_EXPANDED : SIDEBAR_TOTAL_COLLAPSED;

  const getActiveRoute = (routes) => {
    let activeRoute = 'Dashboard';
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routes[i].category) {
        let categoryActiveRoute = getActiveRoute(routes[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };
  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbar(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbar(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].secondary;
        }
      }
    }
    return activeNavbar;
  };
  const getActiveNavbarText = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routes[i].category) {
        let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };
  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      if (route.layout === '/admin') {
        // Skip coming soon routes (no component)
        if (route.comingSoon) return null;
        // Role-gate restricted routes
        if (route.requiredRole && user?.role !== route.requiredRole) {
          return (
            <Route path={`${route.path}`} element={<Navigate to="/dashboard" replace />} key={key} />
          );
        }
        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      }
      if (route.collapse) {
        return getRoutes(route.items);
      } else {
        return null;
      }
    });
  };
  document.documentElement.dir = 'ltr';
  return (
    <SearchProvider>
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        {/* Desktop sidebar — always visible, expanded or collapsed */}
        <Sidebar
          routes={routes}
          expanded={sidebarExpanded}
          {...rest}
        />

        {/* Mobile drawer sidebar */}
        <SidebarResponsive
          routes={routes}
          isOpen={mobileOpen}
          onClose={onMobileClose}
        />

        {/* Main content — shifts based on sidebar width */}
        <Box
          ml={{ base: '0px', md: `${sidebarW}px` }}
          w={{ base: '100%', md: `calc(100% - ${sidebarW}px)` }}
          minHeight="100vh"
          position="relative"
          transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <Portal>
            <Box>
              <Navbar
                onOpen={onMobileOpen}
                onToggleDesktopSidebar={toggleDesktopSidebar}
                sidebarExpanded={sidebarExpanded}
                sidebarW={sidebarW}
                logoText={'Expert Office Furnish'}
                brandText={getActiveRoute(routes)}
                secondary={getActiveNavbar(routes)}
                message={getActiveNavbarText(routes)}
                fixed={fixed}
                {...rest}
              />
            </Box>
          </Portal>

          <Box
            mx="auto"
            p={{ base: '16px', md: '24px', lg: '30px' }}
            minH="100vh"
            pt="50px"
          >
            <Routes>
              {getRoutes(routes)}
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />
            </Routes>
          </Box>
          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
    </SearchProvider>
  );
}
