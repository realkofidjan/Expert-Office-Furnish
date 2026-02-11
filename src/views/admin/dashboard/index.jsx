import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Text,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import {
  MdInventory2,
  MdShoppingCart,
  MdCategory,
  MdAttachMoney,
} from "react-icons/md";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Card from "components/card/Card";
import { getAllProducts } from "api/products";
import { listCategories } from "api/categories";

function formatCompact(num) {
  if (num == null || isNaN(num)) return "0";
  const abs = Math.abs(num);
  if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

function formatCurrency(num) {
  if (num == null || isNaN(num)) return "$0";
  const abs = Math.abs(num);
  if (abs >= 1e9) return "$" + (num / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (abs >= 1e6) return "$" + (num / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (abs >= 1e3) return "$" + (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return "$" + num.toFixed(2);
}

export default function Dashboard() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const rowHover = useColorModeValue("gray.50", "whiteAlpha.50");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    products: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.allSettled([
          getAllProducts(),
          listCategories(),
        ]);
        const products =
          productsRes.status === "fulfilled"
            ? productsRes.value.products || []
            : [];
        const categories =
          categoriesRes.status === "fulfilled"
            ? categoriesRes.value.categories || []
            : [];

        const totalValue = products.reduce(
          (sum, p) => sum + (p.price || 0) * (p.stock || 0),
          0
        );

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          products: products.slice(0, 5),
          categories: categories.slice(0, 5),
          totalValue,
          totalStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="brand.500" thickness="3px" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap="20px" mb="20px">
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdInventory2} color={brandColor} />
              }
            />
          }
          name="Total Products"
          value={formatCompact(stats.totalProducts)}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdCategory} color={brandColor} />
              }
            />
          }
          name="Categories"
          value={formatCompact(stats.totalCategories)}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdShoppingCart} color={brandColor} />
              }
            />
          }
          name="Total Stock"
          value={formatCompact(stats.totalStock || 0)}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={
                <Icon w="28px" h="28px" as={MdAttachMoney} color="white" />
              }
            />
          }
          name="Inventory Value"
          value={formatCurrency(stats.totalValue || 0)}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="20px" mb="20px">
        <Card p="20px">
          <Flex justify="space-between" align="center" mb="16px">
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Recent Products
            </Text>
            {stats.products.length > 0 && (
              <Badge colorScheme="brand" borderRadius="full" px="8px" py="2px" fontSize="xs">
                Top {stats.products.length}
              </Badge>
            )}
          </Flex>
          {stats.products.length === 0 ? (
            <Flex direction="column" align="center" py="40px" color="gray.400">
              <Icon as={MdInventory2} w="36px" h="36px" mb="8px" />
              <Text fontWeight="500">No products yet</Text>
              <Text fontSize="sm">Add products to see them here</Text>
            </Flex>
          ) : (
            <Box overflowX="auto" borderRadius="12px" border="1px solid" borderColor={borderColor}>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr bg={headerBg}>
                    <Th borderColor={borderColor} fontSize="xs">Name</Th>
                    <Th borderColor={borderColor} fontSize="xs">SKU</Th>
                    <Th borderColor={borderColor} fontSize="xs" isNumeric>Price</Th>
                    <Th borderColor={borderColor} fontSize="xs" isNumeric>Stock</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.products.map((product, i) => (
                    <Tr key={product.id || i} _hover={{ bg: rowHover }}>
                      <Td borderColor={borderColor} color={textColor} fontWeight="500" fontSize="sm">
                        {product.name}
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme="gray" fontSize="xs" fontFamily="mono" borderRadius="6px">
                          {product.sku}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor} isNumeric color={textColor} fontWeight="600" fontSize="sm">
                        ${product.price?.toFixed(2)}
                      </Td>
                      <Td borderColor={borderColor} isNumeric>
                        <Badge
                          colorScheme={(product.stock ?? 0) === 0 ? "red" : (product.stock ?? 0) < 10 ? "orange" : "green"}
                          fontSize="xs"
                          borderRadius="6px"
                        >
                          {product.stock ?? 0}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Card>

        <Card p="20px">
          <Flex justify="space-between" align="center" mb="16px">
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Categories
            </Text>
            {stats.categories.length > 0 && (
              <Badge colorScheme="brand" borderRadius="full" px="8px" py="2px" fontSize="xs">
                {stats.categories.length} total
              </Badge>
            )}
          </Flex>
          {stats.categories.length === 0 ? (
            <Flex direction="column" align="center" py="40px" color="gray.400">
              <Icon as={MdCategory} w="36px" h="36px" mb="8px" />
              <Text fontWeight="500">No categories yet</Text>
              <Text fontSize="sm">Create categories to organize products</Text>
            </Flex>
          ) : (
            <Box overflowX="auto" borderRadius="12px" border="1px solid" borderColor={borderColor}>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr bg={headerBg}>
                    <Th borderColor={borderColor} fontSize="xs">Name</Th>
                    <Th borderColor={borderColor} fontSize="xs">Description</Th>
                    <Th borderColor={borderColor} fontSize="xs" isNumeric>Subcategories</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stats.categories.map((cat, i) => (
                    <Tr key={cat.category_id || i} _hover={{ bg: rowHover }}>
                      <Td borderColor={borderColor} color={textColor} fontWeight="500" fontSize="sm">
                        {cat.name}
                      </Td>
                      <Td borderColor={borderColor} color={textColorSecondary} maxW="200px" isTruncated fontSize="sm">
                        {cat.description || "--"}
                      </Td>
                      <Td borderColor={borderColor} isNumeric>
                        <Badge colorScheme="blue" fontSize="xs" borderRadius="6px">
                          {cat.subcategories?.length || 0}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </Card>
      </SimpleGrid>
    </Box>
  );
}
