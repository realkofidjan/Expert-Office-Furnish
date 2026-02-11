import React from "react";
import {
  Box,
  Drawer,
  DrawerBody,
  useColorModeValue,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Content from "components/sidebar/components/Content";
import PropTypes from "prop-types";

export const SIDEBAR_GAP = 16;
export const SIDEBAR_EXPANDED_W = 280;
export const SIDEBAR_COLLAPSED_W = 80;
// Total space the sidebar occupies (width + left gap + right gap)
export const SIDEBAR_TOTAL_EXPANDED = SIDEBAR_EXPANDED_W + SIDEBAR_GAP * 2;
export const SIDEBAR_TOTAL_COLLAPSED = SIDEBAR_COLLAPSED_W + SIDEBAR_GAP * 2;

function Sidebar(props) {
  const { routes, expanded } = props;

  let shadow = useColorModeValue(
    "0 4px 24px 0 rgba(112, 144, 176, 0.14)",
    "0 4px 24px 0 rgba(0, 0, 0, 0.35)"
  );
  let sidebarBg = useColorModeValue("white", "navy.800");

  const currentW = expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <Box
      display={{ base: "none", md: "block" }}
      position="fixed"
      top={`${SIDEBAR_GAP}px`}
      left={`${SIDEBAR_GAP}px`}
      w={`${currentW}px`}
      maxH={`calc(100vh - ${SIDEBAR_GAP * 2}px)`}
      bg={sidebarBg}
      boxShadow={shadow}
      borderRadius="20px"
      zIndex="1500"
      transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      overflowX="hidden"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,0.1)",
          borderRadius: "4px",
        },
      }}
    >
      <Content routes={routes} collapsed={!expanded} />
    </Box>
  );
}

// Mobile drawer sidebar
export function SidebarResponsive(props) {
  const { routes, isOpen, onClose } = props;
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  const btnRef = React.useRef();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="left"
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
        <DrawerCloseButton
          zIndex="3"
          _focus={{ boxShadow: "none" }}
          _hover={{ boxShadow: "none" }}
        />
        <DrawerBody maxW="285px" px="0rem" pb="0" overflowY="auto">
          <Content routes={routes} collapsed={false} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  expanded: PropTypes.bool,
};

export default Sidebar;
