import React, { useState, useCallback } from "react";
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
import { MdCloudUpload, MdDownload, MdCheckCircle, MdError, MdWarning, MdPlayArrow, MdArrowBack } from "react-icons/md";
import { batchProductUpload, validateBatchUpload } from "api/products";
import { useNotifications } from "contexts/NotificationContext";
import * as XLSX from "xlsx";

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
  const errorBg = useColorModeValue("red.50", "rgba(254,178,178,0.1)");
  const warningBg = useColorModeValue("orange.50", "rgba(251,211,141,0.1)");
  const validBg = useColorModeValue("green.50", "rgba(154,230,180,0.08)");
  // eslint-disable-next-line
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const toast = useToast();
  const { addNotification } = useNotifications();

  // "upload" = file select view, "preview" = row cards view, "result" = after upload
  const [view, setView] = useState("upload");
  const [file, setFile] = useState(null);
  const [fileRows, setFileRows] = useState([]);
  const [fileHeaders, setFileHeaders] = useState([]);
  const [validating, setValidating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validation, setValidation] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const parseFile = useCallback((f) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        if (json.length > 0) {
          setFileHeaders(Object.keys(json[0]));
          setFileRows(json);
        } else {
          setFileHeaders([]);
          setFileRows([]);
        }
      } catch {
        setFileHeaders([]);
        setFileRows([]);
        toast({ title: "Could not parse file", status: "error", duration: 3000 });
      }
    };
    reader.readAsArrayBuffer(f);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const f = acceptedFiles[0];
        setFile(f);
        setValidation(null);
        setUploadResult(null);
        setView("upload");
        parseFile(f);
      }
    },
  });

  const handleShowPreview = () => {
    if (!file || fileRows.length === 0) return;
    setValidation(null);
    setView("preview");
  };

  const handleBack = () => {
    setValidation(null);
    setView("upload");
  };

  const handleValidate = async () => {
    if (!file) return;
    setValidating(true);
    setValidation(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await validateBatchUpload(formData);
      setValidation(data);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      toast({
        title: "Validation failed",
        description: errMsg,
        status: "error",
        duration: 4000,
      });
    } finally {
      setValidating(false);
    }
  };

  const validationRows = validation?.rows || [];
  const allValid = validation && validation.invalid_rows === 0 && validationRows.length > 0;

  const validationMap = {};
  validationRows.forEach((r) => { validationMap[r.row] = r; });

  const handleUpload = async () => {
    if (!file || !allValid) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const data = await batchProductUpload(formData);
      const created = data.created || [];
      const errors = data.errors || [];
      setUploadResult({
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
      setView("result");
      if (onSuccess) onSuccess();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      toast({
        title: "Upload failed",
        description: errMsg,
        status: "error",
        duration: 4000,
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

  const clearAll = () => {
    setFile(null);
    setFileRows([]);
    setFileHeaders([]);
    setValidation(null);
    setUploadResult(null);
    setView("upload");
  };

  // ── RESULT VIEW ──
  if (view === "result" && uploadResult) {
    return (
      <VStack spacing="16px" align="stretch">
        <Alert
          status={uploadResult.success ? "success" : "error"}
          borderRadius="12px"
        >
          <AlertIcon />
          <AlertDescription flex="1">{uploadResult.message}</AlertDescription>
          <CloseButton onClick={clearAll} />
        </Alert>

        {uploadResult.created.length > 0 && (
          <Box>
            <HStack mb="8px">
              <Icon as={MdCheckCircle} color="green.500" />
              <Text fontSize="sm" fontWeight="600">
                {uploadResult.created.length} product(s) created
              </Text>
            </HStack>
            <Box overflowX="auto" maxH="300px" overflowY="auto" borderRadius="8px" border="1px solid" borderColor={borderColor}>
              <Table size="sm" variant="simple">
                <Thead position="sticky" top="0" bg={tableBg}>
                  <Tr>
                    <Th>Name</Th>
                    <Th>SKU</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {uploadResult.created.map((item, i) => (
                    <Tr key={i}>
                      <Td fontSize="sm">{item.name || item.sku || `Product ${i + 1}`}</Td>
                      <Td fontSize="sm">{item.sku || "--"}</Td>
                      <Td><Badge colorScheme="green" fontSize="xs">Created</Badge></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        )}

        {uploadResult.errors.length > 0 && (
          <Box>
            <HStack mb="8px">
              <Icon as={MdError} color="red.500" />
              <Text fontSize="sm" fontWeight="600">
                {uploadResult.errors.length} error(s)
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
                  {uploadResult.errors.map((err, i) => (
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

        <Flex justify="flex-end">
          <Button variant="brand" size="sm" onClick={clearAll} borderRadius="10px">
            Upload Another
          </Button>
        </Flex>
      </VStack>
    );
  }

  // ── PREVIEW VIEW ──
  if (view === "preview") {
    return (
      <VStack spacing="16px" align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap="10px">
          <HStack spacing="10px">
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Icon as={MdArrowBack} />}
              onClick={handleBack}
              borderRadius="10px"
            >
              Back
            </Button>
            <Box>
              <Text fontSize="md" fontWeight="600">
                Upload Preview
              </Text>
              <Text fontSize="xs" color="gray.500">
                {file?.name} &middot; {fileRows.length} row{fileRows.length !== 1 ? "s" : ""}
              </Text>
            </Box>
          </HStack>
          {!validation && !validating && (
            <Button
              colorScheme="blue"
              size="sm"
              borderRadius="10px"
              leftIcon={<Icon as={MdPlayArrow} />}
              onClick={handleValidate}
            >
              Validate
            </Button>
          )}
          {validation && (
            <Button
              size="sm"
              variant="outline"
              borderRadius="10px"
              onClick={handleValidate}
              isLoading={validating}
            >
              Re-validate
            </Button>
          )}
        </Flex>

        {validating && (
          <Progress size="sm" isIndeterminate colorScheme="brand" borderRadius="full" />
        )}

        {/* Validation Summary */}
        {validation && (
          <Flex gap="8px" flexWrap="wrap" align="center">
            <HStack
              bg={allValid ? "green.50" : "red.50"}
              _dark={{ bg: allValid ? "rgba(154,230,180,0.1)" : "rgba(254,178,178,0.1)" }}
              px="12px"
              py="8px"
              borderRadius="8px"
              spacing="6px"
              flex="1"
            >
              <Icon
                as={allValid ? MdCheckCircle : MdError}
                color={allValid ? "green.500" : "red.500"}
                w="18px"
                h="18px"
              />
              <Text fontSize="sm" fontWeight="600">
                {allValid
                  ? `All ${validation.total_rows} rows passed validation`
                  : `${validation.invalid_rows} of ${validation.total_rows} rows have errors`}
              </Text>
            </HStack>
            <HStack spacing="6px">
              <Badge colorScheme="green" fontSize="xs" px="8px" py="2px" borderRadius="full">
                {validation.valid_rows} valid
              </Badge>
              {validation.invalid_rows > 0 && (
                <Badge colorScheme="red" fontSize="xs" px="8px" py="2px" borderRadius="full">
                  {validation.invalid_rows} invalid
                </Badge>
              )}
            </HStack>
          </Flex>
        )}

        {/* File Contents Table */}
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
                <Th fontSize="xs" textTransform="uppercase" whiteSpace="nowrap" py="10px" w="40px">#</Th>
                {validation && (
                  <Th fontSize="xs" textTransform="uppercase" whiteSpace="nowrap" py="10px" w="70px">Status</Th>
                )}
                {fileHeaders.map((h) => (
                  <Th key={h} fontSize="xs" textTransform="uppercase" whiteSpace="nowrap" py="10px">
                    {h}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {fileRows.map((row, i) => {
                const rowNum = i + 2;
                const vRow = validationMap[rowNum];
                const hasErrors = vRow?.status === "invalid";
                const hasWarnings = vRow?.warnings?.length > 0 && !hasErrors;
                const isValidated = !!validation;
                const messages = [
                  ...(vRow?.errors || []).map((e) => ({ type: "error", text: e })),
                  ...(vRow?.warnings || []).map((w) => ({ type: "warning", text: w })),
                ];

                let rowBg = undefined;
                if (isValidated && vRow) {
                  if (hasErrors) rowBg = errorBg;
                  else if (hasWarnings) rowBg = warningBg;
                  else rowBg = validBg;
                }

                const colCount = fileHeaders.length + 1 + (isValidated ? 1 : 0);

                return (
                  <React.Fragment key={i}>
                    <Tr bg={rowBg}>
                      <Td fontSize="xs" fontWeight="500" color="gray.500" whiteSpace="nowrap">{rowNum}</Td>
                      {isValidated && (
                        <Td>
                          {hasErrors ? (
                            <Icon as={MdError} color="red.500" w="15px" h="15px" />
                          ) : hasWarnings ? (
                            <Icon as={MdWarning} color="orange.500" w="15px" h="15px" />
                          ) : vRow ? (
                            <Icon as={MdCheckCircle} color="green.500" w="15px" h="15px" />
                          ) : null}
                        </Td>
                      )}
                      {fileHeaders.map((h) => (
                        <Td
                          key={h}
                          fontSize="xs"
                          color="gray.500"
                          whiteSpace="nowrap"
                          maxW="200px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {row[h] !== undefined && row[h] !== "" ? String(row[h]) : "--"}
                        </Td>
                      ))}
                    </Tr>
                    {isValidated && messages.length > 0 && (
                      <Tr bg={rowBg}>
                        <Td colSpan={colCount} py="4px" px="12px" borderTop="none">
                          <HStack spacing="12px" flexWrap="wrap">
                            {messages.map((m, j) => (
                              <HStack key={j} spacing="4px">
                                <Icon
                                  as={m.type === "error" ? MdError : MdWarning}
                                  color={m.type === "error" ? "red.500" : "orange.500"}
                                  w="12px"
                                  h="12px"
                                  flexShrink={0}
                                />
                                <Text fontSize="xs" color={m.type === "error" ? "red.600" : "orange.600"}>
                                  {m.text}
                                </Text>
                              </HStack>
                            ))}
                          </HStack>
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                );
              })}
            </Tbody>
          </Table>
        </Box>

        {/* Bottom action bar */}
        {uploading && (
          <Progress size="sm" isIndeterminate colorScheme="brand" borderRadius="full" />
        )}
        <Flex justify="flex-end" gap="10px" pt="4px">
          <Button variant="ghost" size="sm" onClick={handleBack} borderRadius="10px">
            Cancel
          </Button>
          <Button
            colorScheme="brand"
            size="sm"
            onClick={handleUpload}
            isLoading={uploading}
            isDisabled={!allValid}
            borderRadius="10px"
            leftIcon={<Icon as={MdCloudUpload} />}
          >
            {!validation
              ? "Validate First"
              : allValid
              ? "Finish Upload"
              : "Fix Errors to Upload"}
          </Button>
        </Flex>
      </VStack>
    );
  }

  // ── DEFAULT UPLOAD VIEW ──
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
              {(file.size / 1024).toFixed(1)} KB &middot; {fileRows.length} row{fileRows.length !== 1 ? "s" : ""} found
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

      {file && (
        <Flex justify="flex-end" gap="10px">
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear
          </Button>
          <Button
            variant="brand"
            size="sm"
            leftIcon={<Icon as={MdCloudUpload} />}
            onClick={handleShowPreview}
            isDisabled={fileRows.length === 0}
          >
            Upload Products
          </Button>
        </Flex>
      )}
    </VStack>
  );
}
