import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Image,
  HStack,
  Badge,
  useToast,
  Spinner,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
  Checkbox,
} from "@chakra-ui/react";
import { MdAdd, MdDelete, MdEdit, MdSearch, MdCloudUpload } from "react-icons/md";
import Card from "components/card/Card";
import { getAllProducts, deleteProduct } from "api/products";
import { useNotifications } from "contexts/NotificationContext";
import ProductForm from "./ProductForm";
import BulkUpload from "./BulkUpload";
import Pagination from "components/pagination/Pagination";
import { useSearch } from "contexts/SearchContext";

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23E2E8F0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23A0AEC0' font-size='10'%3ENo img%3C/text%3E%3C/svg%3E";

export default function Products() {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const rowHover = useColorModeValue("gray.50", "whiteAlpha.50");
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useSearch();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const pageSize = 10;

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isBulkDeleteOpen,
    onOpen: onBulkDeleteOpen,
    onClose: onBulkDeleteClose,
  } = useDisclosure();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? { search } : {};
      const data = await getAllProducts(params);
      setProducts(data.products || []);
    } catch (err) {
      toast({
        title: "Error loading products",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      toast({ title: "Product deleted", status: "success", duration: 2000 });
      addNotification({
        type: "success",
        title: "Product deleted",
        description: `"${deleteTarget.name}" was removed`,
      });
      onDeleteClose();
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      toast({
        title: "Error deleting product",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    onFormClose();
    setSelectedProduct(null);
    fetchProducts();
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (pageProducts) => {
    const pageIds = pageProducts.map((p) => p.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    const ids = [...selectedIds];
    let successCount = 0;
    let failCount = 0;
    for (const id of ids) {
      try {
        await deleteProduct(id);
        successCount++;
      } catch {
        failCount++;
      }
    }
    toast({
      title: `Deleted ${successCount} product${successCount !== 1 ? "s" : ""}`,
      description: failCount > 0 ? `${failCount} failed to delete` : undefined,
      status: failCount > 0 ? "warning" : "success",
      duration: 3000,
    });
    addNotification({
      type: "success",
      title: "Bulk delete completed",
      description: `${successCount} product${successCount !== 1 ? "s" : ""} removed`,
    });
    setSelectedIds(new Set());
    onBulkDeleteClose();
    setBulkDeleting(false);
    fetchProducts();
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Tabs variant="soft-rounded" colorScheme="brand">
        <Card p="20px">
          <Flex
            justify="space-between"
            align="center"
            mb="20px"
            flexWrap="wrap"
            gap="10px"
          >
            <HStack spacing="12px">
              <Text fontSize="xl" fontWeight="700" color={textColor}>
                Products
              </Text>
              {!loading && (
                <Badge
                  colorScheme="brand"
                  fontSize="sm"
                  borderRadius="full"
                  px="10px"
                  py="2px"
                >
                  {products.length}
                </Badge>
              )}
            </HStack>
            <HStack spacing="8px">
              <TabList border="none" bg="transparent">
                <Tab fontSize="sm" _selected={{ bg: "brand.500", color: "white" }}>
                  All Products
                </Tab>
                <Tab fontSize="sm" _selected={{ bg: "brand.500", color: "white" }}>
                  <Icon as={MdCloudUpload} mr="6px" />
                  Bulk Upload
                </Tab>
              </TabList>
            </HStack>
          </Flex>

          <TabPanels>
            {/* Products List Tab */}
            <TabPanel p="0">
              <Flex
                justify="space-between"
                align="center"
                mb="16px"
                flexWrap="wrap"
                gap="10px"
              >
                <HStack spacing="10px" flex="1">
                  <InputGroup maxW="320px" size="md">
                    <InputLeftElement>
                      <Icon as={MdSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      borderRadius="12px"
                      bg={headerBg}
                      border="none"
                      _focus={{ bg: "white", border: "1px solid", borderColor: "brand.500" }}
                    />
                  </InputGroup>
                  {selectedIds.size > 0 && (
                    <Button
                      leftIcon={<Icon as={MdDelete} />}
                      colorScheme="red"
                      size="md"
                      borderRadius="12px"
                      onClick={onBulkDeleteOpen}
                    >
                      Delete ({selectedIds.size})
                    </Button>
                  )}
                </HStack>
                <Button
                  leftIcon={<Icon as={MdAdd} />}
                  variant="brand"
                  size="md"
                  borderRadius="12px"
                  onClick={() => {
                    setSelectedProduct(null);
                    onFormOpen();
                  }}
                >
                  Add Product
                </Button>
              </Flex>

              {loading ? (
                <Flex justify="center" py="60px">
                  <Spinner size="lg" color="brand.500" thickness="3px" />
                </Flex>
              ) : products.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  py="60px"
                  color="gray.400"
                >
                  <Icon as={MdSearch} w="40px" h="40px" mb="12px" />
                  <Text fontWeight="500">No products found</Text>
                  <Text fontSize="sm">
                    {search
                      ? "Try a different search term"
                      : "Create your first product to get started"}
                  </Text>
                </Flex>
              ) : (() => {
                const totalPages = Math.ceil(products.length / pageSize);
                const paginatedProducts = products.slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize
                );
                return (
                <>
                <Box overflowX="auto" borderRadius="12px" border="1px solid" borderColor={borderColor}>
                  <Table variant="simple" size="md">
                    <Thead>
                      <Tr bg={headerBg}>
                        <Th borderColor={borderColor} w="40px" px="12px">
                          <Checkbox
                            isChecked={paginatedProducts.length > 0 && paginatedProducts.every((p) => selectedIds.has(p.id))}
                            isIndeterminate={paginatedProducts.some((p) => selectedIds.has(p.id)) && !paginatedProducts.every((p) => selectedIds.has(p.id))}
                            onChange={() => toggleSelectAll(paginatedProducts)}
                            colorScheme="brand"
                          />
                        </Th>
                        <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" letterSpacing="wider">Image</Th>
                        <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" letterSpacing="wider">Product</Th>
                        <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" letterSpacing="wider">SKU</Th>
                        <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" letterSpacing="wider" isNumeric>Price</Th>
                        <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" letterSpacing="wider" isNumeric>Stock</Th>
                        <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" letterSpacing="wider">Brand</Th>
                        <Th borderColor={borderColor} fontSize="xs" textTransform="uppercase" letterSpacing="wider" textAlign="right">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {paginatedProducts.map((product) => (
                        <Tr key={product.id} _hover={{ bg: rowHover }} transition="background 0.15s" bg={selectedIds.has(product.id) ? "brand.50" : undefined} _dark={selectedIds.has(product.id) ? { bg: "whiteAlpha.100" } : undefined}>
                          <Td borderColor={borderColor} px="12px">
                            <Checkbox
                              isChecked={selectedIds.has(product.id)}
                              onChange={() => toggleSelect(product.id)}
                              colorScheme="brand"
                            />
                          </Td>
                          <Td borderColor={borderColor} py="12px">
                            <Image
                              src={product.images?.[0] || FALLBACK_IMG}
                              alt={product.name}
                              boxSize="44px"
                              objectFit="cover"
                              borderRadius="10px"
                              onError={(e) => { e.target.src = FALLBACK_IMG; }}
                            />
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text color={textColor} fontWeight="600" fontSize="sm">
                              {product.name}
                            </Text>
                            {product.category_name && (
                              <Text fontSize="xs" color="gray.500">
                                {product.category_name}
                              </Text>
                            )}
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge
                              colorScheme="gray"
                              fontSize="xs"
                              borderRadius="6px"
                              px="8px"
                              py="2px"
                              fontFamily="mono"
                            >
                              {product.sku}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor} isNumeric>
                            <Text color={textColor} fontWeight="600" fontSize="sm">
                              GH₵{product.price?.toFixed(2)}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor} isNumeric>
                            <Badge
                              colorScheme={
                                (product.stock ?? 0) === 0
                                  ? "red"
                                  : (product.stock ?? 0) < 10
                                  ? "orange"
                                  : "green"
                              }
                              fontSize="xs"
                              borderRadius="6px"
                              px="8px"
                              py="2px"
                            >
                              {product.stock ?? 0}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text color="gray.500" fontSize="sm">
                              {product.brand || "--"}
                            </Text>
                          </Td>
                          <Td borderColor={borderColor} textAlign="right">
                            <HStack justify="flex-end" spacing="4px">
                              <Tooltip label="Edit product" fontSize="xs">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  borderRadius="8px"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    onFormOpen();
                                  }}
                                >
                                  <Icon as={MdEdit} w="18px" h="18px" />
                                </Button>
                              </Tooltip>
                              <Tooltip label="Delete product" fontSize="xs">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  borderRadius="8px"
                                  onClick={() => {
                                    setDeleteTarget(product);
                                    onDeleteOpen();
                                  }}
                                >
                                  <Icon as={MdDelete} w="18px" h="18px" />
                                </Button>
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={products.length}
                  pageSize={pageSize}
                />
                </>
                );
              })()}
            </TabPanel>

            {/* Bulk Upload Tab */}
            <TabPanel p="0">
              <BulkUpload onSuccess={fetchProducts} />
            </TabPanel>
          </TabPanels>
        </Card>
      </Tabs>

      {/* Product Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="xl" scrollBehavior="inside">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader borderBottom="1px solid" borderColor={borderColor} pb="16px">
            {selectedProduct ? "Edit Product" : "New Product"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py="20px">
            <ProductForm
              product={selectedProduct}
              onSuccess={handleFormSuccess}
              onCancel={onFormClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>Delete Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="700">{deleteTarget?.name}</Text>?
            </Text>
            <Text fontSize="sm" color="gray.500" mt="8px">
              This will permanently remove the product and all associated images.
            </Text>
          </ModalBody>
          <ModalFooter gap="8px">
            <Button variant="ghost" onClick={onDeleteClose} borderRadius="10px">
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={deleting}
              borderRadius="10px"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal isOpen={isBulkDeleteOpen} onClose={onBulkDeleteClose} isCentered size="sm">
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px">
          <ModalHeader>Delete {selectedIds.size} Product{selectedIds.size !== 1 ? "s" : ""}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete{" "}
              <Text as="span" fontWeight="700">{selectedIds.size} selected product{selectedIds.size !== 1 ? "s" : ""}</Text>?
            </Text>
            <Text fontSize="sm" color="gray.500" mt="8px">
              This action cannot be undone. All associated images will also be removed.
            </Text>
          </ModalBody>
          <ModalFooter gap="8px">
            <Button variant="ghost" onClick={onBulkDeleteClose} borderRadius="10px">
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleBulkDelete}
              isLoading={bulkDeleting}
              borderRadius="10px"
            >
              Delete All
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
