import { Box, Flex, Stack } from "@chakra-ui/react";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";

function SidebarContent(props) {
  const { routes, collapsed } = props;
  return (
    <Flex
      direction="column"
      pt="25px"
      pb="20px"
      px="0px"
      borderRadius="30px"
    >
      <Brand collapsed={collapsed} />
      <Stack direction="column" mb="auto" mt="8px">
        <Box>
          <Links routes={routes} collapsed={collapsed} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
