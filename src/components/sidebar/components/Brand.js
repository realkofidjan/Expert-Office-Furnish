import React from "react";
import { Box, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import logo from "assets/img/layout/Logo.png";

export function SidebarBrand({ collapsed }) {
  const dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");

  return (
    <Flex align="center" direction="column" overflow="hidden" px="12px">
      <Flex
        align="center"
        justify="center"
        my="28px"
        minH="36px"
        overflow="hidden"
      >
        <Image
          src={logo}
          alt="Expert Office Furnish"
          h="36px"
          w="auto"
          maxW={collapsed ? "36px" : "200px"}
          objectFit="contain"
          transition="max-width 0.3s ease"
        />
      </Flex>
      <Box
        w={collapsed ? "24px" : "80%"}
        h="1px"
        bg={dividerColor}
        borderRadius="full"
        mb="16px"
        transition="width 0.3s ease"
        mx="auto"
      />
    </Flex>
  );
}

export default SidebarBrand;
