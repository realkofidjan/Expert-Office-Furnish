import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useToast,
  VStack,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import Card from "components/card/Card";
import {
  listCategories,
  addCategory,
  editCategory,
  deleteCategory,
  addSubcategory,
  editSubcategory,
  deleteSubcategory,
} from "api/categories";
import { useNotifications } from "contexts/NotificationContext";

export default function Categories() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const toast = useToast();
  const { addNotification } = useNotifications();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState("addCategory");
  const [form, setForm] = useState({ name: "", description: "" });
  const [editTarget, setEditTarget] = useState(null);
  const [parentCategory, setParentCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listCategories();
      setCategories(data.categories || []);
    } catch (err) {
      toast({
        title: "Error loading categories",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openModal = (mode, target = null, parent = null) => {
    setModalMode(mode);
    setEditTarget(target);
    setParentCategory(parent);
    setForm({
      name: target?.name || "",
      description: target?.description || "",
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", status: "warning", duration: 2000 });
      return;
    }
    setSubmitting(true);
    try {
      switch (modalMode) {
        case "addCategory":
          await addCategory(form);
          toast({ title: "Category added", status: "success", duration: 2000 });
          addNotification({ type: "success", title: "Category added", description: `"${form.name}" created` });
          break;
        case "editCategory":
          await editCategory(editTarget.category_id, form);
          toast({ title: "Category updated", status: "success", duration: 2000 });
          addNotification({ type: "info", title: "Category updated", description: `"${form.name}" updated` });
          break;
        case "addSub":
          await addSubcategory(parentCategory.category_id, form);
          toast({ title: "Subcategory added", status: "success", duration: 2000 });
          addNotification({ type: "success", title: "Subcategory added", description: `"${form.name}" added to "${parentCategory.name}"` });
          break;
        case "editSub":
          await editSubcategory(
            parentCategory.category_id,
            editTarget.subcategory_id,
            form
          );
          toast({ title: "Subcategory updated", status: "success", duration: 2000 });
          addNotification({ type: "info", title: "Subcategory updated", description: `"${form.name}" updated` });
          break;
        default:
          break;
      }
      onClose();
      fetchCategories();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await deleteCategory(cat.category_id);
      toast({ title: "Category deleted", status: "success", duration: 2000 });
      addNotification({ type: "success", title: "Category deleted", description: `"${cat.name}" removed` });
      fetchCategories();
    } catch (err) {
      toast({
        title: "Error deleting category",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleDeleteSub = async (cat, sub) => {
    if (!window.confirm(`Delete subcategory "${sub.name}"?`)) return;
    try {
      await deleteSubcategory(cat.category_id, sub.subcategory_id);
      toast({ title: "Subcategory deleted", status: "success", duration: 2000 });
      addNotification({ type: "success", title: "Subcategory deleted", description: `"${sub.name}" removed from "${cat.name}"` });
      fetchCategories();
    } catch (err) {
      toast({
        title: "Error deleting subcategory",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const modalTitle = {
    addCategory: "Add Category",
    editCategory: "Edit Category",
    addSub: `Add Subcategory to "${parentCategory?.name || ""}"`,
    editSub: "Edit Subcategory",
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px">
        <Flex justify="space-between" align="center" mb="20px">
          <Text fontSize="xl" fontWeight="700" color={textColor}>
            Categories ({categories.length})
          </Text>
          <Button
            leftIcon={<Icon as={MdAdd} />}
            variant="brand"
            onClick={() => openModal("addCategory")}
          >
            Add Category
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" py="40px">
            <Spinner size="lg" color="brand.500" />
          </Flex>
        ) : categories.length === 0 ? (
          <Text color="gray.400" textAlign="center" py="40px">
            No categories found. Add your first category to get started.
          </Text>
        ) : (
          <Accordion allowMultiple>
            {categories.map((cat) => (
              <AccordionItem key={cat.category_id} border="none" mb="8px">
                <AccordionButton
                  bg="gray.50"
                  _dark={{ bg: "whiteAlpha.100" }}
                  borderRadius="12px"
                  p="16px"
                >
                  <Box flex="1" textAlign="left">
                    <Text fontWeight="600" color={textColor}>
                      {cat.name}
                    </Text>
                    {cat.description && (
                      <Text fontSize="sm" color="gray.500">
                        {cat.description}
                      </Text>
                    )}
                  </Box>
                  <HStack spacing="4px" mr="8px">
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={<Icon as={MdAdd} />}
                      aria-label="Add subcategory"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("addSub", null, cat);
                      }}
                    />
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={<Icon as={MdEdit} />}
                      aria-label="Edit category"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("editCategory", cat);
                      }}
                    />
                    <IconButton
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      icon={<Icon as={MdDelete} />}
                      aria-label="Delete category"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat);
                      }}
                    />
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb="8px" pl="32px">
                  {cat.subcategories && cat.subcategories.length > 0 ? (
                    <VStack align="stretch" spacing="8px">
                      {cat.subcategories.map((sub) => (
                        <Flex
                          key={sub.subcategory_id}
                          justify="space-between"
                          align="center"
                          p="10px 16px"
                          bg="white"
                          _dark={{ bg: "whiteAlpha.50" }}
                          borderRadius="8px"
                          border="1px solid"
                          borderColor="gray.100"
                        >
                          <Box>
                            <Text fontWeight="500" color={textColor}>
                              {sub.name}
                            </Text>
                            {sub.description && (
                              <Text fontSize="sm" color="gray.500">
                                {sub.description}
                              </Text>
                            )}
                          </Box>
                          <HStack spacing="4px">
                            <IconButton
                              size="xs"
                              variant="ghost"
                              icon={<Icon as={MdEdit} />}
                              aria-label="Edit subcategory"
                              onClick={() => openModal("editSub", sub, cat)}
                            />
                            <IconButton
                              size="xs"
                              variant="ghost"
                              colorScheme="red"
                              icon={<Icon as={MdDelete} />}
                              aria-label="Delete subcategory"
                              onClick={() => handleDeleteSub(cat, sub)}
                            />
                          </HStack>
                        </Flex>
                      ))}
                    </VStack>
                  ) : (
                    <Text color="gray.400" fontSize="sm" py="8px">
                      No subcategories yet
                    </Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle[modalMode]}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="16px">
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="brand"
              onClick={handleSubmit}
              isLoading={submitting}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
