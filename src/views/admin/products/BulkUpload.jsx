import React, { useState } from "react";
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
  Progress,
  Alert,
  AlertIcon,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  CloseButton,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { MdCloudUpload, MdDownload, MdCheckCircle, MdError } from "react-icons/md";
import { batchProductUpload } from "api/products";
import { useNotifications } from "contexts/NotificationContext";

const TEMPLATE_COLUMNS = [
  { key: "name", label: "Name", example: "Modern Sofa Set" },
  { key: "sku", label: "SKU", example: "SKU001" },
  { key: "category_name", label: "Category", example: "Living Room" },
  { key: "subcategory_name", label: "Subcategory", example: "Sofas" },
  { key: "brand", label: "Brand", example: "CozyHome" },
  { key: "color", label: "Color", example: "Grey" },
  { key: "description", label: "Description", example: "Comfortable modern 3-seater sofa" },
  { key: "dimensions", label: "Dimensions", example: "80x35x40 cm" },
  { key: "price", label: "Price", example: "499.99" },
  { key: "stock", label: "Stock", example: "10" },
  { key: "image_urls", label: "Image URLs", example: "https://drive.google.com/file/d/.../view?usp=share_link" },
];

export default function BulkUpload({ onSuccess }) {
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.300");
  const bgHover = useColorModeValue("gray.50", "whiteAlpha.50");
  const tableBg = useColorModeValue("white", "navy.800");
  const headerBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const toast = useToast();
  const { addNotification } = useNotifications();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setResult(null);
      }
    },
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await batchProductUpload(formData);
      const created = data.created || [];
      const errors = data.errors || [];
      setResult({
        success: true,
        message: data.message || "Upload completed",
        created,
        errors,
      });
      toast({ title: "Bulk upload completed", status: "success", duration: 3000 });
      addNotification({
        type: "success",
        title: "Bulk upload completed",
        description: `${created.length} product(s) created from "${file.name}"${errors.length > 0 ? `, ${errors.length} error(s)` : ""}`,
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setResult({ success: false, message: errMsg, created: [], errors: [] });
      toast({
        title: "Upload failed",
        description: errMsg,
        status: "error",
        duration: 4000,
      });
      addNotification({
        type: "error",
        title: "Bulk upload failed",
        description: errMsg,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = TEMPLATE_COLUMNS.map((c) => c.key).join(",");
    const example = TEMPLATE_COLUMNS.map((c) => c.example).join(",");
    const csv = `${headers}\n${example}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product_upload_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearResult = () => {
    setResult(null);
    setFile(null);
  };

  return (
    <VStack spacing="24px" align="stretch">
      <Flex justify="space-between" align="center" flexWrap="wrap" gap="10px">
        <Box>
          <Text fontSize="md" fontWeight="600">
            Bulk Product Upload
          </Text>
          <Text fontSize="sm" color="gray.500">
            Upload a CSV or Excel file to create multiple products at once.
          </Text>
        </Box>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Icon as={MdDownload} />}
          onClick={handleDownloadTemplate}
        >
          Download Template
        </Button>
      </Flex>

      {/* Template Preview */}
      <Box>
        <Text fontSize="sm" fontWeight="600" mb="8px" color="gray.600">
          Expected file format
        </Text>
        <Box
          overflowX="auto"
          borderRadius="12px"
          border="1px solid"
          borderColor={borderColor}
          bg={tableBg}
        >
          <Table size="sm" variant="simple">
            <Thead>
              <Tr bg={headerBg}>
                {TEMPLATE_COLUMNS.map((col) => (
                  <Th
                    key={col.key}
                    fontSize="xs"
                    textTransform="capitalize"
                    whiteSpace="nowrap"
                    py="10px"
                  >
                    {col.label}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {TEMPLATE_COLUMNS.map((col) => (
                  <Td
                    key={col.key}
                    fontSize="xs"
                    color="gray.500"
                    whiteSpace="nowrap"
                    fontStyle="italic"
                    maxW="200px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {col.example}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        </Box>
        <Text fontSize="xs" color="gray.400" mt="6px">
          Image URLs accept Google Drive share links. Separate multiple URLs with a semicolon (;).
        </Text>
      </Box>

      {/* Dropzone */}
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? "brand.500" : borderColor}
        borderRadius="16px"
        p="32px"
        textAlign="center"
        cursor="pointer"
        bg={isDragActive ? bgHover : "transparent"}
        transition="all 0.2s"
        _hover={{ borderColor: "brand.400", bg: bgHover }}
      >
        <input {...getInputProps()} />
        <Icon as={MdCloudUpload} w="48px" h="48px" color="gray.400" mb="12px" />
        {file ? (
          <VStack spacing="4px">
            <Text fontWeight="600">{file.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {(file.size / 1024).toFixed(1)} KB
            </Text>
          </VStack>
        ) : (
          <VStack spacing="4px">
            <Text fontWeight="500" color="gray.500">
              {isDragActive
                ? "Drop file here..."
                : "Drag & drop a CSV or Excel file, or click to browse"}
            </Text>
            <Text fontSize="xs" color="gray.400">
              Supported: .csv, .xlsx, .xls
            </Text>
          </VStack>
        )}
      </Box>

      {uploading && (
        <Progress size="sm" isIndeterminate colorScheme="brand" borderRadius="full" />
      )}

      {file && !uploading && (
        <Flex justify="flex-end" gap="10px">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFile(null);
              setResult(null);
            }}
          >
            Clear
          </Button>
          <Button
            variant="brand"
            size="sm"
            leftIcon={<Icon as={MdCloudUpload} />}
            onClick={handleUpload}
          >
            Upload Products
          </Button>
        </Flex>
      )}

      {result && (
        <Box>
          <Alert
            status={result.success ? "success" : "error"}
            borderRadius="12px"
            mb="12px"
          >
            <AlertIcon />
            <AlertDescription flex="1">{result.message}</AlertDescription>
            <CloseButton onClick={clearResult} />
          </Alert>

          {result.created.length > 0 && (
            <Box mb="12px">
              <HStack mb="8px">
                <Icon as={MdCheckCircle} color="green.500" />
                <Text fontSize="sm" fontWeight="600">
                  {result.created.length} product(s) created
                </Text>
              </HStack>
              <Box overflowX="auto" maxH="200px" overflowY="auto" borderRadius="8px" border="1px solid" borderColor={borderColor}>
                <Table size="sm" variant="simple">
                  <Thead position="sticky" top="0" bg={tableBg}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>SKU</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {result.created.map((item, i) => (
                      <Tr key={i}>
                        <Td fontSize="sm">{item.name || item.sku || `Product ${i + 1}`}</Td>
                        <Td fontSize="sm">{item.sku || "--"}</Td>
                        <Td>
                          <Badge colorScheme="green" fontSize="xs">Created</Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          )}

          {result.errors.length > 0 && (
            <Box>
              <HStack mb="8px">
                <Icon as={MdError} color="red.500" />
                <Text fontSize="sm" fontWeight="600">
                  {result.errors.length} error(s)
                </Text>
              </HStack>
              <Box overflowX="auto" maxH="200px" overflowY="auto" borderRadius="8px" border="1px solid" borderColor={borderColor}>
                <Table size="sm" variant="simple">
                  <Thead position="sticky" top="0" bg={tableBg}>
                    <Tr>
                      <Th>Row</Th>
                      <Th>Error</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {result.errors.map((err, i) => (
                      <Tr key={i}>
                        <Td fontSize="sm">{err.row || i + 1}</Td>
                        <Td fontSize="sm" color="red.500">{err.error || err.message || JSON.stringify(err)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </VStack>
  );
}
