/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Flex, Text, Tooltip, useColorModeValue } from "@chakra-ui/react";

export function SidebarLinks(props) {
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");
  let activeBg = useColorModeValue("brand.50", "whiteAlpha.100");

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
        const isActive = activeRoute(route.path.toLowerCase());

        // Single unified layout for both states.
        // The icon is always centered at 40px from left (center of the 80px collapsed width).
        // When expanded, the text shows to the right. When collapsed, overflow hides it.
        const linkContent = (
          <Flex
            align="center"
            h="44px"
            mx="12px"
            my="2px"
            px="0"
            borderRadius="12px"
            bg={isActive ? activeBg : "transparent"}
            cursor="pointer"
            transition="background 0.2s"
            _hover={{ bg: activeBg }}
            position="relative"
            overflow="hidden"
          >
            {/* Icon — always centered in the first 56px zone (80 - 12*2 margin = 56px) */}
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

            {/* Text — flows naturally after icon, clipped by overflow:hidden on parent */}
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

            {/* Active indicator bar on the right */}
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

        if (collapsed) {
          return (
            <NavLink key={index} to={route.layout + route.path}>
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
          <NavLink key={index} to={route.layout + route.path}>
            {linkContent}
          </NavLink>
        );
      }
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;
