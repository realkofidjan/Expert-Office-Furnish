import { ChakraProvider, Box, Image, Text, VStack } from "@chakra-ui/react";
import initialTheme from "./theme/theme";
import logo from "./assets/img/layout/Logo.png";

export default function App() {
  return (
    <ChakraProvider theme={initialTheme}>
      <Box
        minH="100vh"
        bg="gray.50"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={4}
      >
        <VStack spacing={8} textAlign="center">
          <Image
            src={logo}
            alt="Expert Office Furnish Logo"
            maxW={{ base: "200px", md: "300px" }}
            mb={4}
          />
          <VStack spacing={3}>
            <Text
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="bold"
              color="gray.800"
              letterSpacing="tight"
            >
              Building Something Great
            </Text>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color="gray.600"
              maxW="600px"
              lineHeight="tall"
            >
              Our website is currently under construction. We're working hard to give you the best experience. Check back soon!
            </Text>
          </VStack>
          <Box pt={8}>
            <Box
              display="inline-block"
              p="1px"
              borderRadius="lg"
              bgGradient="linear(to-r, blue.400, purple.500)"
            >
              <Box bg="white" borderRadius="lg" px={8} py={3}>
                <Text fontWeight="semibold" color="gray.700" fontSize="sm" textTransform="uppercase" letterSpacing="widest">
                  Coming Soon
                </Text>
              </Box>
            </Box>
          </Box>
        </VStack>
        
        <Box position="fixed" bottom="8" textAlign="center">
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Expert Office Furnish. All rights reserved.
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

