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
  Select,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { MdHistory, MdSearch } from "react-icons/md";
import Card from "components/card/Card";
import Pagination from "components/pagination/Pagination";
import { getLogs } from "api/logs";

const actionColorMap = {
  signup: "teal",
  login: "blue",
  create_product: "green",
  delete_product: "red",
  update_product: "orange",
  batch_upload_products: "purple",
  create_category: "green",
  delete_category: "red",
  update_category: "orange",
  confirm_order: "green",
  cancel_order: "red",
  process_checkout: "blue",
  confirm_delivery: "purple",
  confirm_payment: "teal",
  request_quote: "cyan",
  send_notification: "yellow",
};

const roleColorMap = {
  admin: "purple",
  "super-admin": "red",
  "sub-admin": "orange",
  customer: "gray",
};

export default function Logs() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const rowHover = useColorModeValue("gray.50", "whiteAlpha.50");

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [limit, setLimit] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit };
      if (filterAction) params.action = filterAction;
      if (filterRole) params.role = filterRole;
      const data = await getLogs(params);
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Error loading logs:", err);
    } finally {
      setLoading(false);
    }
  }, [filterAction, filterRole, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterAction, filterRole]);

  // Client-side search filter
  const filtered = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (log.email || "").toLowerCase().includes(q) ||
      (log.action || "").toLowerCase().includes(q) ||
      (log.role || "").toLowerCase().includes(q) ||
      JSON.stringify(log.details || {}).toLowerCase().includes(q)
    );
  });

  // Extract unique actions from current logs for the filter dropdown
  const uniqueActions = [...new Set(logs.map((l) => l.action).filter(Boolean))].sort();
  const uniqueRoles = [...new Set(logs.map((l) => l.role).filter(Boolean))].sort();

  function formatAction(action) {
    return (action || "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatTimestamp(ts) {
    if (!ts) return "--";
    try {
      const date = new Date(ts);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  }

  function formatDetails(details) {
    if (!details || Object.keys(details).length === 0) return "--";
    return Object.entries(details)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px">
        {/* Header */}
        <Flex justify="space-between" align="center" mb="20px" flexWrap="wrap" gap="10px">
          <HStack spacing="10px">
            <Icon as={MdHistory} w="24px" h="24px" color="brand.500" />
            <Text fontSize="xl" fontWeight="700" color={textColor}>
              Activity Logs
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
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              borderRadius="12px"
              bg={headerBg}
              border="none"
              _focus={{ bg: "white", border: "1px solid", borderColor: "brand.500" }}
            />
          </InputGroup>
        </Flex>

        {/* Filters */}
        <Flex gap="12px" mb="20px" flexWrap="wrap">
          <Select
            placeholder="All Actions"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            maxW="220px"
            size="sm"
            borderRadius="10px"
            bg={headerBg}
            border="none"
          >
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {formatAction(action)}
              </option>
            ))}
          </Select>
          <Select
            placeholder="All Roles"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            maxW="180px"
            size="sm"
            borderRadius="10px"
            bg={headerBg}
            border="none"
          >
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
          <Select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            maxW="140px"
            size="sm"
            borderRadius="10px"
            bg={headerBg}
            border="none"
          >
            <option value={50}>50 entries</option>
            <option value={100}>100 entries</option>
            <option value={200}>200 entries</option>
            <option value={500}>500 entries</option>
          </Select>
        </Flex>

        {/* Table */}
        {loading ? (
          <Flex justify="center" py="60px">
            <Spinner size="lg" color="brand.500" thickness="3px" />
          </Flex>
        ) : filtered.length === 0 ? (
          <Flex direction="column" align="center" py="60px" color="gray.400">
            <Icon as={MdHistory} w="40px" h="40px" mb="12px" />
            <Text fontWeight="500">
              {search || filterAction || filterRole
                ? "No logs match your filters"
                : "No activity logs found"}
            </Text>
          </Flex>
        ) : (() => {
          const totalPages = Math.ceil(filtered.length / pageSize);
          const safeCurrentPage = Math.min(currentPage, totalPages || 1);
          const paginatedLogs = filtered.slice(
            (safeCurrentPage - 1) * pageSize,
            safeCurrentPage * pageSize
          );
          return (
          <>
          <Box overflowX="auto" borderRadius="12px" border="1px solid" borderColor={borderColor}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg={headerBg}>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Timestamp</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">User</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Role</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Action</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedLogs.map((log, i) => (
                  <Tr key={log.id || i} _hover={{ bg: rowHover }}>
                    <Td borderColor={borderColor} whiteSpace="nowrap">
                      <Text fontSize="xs" color={textColorSecondary}>
                        {formatTimestamp(log.timestamp)}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Text fontSize="sm" color={textColor} fontWeight="500">
                        {log.email || "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge
                        colorScheme={roleColorMap[log.role] || "gray"}
                        fontSize="xs"
                        borderRadius="6px"
                        px="8px"
                        py="2px"
                      >
                        {log.role || "--"}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge
                        colorScheme={actionColorMap[log.action] || "gray"}
                        fontSize="xs"
                        borderRadius="6px"
                        px="8px"
                        py="2px"
                      >
                        {formatAction(log.action)}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor} maxW="300px">
                      <Text fontSize="xs" color={textColorSecondary} isTruncated>
                        {formatDetails(log.details)}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filtered.length}
            pageSize={pageSize}
          />
          </>
          );
        })()}
      </Card>
    </Box>
  );
}
