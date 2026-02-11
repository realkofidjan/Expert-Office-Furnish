import React from "react";
import { Box, Flex, Image, useColorModeValue } from "@chakra-ui/react";
import logoWhite from "assets/img/layout/logoWhite.png";

export function SidebarBrand({ collapsed }) {
  const logoFilter = useColorModeValue("invert(1)", "none");
  const dividerColor = useColorModeValue("gray.200", "whiteAlpha.200");

  return (
    <Flex align="center" direction="column" overflow="hidden" px="12px">
      <Flex
        align="center"
        justify="center"
        my="28px"
        minH="28px"
        overflow="hidden"
      >
        <Image
          src={logoWhite}
          alt="Expert Office Furnish"
          h="28px"
          w="auto"
          maxW={collapsed ? "32px" : "200px"}
          objectFit="contain"
          filter={logoFilter}
          transition="max-width 0.3s ease, filter 0.2s"
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
