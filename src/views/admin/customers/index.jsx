import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  useColorModeValue,
  Icon,
  Badge,
  HStack,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { MdPeople, MdSearch } from "react-icons/md";
import Card from "components/card/Card";
import { listCustomers } from "api/customers";

export default function Customers() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const rowHover = useColorModeValue("gray.50", "whiteAlpha.50");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCustomers();
      setCustomers(data.customers || data || []);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.first_name || "").toLowerCase().includes(q) ||
      (c.last_name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px">
        <Flex justify="space-between" align="center" mb="20px" flexWrap="wrap" gap="10px">
          <HStack spacing="10px">
            <Icon as={MdPeople} w="24px" h="24px" color="brand.500" />
            <Text fontSize="xl" fontWeight="700" color={textColor}>
              Customers
            </Text>
            {!loading && (
              <Badge colorScheme="brand" fontSize="sm" borderRadius="full" px="10px" py="2px">
                {filtered.length}
              </Badge>
            )}
          </HStack>
          <InputGroup maxW="300px" size="md">
            <InputLeftElement>
              <Icon as={MdSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderRadius="12px"
              bg={headerBg}
              border="none"
              _focus={{ bg: "white", border: "1px solid", borderColor: "brand.500" }}
            />
          </InputGroup>
        </Flex>

        {loading ? (
          <Flex justify="center" py="60px">
            <Spinner size="lg" color="brand.500" thickness="3px" />
          </Flex>
        ) : filtered.length === 0 ? (
          <Flex direction="column" align="center" py="60px" color="gray.400">
            <Icon as={MdPeople} w="40px" h="40px" mb="12px" />
            <Text fontWeight="500">
              {search ? "No customers match your search" : "No customers found"}
            </Text>
          </Flex>
        ) : (
          <Box overflowX="auto" borderRadius="12px" border="1px solid" borderColor={borderColor}>
            <Table variant="simple" size="md">
              <Thead>
                <Tr bg={headerBg}>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Name</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Email</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Phone</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Role</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtered.map((customer, i) => (
                  <Tr key={customer.id || customer.uid || i} _hover={{ bg: rowHover }}>
                    <Td borderColor={borderColor}>
                      <Text color={textColor} fontWeight="600" fontSize="sm">
                        {[customer.first_name, customer.last_name].filter(Boolean).join(" ") || "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Text fontSize="sm" color="gray.600">
                        {customer.email || "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Text fontSize="sm" color="gray.600">
                        {customer.phone || "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge
                        colorScheme={customer.role === "admin" || customer.role === "super-admin" ? "purple" : "gray"}
                        fontSize="xs"
                        borderRadius="6px"
                        px="8px"
                        py="2px"
                      >
                        {customer.role || "customer"}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge
                        colorScheme={customer.is_active !== false ? "green" : "red"}
                        fontSize="xs"
                        borderRadius="6px"
                        px="8px"
                        py="2px"
                      >
                        {customer.is_active !== false ? "Active" : "Inactive"}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>
    </Box>
  );
}
