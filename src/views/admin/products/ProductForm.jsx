import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  SimpleGrid,
  useToast,
  VStack,
  HStack,
  Image,
  Text,
  Select,
  Flex,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { createProduct, editProduct, addProductImages, deleteProductImage } from "api/products";
import { listCategories } from "api/categories";
import { useAuth } from "contexts/AuthContext";
import { useNotifications } from "contexts/NotificationContext";

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23E2E8F0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23A0AEC0' font-size='9'%3EBroken%3C/text%3E%3C/svg%3E";

export default function ProductForm({ product, onSuccess, onCancel }) {
  const toast = useToast();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    brand: "",
    color: "",
    description: "",
    dimensions: "",
    category_name: "",
    subcategory_name: "",
  });
  const [files, setFiles] = useState([]);
  // Track existing images — which to keep, which to remove
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const canEditSku = user?.role === "sub-admin" || user?.role === "super-admin";

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        sku: product.sku || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        brand: product.brand || "",
        color: product.color || "",
        description: product.description || "",
        dimensions: product.dimensions || "",
        category_name: product.category_name || "",
        subcategory_name: product.subcategory_name || "",
      });
      setExistingImages(product.images || []);
      setImagesToRemove([]);
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await listCategories();
        const cats = data.categories || [];
        setCategories(cats);

        // Fallback: if product has category_id but no category_name, resolve from loaded categories
        if (product && !product.category_name && product.category_id) {
          const matchedCat = cats.find((c) => c.category_id === product.category_id);
          if (matchedCat) {
            let subName = "";
            if (product.subcategory_id && matchedCat.subcategories) {
              const matchedSub = matchedCat.subcategories.find(
                (s) => s.subcategory_id === product.subcategory_id
              );
              if (matchedSub) subName = matchedSub.name;
            }
            setForm((prev) => ({
              ...prev,
              category_name: prev.category_name || matchedCat.name,
              subcategory_name: prev.subcategory_name || subName,
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, [product]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [] },
    onDrop: (acceptedFiles) => {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const markExistingImageForRemoval = (url) => {
    setImagesToRemove((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.sku || !form.price || !form.category_name || !form.subcategory_name) {
      toast({
        title: "Please fill required fields",
        description: "Name, SKU, price, category, and subcategory are required.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (!product && files.length === 0) {
      toast({
        title: "Images required",
        description: "At least one image is required for new products.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    // When editing, ensure at least one image will remain
    if (product && existingImages.length === 0 && files.length === 0) {
      toast({
        title: "Images required",
        description: "A product must have at least one image.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      if (product) {
        // 1. Update product fields
        const updateData = {};
        const fields = ["name", "sku", "price", "stock", "brand", "color", "description", "dimensions", "category_name", "subcategory_name"];
        for (const field of fields) {
          const val = form[field];
          if (val !== undefined && val !== "") {
            updateData[field] = field === "price" ? parseFloat(val) : field === "stock" ? parseInt(val, 10) : val;
          }
        }
        if (Object.keys(updateData).length > 0) {
          await editProduct(product.id, updateData);
        }

        // 2. Delete removed images
        if (imagesToRemove.length > 0) {
          await deleteProductImage(product.id, imagesToRemove);
        }

        // 3. Add new images
        if (files.length > 0) {
          const imgData = new FormData();
          files.forEach((file) => imgData.append("images", file));
          await addProductImages(product.id, imgData);
        }

        toast({ title: "Product updated", status: "success", duration: 2000 });
        addNotification({
          type: "success",
          title: "Product updated",
          description: `"${form.name}" updated successfully`,
        });
      } else {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (value) formData.append(key, value);
        });
        files.forEach((file) => formData.append("images", file));
        await createProduct(formData);
        toast({ title: "Product created", status: "success", duration: 2000 });
        addNotification({
          type: "success",
          title: "Product created",
          description: `"${form.name}" (${form.sku}) added to inventory`,
        });
      }
      onSuccess();
    } catch (err) {
      toast({
        title: "Error saving product",
        description: err.response?.data?.error || err.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(
    (c) => c.name === form.category_name
  );

  return (
    <VStack spacing="16px" align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="16px">
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="600">Name</FormLabel>
          <Input name="name" value={form.name} onChange={handleChange} borderRadius="12px" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="600">SKU</FormLabel>
          <Input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            isDisabled={!!product && !canEditSku}
            placeholder="Unique product SKU"
            borderRadius="12px"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="600">Price</FormLabel>
          <Input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            borderRadius="12px"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600">Stock</FormLabel>
          <Input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="0"
            borderRadius="12px"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600">Brand</FormLabel>
          <Input name="brand" value={form.brand} onChange={handleChange} borderRadius="12px" />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="600">Color</FormLabel>
          <Input name="color" value={form.color} onChange={handleChange} borderRadius="12px" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="600">Category</FormLabel>
          <Select
            name="category_name"
            value={form.category_name}
            onChange={(e) => {
              setForm({
                ...form,
                category_name: e.target.value,
                subcategory_name: "",
              });
            }}
            borderRadius="12px"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="600">Subcategory</FormLabel>
          <Select
            name="subcategory_name"
            value={form.subcategory_name}
            onChange={handleChange}
            isDisabled={!selectedCategory}
            borderRadius="12px"
          >
            <option value="">Select subcategory</option>
            {selectedCategory?.subcategories?.map((sub) => (
              <option key={sub.subcategory_id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="600">Dimensions</FormLabel>
        <Input
          name="dimensions"
          value={form.dimensions}
          onChange={handleChange}
          placeholder="e.g. 120x60x75 cm"
          borderRadius="12px"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="600">Description</FormLabel>
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          borderRadius="12px"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="600">
          Images {!product && <Text as="span" color="red.500">*</Text>}
        </FormLabel>

        {/* Existing images with remove button */}
        {existingImages.length > 0 && (
          <Box mb="12px">
            <Text fontSize="xs" color="gray.500" mb="8px" fontWeight="600">
              Current images (click X to remove):
            </Text>
            <HStack flexWrap="wrap" gap="8px">
              {existingImages.map((url, i) => (
                <Box key={i} position="relative">
                  <Image
                    src={url}
                    alt={`Product ${i}`}
                    boxSize="64px"
                    objectFit="cover"
                    borderRadius="10px"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                  <IconButton
                    icon={<Icon as={MdClose} />}
                    size="xs"
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-6px"
                    right="-6px"
                    onClick={() => markExistingImageForRemoval(url)}
                    aria-label="Remove image"
                  />
                </Box>
              ))}
            </HStack>
          </Box>
        )}

        {/* Dropzone for new images */}
        <Box
          {...getRootProps()}
          border="2px dashed"
          borderColor={isDragActive ? "brand.500" : "gray.300"}
          borderRadius="16px"
          p="24px"
          textAlign="center"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ borderColor: "brand.400", bg: "gray.50" }}
          bg={isDragActive ? "gray.50" : "transparent"}
        >
          <input {...getInputProps()} />
          <Icon as={MdCloudUpload} w="36px" h="36px" color="gray.400" />
          <Text color="gray.400" mt="8px" fontSize="sm">
            {isDragActive ? "Drop images here..." : "Drag & drop images, or click to browse (JPG/PNG)"}
          </Text>
        </Box>
        {files.length > 0 && (
          <Box mt="12px">
            <Text fontSize="xs" color="gray.500" mb="8px" fontWeight="600">
              New images to upload:
            </Text>
            <HStack flexWrap="wrap" gap="8px">
              {files.map((file, i) => (
                <Box key={i} position="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    boxSize="64px"
                    objectFit="cover"
                    borderRadius="10px"
                  />
                  <IconButton
                    icon={<Icon as={MdClose} />}
                    size="xs"
                    colorScheme="red"
                    borderRadius="full"
                    position="absolute"
                    top="-6px"
                    right="-6px"
                    onClick={() => removeFile(i)}
                    aria-label="Remove image"
                  />
                </Box>
              ))}
            </HStack>
          </Box>
        )}
      </FormControl>

      <Flex justify="flex-end" gap="10px" pt="12px">
        <Button variant="ghost" onClick={onCancel} borderRadius="10px">
          Cancel
        </Button>
        <Button variant="brand" onClick={handleSubmit} isLoading={loading} borderRadius="10px">
          {product ? "Update Product" : "Create Product"}
        </Button>
      </Flex>
    </VStack>
  );
}
