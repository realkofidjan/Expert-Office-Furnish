/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Badge, Box, Flex, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { useAuth } from "contexts/AuthContext";

export function SidebarLinks(props) {
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");
  let activeBg = useColorModeValue("brand.50", "whiteAlpha.100");
  const { user } = useAuth();

  const { routes, collapsed } = props;

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
        return (
          <React.Fragment key={index}>
            {createLinks(route.items)}
          </React.Fragment>
        );
      } else if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        // Role-based filtering
        if (route.requiredRole && user?.role !== route.requiredRole) {
          return null;
        }

        const isComingSoon = route.comingSoon;
        const isActive = !isComingSoon && activeRoute(route.path.toLowerCase());

        const linkContent = (
          <Flex
            align="center"
            h="44px"
            mx="12px"
            my="2px"
            px="0"
            borderRadius="12px"
            bg={isActive ? activeBg : "transparent"}
            cursor={isComingSoon ? "default" : "pointer"}
            transition="background 0.2s"
            _hover={isComingSoon ? {} : { bg: activeBg }}
            position="relative"
            overflow="hidden"
            opacity={isComingSoon ? 0.5 : 1}
          >
            <Flex
              align="center"
              justify="center"
              minW="56px"
              w="56px"
              h="44px"
              color={isActive ? activeIcon : textColor}
              flexShrink={0}
            >
              {route.icon}
            </Flex>

            <Text
              color={isActive ? activeColor : textColor}
              fontWeight={isActive ? "bold" : "normal"}
              fontSize="sm"
              whiteSpace="nowrap"
              opacity={collapsed ? 0 : 1}
              transition="opacity 0.2s"
            >
              {route.name}
            </Text>

            {isComingSoon && !collapsed && (
              <Badge
                ml="8px"
                fontSize="9px"
                colorScheme="gray"
                variant="subtle"
                borderRadius="full"
                px="6px"
                opacity={collapsed ? 0 : 1}
                transition="opacity 0.2s"
              >
                Soon
              </Badge>
            )}

            {isActive && (
              <Box
                position="absolute"
                right="6px"
                top="50%"
                transform="translateY(-50%)"
                h="24px"
                w="4px"
                bg={brandColor}
                borderRadius="5px"
              />
            )}
          </Flex>
        );

        if (isComingSoon) {
          if (collapsed) {
            return (
              <Box key={index}>
                <Tooltip
                  label={`${route.name} (Coming Soon)`}
                  placement="right"
                  hasArrow
                  fontSize="sm"
                  borderRadius="8px"
                  openDelay={200}
                >
                  {linkContent}
                </Tooltip>
              </Box>
            );
          }
          return <Box key={index}>{linkContent}</Box>;
        }

        if (collapsed) {
          return (
            <NavLink key={index} to={route.path}>
              <Tooltip
                label={route.name}
                placement="right"
                hasArrow
                fontSize="sm"
                borderRadius="8px"
                openDelay={200}
              >
                {linkContent}
              </Tooltip>
            </NavLink>
          );
        }

        return (
          <NavLink key={index} to={route.path}>
            {linkContent}
          </NavLink>
        );
      }
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;
