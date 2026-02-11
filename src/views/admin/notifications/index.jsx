import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
} from "@chakra-ui/react";
import { MdSend, MdNotifications } from "react-icons/md";
import Card from "components/card/Card";
import { addNotification } from "api/notifications";

export default function Notifications() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const toast = useToast();

  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "general",
    reference_type: "",
    reference_id: "",
    user_ids: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSend = async () => {
    if (!form.title || !form.message || !form.user_ids) {
      toast({
        title: "Please fill required fields",
        description: "Title, message, and user IDs are required.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        user_ids: form.user_ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      };
      await addNotification(payload);
      toast({
        title: "Notification sent",
        status: "success",
        duration: 2000,
      });
      setForm({
        title: "",
        message: "",
        type: "general",
        reference_type: "",
        reference_id: "",
        user_ids: "",
      });
    } catch (err) {
      toast({
        title: "Error sending notification",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="24px" maxW="700px">
        <Flex align="center" mb="4px" gap="10px">
          <Icon as={MdNotifications} w="24px" h="24px" color="brand.500" />
          <Text fontSize="xl" fontWeight="700" color={textColor}>
            Send Notification
          </Text>
        </Flex>
        <Text color="gray.500" fontSize="sm" mb="24px">
          Compose and send push notifications to specific users.
        </Text>

        <VStack spacing="16px" align="stretch">
          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="600">Title</FormLabel>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Notification title"
              borderRadius="12px"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="600">Message</FormLabel>
            <Textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your notification message..."
              rows={4}
              borderRadius="12px"
            />
          </FormControl>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="16px">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Type</FormLabel>
              <Select name="type" value={form.type} onChange={handleChange} borderRadius="12px">
                <option value="general">General</option>
                <option value="order">Order</option>
                <option value="product">Product</option>
                <option value="promotion">Promotion</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="600">Reference Type</FormLabel>
              <Input
                name="reference_type"
                value={form.reference_type}
                onChange={handleChange}
                placeholder="e.g. order, product"
                borderRadius="12px"
              />
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="600">Reference ID</FormLabel>
            <Input
              name="reference_id"
              value={form.reference_id}
              onChange={handleChange}
              placeholder="ID of the referenced item (optional)"
              borderRadius="12px"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel fontSize="sm" fontWeight="600">Target Users</FormLabel>
            <Textarea
              name="user_ids"
              value={form.user_ids}
              onChange={handleChange}
              placeholder="Enter user IDs separated by commas"
              rows={2}
              borderRadius="12px"
            />
            <Text fontSize="xs" color="gray.400" mt="6px">
              Comma-separated list of user IDs to receive this notification.
            </Text>
          </FormControl>

          <Flex justify="flex-end" pt="8px" borderTop="1px solid" borderColor={borderColor}>
            <Button
              leftIcon={<Icon as={MdSend} />}
              variant="brand"
              onClick={handleSend}
              isLoading={loading}
              borderRadius="12px"
              px="24px"
              mt="12px"
            >
              Send Notification
            </Button>
          </Flex>
        </VStack>
      </Card>
    </Box>
  );
}
