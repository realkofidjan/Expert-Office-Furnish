import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  Badge,
  useColorModeValue,
  useToast,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Divider,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import {
  MdCheckCircle,
  MdLocalShipping,
  MdPayment,
  MdCancel,
  MdShoppingCart,
} from "react-icons/md";
import Card from "components/card/Card";
import {
  confirmOrder,
  confirmDelivery,
  confirmPayment,
  cancelOrder,
} from "api/orders";
import { useNotifications } from "contexts/NotificationContext";

const statusColor = {
  quoted: "blue",
  confirmed: "orange",
  delivered: "green",
  paid: "purple",
  cancelled: "red",
};

const LIFECYCLE_STEPS = [
  { key: "quoted", label: "Quoted", color: "blue" },
  { key: "confirmed", label: "Confirmed", color: "orange" },
  { key: "delivered", label: "Delivered", color: "green" },
  { key: "paid", label: "Paid", color: "purple" },
];

export default function Orders() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [orderId, setOrderId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState("");

  const handleAction = async (action, id) => {
    setActionLoading(action);
    try {
      let result;
      switch (action) {
        case "confirm":
          result = await confirmOrder(id);
          toast({ title: "Order confirmed", status: "success", duration: 2000 });
          addNotification({ type: "success", title: "Order confirmed", description: `Order ${id} confirmed` });
          break;
        case "deliver":
          result = await confirmDelivery(id);
          toast({ title: "Delivery confirmed", status: "success", duration: 2000 });
          addNotification({ type: "success", title: "Delivery confirmed", description: `Order ${id} marked as delivered` });
          break;
        case "payment":
          result = await confirmPayment(id);
          toast({ title: "Payment confirmed", status: "success", duration: 2000 });
          addNotification({ type: "success", title: "Payment confirmed", description: `Order ${id} payment received` });
          break;
        case "cancel":
          result = await cancelOrder(id);
          toast({ title: "Order cancelled", status: "info", duration: 2000 });
          addNotification({ type: "warning", title: "Order cancelled", description: `Order ${id} was cancelled` });
          break;
        default:
          break;
      }
      if (result) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: result.status } : null
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setActionLoading("");
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px">
        <Text fontSize="xl" fontWeight="700" color={textColor} mb="4px">
          Order Management
        </Text>
        <Text color="gray.500" fontSize="sm" mb="24px">
          Enter an order ID to manage its lifecycle.
        </Text>

        {/* Lifecycle indicator */}
        <Flex mb="24px" align="center" flexWrap="wrap" gap="4px">
          {LIFECYCLE_STEPS.map((step, i) => (
            <React.Fragment key={step.key}>
              <Badge
                colorScheme={step.color}
                fontSize="xs"
                borderRadius="full"
                px="12px"
                py="4px"
                fontWeight="600"
              >
                {step.label}
              </Badge>
              {i < LIFECYCLE_STEPS.length - 1 && (
                <Text color="gray.300" fontSize="xs" mx="2px">→</Text>
              )}
            </React.Fragment>
          ))}
        </Flex>

        <VStack spacing="16px" align="stretch" maxW="500px">
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">Order ID</FormLabel>
            <HStack>
              <Input
                placeholder="Enter order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                borderRadius="12px"
                size="md"
              />
              <Button
                variant="brand"
                borderRadius="12px"
                px="24px"
                onClick={() => {
                  if (orderId.trim()) {
                    setSelectedOrder({ id: orderId.trim(), status: "unknown" });
                    onOpen();
                  }
                }}
                isDisabled={!orderId.trim()}
              >
                Manage
              </Button>
            </HStack>
          </FormControl>
        </VStack>

        <Divider my="24px" borderColor={borderColor} />

        <Text fontSize="md" fontWeight="600" color={textColor} mb="12px">
          Quick Actions
        </Text>
        <Text color="gray.500" fontSize="sm" mb="16px">
          Perform actions directly on the order ID entered above.
        </Text>

        <QuickActions orderId={orderId} onAction={handleAction} actionLoading={actionLoading} />
      </Card>

      {/* Order Action Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader borderBottom="1px solid" borderColor={borderColor} pb="16px">
            Manage Order
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="20px">
            {selectedOrder && (
              <VStack align="stretch" spacing="16px">
                <HStack justify="space-between">
                  <Text fontWeight="600" fontSize="sm">Order ID</Text>
                  <Badge fontFamily="mono" fontSize="sm" px="10px" py="4px" borderRadius="8px" colorScheme="gray">
                    {selectedOrder.id}
                  </Badge>
                </HStack>
                {selectedOrder.status !== "unknown" && (
                  <HStack justify="space-between">
                    <Text fontWeight="600" fontSize="sm">Status</Text>
                    <Badge
                      colorScheme={statusColor[selectedOrder.status] || "gray"}
                      fontSize="sm"
                      px="10px"
                      py="4px"
                      borderRadius="8px"
                    >
                      {selectedOrder.status}
                    </Badge>
                  </HStack>
                )}
                <Divider />
                <Text fontSize="sm" color="gray.500">
                  Select an action:
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <VStack w="100%" spacing="8px">
              <HStack w="100%" spacing="8px">
                <Button
                  leftIcon={<Icon as={MdCheckCircle} />}
                  colorScheme="green"
                  size="sm"
                  flex="1"
                  borderRadius="10px"
                  isLoading={actionLoading === "confirm"}
                  onClick={() => handleAction("confirm", selectedOrder.id)}
                >
                  Confirm
                </Button>
                <Button
                  leftIcon={<Icon as={MdLocalShipping} />}
                  colorScheme="blue"
                  size="sm"
                  flex="1"
                  borderRadius="10px"
                  isLoading={actionLoading === "deliver"}
                  onClick={() => handleAction("deliver", selectedOrder.id)}
                >
                  Delivered
                </Button>
              </HStack>
              <HStack w="100%" spacing="8px">
                <Button
                  leftIcon={<Icon as={MdPayment} />}
                  colorScheme="purple"
                  size="sm"
                  flex="1"
                  borderRadius="10px"
                  isLoading={actionLoading === "payment"}
                  onClick={() => handleAction("payment", selectedOrder.id)}
                >
                  Paid
                </Button>
                <Button
                  leftIcon={<Icon as={MdCancel} />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  flex="1"
                  borderRadius="10px"
                  isLoading={actionLoading === "cancel"}
                  onClick={() => handleAction("cancel", selectedOrder.id)}
                >
                  Cancel
                </Button>
              </HStack>
              <Button variant="ghost" w="100%" onClick={onClose} mt="4px" borderRadius="10px">
                Close
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function QuickActions({ orderId, onAction, actionLoading }) {
  if (!orderId.trim()) {
    return (
      <Flex direction="column" align="center" py="32px" color="gray.400">
        <Icon as={MdShoppingCart} w="36px" h="36px" mb="8px" />
        <Text fontWeight="500" fontSize="sm">Enter an order ID above to enable actions</Text>
      </Flex>
    );
  }

  return (
    <Flex gap="10px" flexWrap="wrap">
      <Button
        leftIcon={<Icon as={MdCheckCircle} />}
        colorScheme="green"
        size="sm"
        borderRadius="10px"
        isLoading={actionLoading === "confirm"}
        onClick={() => onAction("confirm", orderId)}
      >
        Confirm
      </Button>
      <Button
        leftIcon={<Icon as={MdLocalShipping} />}
        colorScheme="blue"
        size="sm"
        borderRadius="10px"
        isLoading={actionLoading === "deliver"}
        onClick={() => onAction("deliver", orderId)}
      >
        Delivered
      </Button>
      <Button
        leftIcon={<Icon as={MdPayment} />}
        colorScheme="purple"
        size="sm"
        borderRadius="10px"
        isLoading={actionLoading === "payment"}
        onClick={() => onAction("payment", orderId)}
      >
        Paid
      </Button>
      <Button
        leftIcon={<Icon as={MdCancel} />}
        colorScheme="red"
        variant="outline"
        size="sm"
        borderRadius="10px"
        isLoading={actionLoading === "cancel"}
        onClick={() => onAction("cancel", orderId)}
      >
        Cancel
      </Button>
    </Flex>
  );
}
