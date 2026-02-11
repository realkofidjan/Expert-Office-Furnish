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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Button,
  useToast,
} from "@chakra-ui/react";
import { MdRequestQuote, MdVisibility } from "react-icons/md";
import Card from "components/card/Card";
import { listQuotes, getQuote } from "api/quotes";

const statusColor = {
  pending: "orange",
  responded: "green",
  closed: "gray",
  cancelled: "red",
};

export default function Quotes() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const rowHover = useColorModeValue("gray.50", "whiteAlpha.50");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listQuotes();
      setQuotes(data.quotes || data || []);
    } catch (err) {
      console.error("Error loading quotes:", err);
      toast({
        title: "Error loading quotes",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleViewQuote = async (quote) => {
    setSelectedQuote(quote);
    onOpen();
    if (quote.id || quote.quote_id) {
      setDetailLoading(true);
      try {
        const detail = await getQuote({ quote_id: quote.quote_id || quote.id });
        setSelectedQuote(detail.quote || detail);
      } catch (err) {
        console.error("Error fetching quote detail:", err);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px">
        <Flex justify="space-between" align="center" mb="20px" flexWrap="wrap" gap="10px">
          <HStack spacing="10px">
            <Icon as={MdRequestQuote} w="24px" h="24px" color="brand.500" />
            <Text fontSize="xl" fontWeight="700" color={textColor}>
              Quote Requests
            </Text>
            {!loading && (
              <Badge colorScheme="brand" fontSize="sm" borderRadius="full" px="10px" py="2px">
                {quotes.length}
              </Badge>
            )}
          </HStack>
        </Flex>

        {loading ? (
          <Flex justify="center" py="60px">
            <Spinner size="lg" color="brand.500" thickness="3px" />
          </Flex>
        ) : quotes.length === 0 ? (
          <Flex direction="column" align="center" py="60px" color="gray.400">
            <Icon as={MdRequestQuote} w="40px" h="40px" mb="12px" />
            <Text fontWeight="500">No quote requests yet</Text>
            <Text fontSize="sm">Quotes from customers will appear here</Text>
          </Flex>
        ) : (
          <Box overflowX="auto" borderRadius="12px" border="1px solid" borderColor={borderColor}>
            <Table variant="simple" size="md">
              <Thead>
                <Tr bg={headerBg}>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Item</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Quantity</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Customer</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Status</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase">Quoted Price</Th>
                  <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {quotes.map((quote, i) => (
                  <Tr key={quote.quote_id || quote.id || i} _hover={{ bg: rowHover }}>
                    <Td borderColor={borderColor}>
                      <Text color={textColor} fontWeight="600" fontSize="sm" noOfLines={1} maxW="200px">
                        {quote.item_description || quote.product_name || "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Text fontSize="sm" color="gray.600">
                        {quote.quantity || "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Text fontSize="sm" color="gray.600">
                        {quote.customer_email || quote.customer_id || "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Badge
                        colorScheme={statusColor[quote.status] || "gray"}
                        fontSize="xs"
                        borderRadius="6px"
                        px="8px"
                        py="2px"
                      >
                        {quote.status || "pending"}
                      </Badge>
                    </Td>
                    <Td borderColor={borderColor}>
                      <Text fontSize="sm" color={textColor} fontWeight="600">
                        {quote.quoted_price ? `$${Number(quote.quoted_price).toFixed(2)}` : "--"}
                      </Text>
                    </Td>
                    <Td borderColor={borderColor} textAlign="right">
                      <Button
                        size="sm"
                        variant="ghost"
                        borderRadius="8px"
                        leftIcon={<Icon as={MdVisibility} />}
                        onClick={() => handleViewQuote(quote)}
                      >
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Card>

      {/* Quote Detail Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader borderBottom="1px solid" borderColor={borderColor} pb="16px">
            Quote Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="20px">
            {detailLoading ? (
              <Flex justify="center" py="40px">
                <Spinner size="lg" color="brand.500" />
              </Flex>
            ) : selectedQuote ? (
              <VStack align="stretch" spacing="12px">
                <DetailRow label="Item" value={selectedQuote.item_description || selectedQuote.product_name} />
                <DetailRow label="Quantity" value={selectedQuote.quantity} />
                <DetailRow label="Customer" value={selectedQuote.customer_email || selectedQuote.customer_id} />
                <DetailRow
                  label="Status"
                  value={
                    <Badge
                      colorScheme={statusColor[selectedQuote.status] || "gray"}
                      fontSize="xs"
                      borderRadius="6px"
                      px="8px"
                      py="2px"
                    >
                      {selectedQuote.status || "pending"}
                    </Badge>
                  }
                />
                {selectedQuote.quoted_price && (
                  <DetailRow label="Quoted Price" value={`$${Number(selectedQuote.quoted_price).toFixed(2)}`} />
                )}
                {selectedQuote.notes && <DetailRow label="Notes" value={selectedQuote.notes} />}
                {selectedQuote.admin_response && <DetailRow label="Admin Response" value={selectedQuote.admin_response} />}
                {selectedQuote.created_at && <DetailRow label="Created" value={new Date(selectedQuote.created_at).toLocaleString()} />}
              </VStack>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function DetailRow({ label, value }) {
  const labelColor = useColorModeValue("gray.500", "gray.400");
  const valueColor = useColorModeValue("secondaryGray.900", "white");

  if (!value) return null;

  return (
    <Flex justify="space-between" align="flex-start" py="4px">
      <Text fontSize="sm" color={labelColor} fontWeight="500" minW="120px">
        {label}
      </Text>
      {typeof value === "string" || typeof value === "number" ? (
        <Text fontSize="sm" color={valueColor} fontWeight="600" textAlign="right" flex="1" ml="16px">
          {value}
        </Text>
      ) : (
        <Box textAlign="right">{value}</Box>
      )}
    </Flex>
  );
}
