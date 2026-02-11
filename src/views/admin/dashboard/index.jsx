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
  MdPeople,
  MdWarning,
} from "react-icons/md";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import Card from "components/card/Card";
import BarChart from "components/charts/BarChart";
import PieChart from "components/charts/PieChart";
import { getAllProducts } from "api/products";
import { listCategories } from "api/categories";
import { listCustomers } from "api/customers";
import { listQuotes } from "api/quotes";

function formatCompact(num) {
  if (num == null || isNaN(num)) return "0";
  const abs = Math.abs(num);
  if (abs >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

function formatCurrency(num) {
  if (num == null || isNaN(num)) return "GH₵0";
  const abs = Math.abs(num);
  if (abs >= 1e9) return "GH₵" + (num / 1e9).toFixed(2).replace(/\.?0+$/, "") + "B";
  if (abs >= 1e6) return "GH₵" + (num / 1e6).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (abs >= 1e3) return "GH₵" + (num / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return "GH₵" + num.toFixed(2);
}

export default function Dashboard() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const headerBg = useColorModeValue("gray.50", "whiteAlpha.50");
  const rowHover = useColorModeValue("gray.50", "whiteAlpha.50");
  const cardBg = useColorModeValue("white", "navy.800");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, customersRes, quotesRes] =
          await Promise.allSettled([
            getAllProducts(),
            listCategories(),
            listCustomers(),
            listQuotes(),
          ]);

        const products =
          productsRes.status === "fulfilled"
            ? productsRes.value.products || []
            : [];
        const categories =
          categoriesRes.status === "fulfilled"
            ? categoriesRes.value.categories || []
            : [];
        const customers =
          customersRes.status === "fulfilled"
            ? customersRes.value.customers || customersRes.value || []
            : [];
        const quotes =
          quotesRes.status === "fulfilled"
            ? quotesRes.value.quotes || quotesRes.value || []
            : [];

        // Compute product stats
        const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
        const totalValue = products.reduce(
          (sum, p) => sum + (p.price || 0) * (p.stock || 0),
          0
        );
        const lowStockProducts = products
          .filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10)
          .sort((a, b) => (a.stock || 0) - (b.stock || 0))
          .slice(0, 10);
        const outOfStock = products.filter((p) => (p.stock || 0) === 0).length;

        // Products by category
        const categoryIdToName = {};
        categories.forEach((c) => {
          categoryIdToName[c.category_id] = c.name;
        });
        const countByCategory = {};
        products.forEach((p) => {
          const catName =
            categoryIdToName[p.category_id] || "Uncategorized";
          countByCategory[catName] = (countByCategory[catName] || 0) + 1;
        });
        const productsByCategory = Object.entries(countByCategory)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        // Recent products
        const recentProducts = [...products]
          .sort((a, b) => {
            const aDate = a.created_at?._seconds || 0;
            const bDate = b.created_at?._seconds || 0;
            return bDate - aDate;
          })
          .slice(0, 5);

        // Quote stats
        const quotesByStatus = {};
        quotes.forEach((q) => {
          const status = q.status || "pending";
          quotesByStatus[status] = (quotesByStatus[status] || 0) + 1;
        });

        setData({
          products: {
            total: products.length,
            lowStock: lowStockProducts.length,
            outOfStock,
          },
          categories: { total: categories.length },
          customers: { total: customers.length },
          quotes: { total: quotes.length, byStatus: quotesByStatus },
          inventory: { totalStock, totalValue },
          productsByCategory,
          recentProducts,
          lowStockProducts,
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

  if (!data) {
    return (
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Flex justify="center" align="center" minH="400px">
          <Text color={textColorSecondary}>Failed to load dashboard data</Text>
        </Flex>
      </Box>
    );
  }

  // Bar chart — Products by Category
  const categoryNames = (data.productsByCategory || []).map((c) => c.name);
  const categoryCounts = (data.productsByCategory || []).map((c) => c.count);

  const barChartData = [{ name: "Products", data: categoryCounts }];
  const barChartOptions = {
    chart: { toolbar: { show: false } },
    xaxis: {
      categories: categoryNames,
      labels: {
        style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" },
        rotate: -45,
        rotateAlways: categoryNames.length > 5,
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" },
      },
    },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "40%" } },
    colors: ["#258013"],
    dataLabels: { enabled: false },
    grid: { borderColor: "#E2E8F0", strokeDashArray: 4 },
    tooltip: { theme: "dark" },
  };

  // Pie chart — Quotes by Status
  const quoteStatuses = Object.keys(data.quotes?.byStatus || {});
  const quoteCounts = Object.values(data.quotes?.byStatus || {});
  const pieChartData = quoteCounts.length > 0 ? quoteCounts : [1];

  const statusColorLookup = {
    pending: "#4299E1",
    quoted: "#48BB78",
    confirmed: "#9F7AEA",
    cancelled: "#F56565",
    completed: "#38B2AC",
  };
  const pieColors = quoteStatuses.map((s) => statusColorLookup[s] || "#A0AEC0");
  const pieChartOptions = {
    labels:
      quoteStatuses.length > 0
        ? quoteStatuses.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        : ["No quotes"],
    colors: pieColors.length > 0 ? pieColors : ["#E2E8F0"],
    legend: { position: "bottom", labels: { colors: "#A3AED0" } },
    dataLabels: { enabled: true, style: { fontSize: "13px", fontWeight: "600" } },
    stroke: { width: 0 },
    tooltip: { theme: "dark" },
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {/* Row 1: Stat Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }} gap="20px" mb="20px">
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdInventory2} color={brandColor} />}
            />
          }
          name="Total Products"
          value={formatCompact(data.products?.total || 0)}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdShoppingCart} color={brandColor} />}
            />
          }
          name="Total Quotes"
          value={formatCompact(data.quotes?.total || 0)}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
            />
          }
          name="Customers"
          value={formatCompact(data.customers?.total || 0)}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAttachMoney} color="white" />}
            />
          }
          name="Inventory Value"
          value={formatCurrency(data.inventory?.totalValue || 0)}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg="linear-gradient(90deg, #FF6B6B 0%, #EE5A24 100%)"
              icon={<Icon w="28px" h="28px" as={MdWarning} color="white" />}
            />
          }
          name="Low Stock"
          value={formatCompact(data.products?.lowStock || 0)}
        />
        <MiniStatistics
          startContent={
            <IconBox w="56px" h="56px" bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdCategory} color={brandColor} />}
            />
          }
          name="Categories"
          value={formatCompact(data.categories?.total || 0)}
        />
      </SimpleGrid>

      {/* Row 2: Charts */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="20px" mb="20px">
        <Card p="20px" bg={cardBg}>
          <Text fontSize="lg" fontWeight="700" color={textColor} mb="16px">
            Products by Category
          </Text>
          {categoryCounts.length > 0 ? (
            <Box h="300px">
              <BarChart chartData={barChartData} chartOptions={barChartOptions} />
            </Box>
          ) : (
            <Flex direction="column" align="center" py="60px" color="gray.400">
              <Icon as={MdCategory} w="36px" h="36px" mb="8px" />
              <Text fontWeight="500">No product data yet</Text>
            </Flex>
          )}
        </Card>

        <Card p="20px" bg={cardBg}>
          <Text fontSize="lg" fontWeight="700" color={textColor} mb="16px">
            Quotes by Status
          </Text>
          {quoteCounts.length > 0 ? (
            <Box h="300px">
              <PieChart chartData={pieChartData} chartOptions={pieChartOptions} />
            </Box>
          ) : (
            <Flex direction="column" align="center" py="60px" color="gray.400">
              <Icon as={MdShoppingCart} w="36px" h="36px" mb="8px" />
              <Text fontWeight="500">No quotes yet</Text>
            </Flex>
          )}
        </Card>
      </SimpleGrid>

      {/* Row 3: Tables */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap="20px" mb="20px">
        {/* Recent Products */}
        <Card p="20px" bg={cardBg}>
          <Flex justify="space-between" align="center" mb="16px">
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Recent Products
            </Text>
            {data.products?.total > 0 && (
              <Badge colorScheme="brand" borderRadius="full" px="8px" py="2px" fontSize="xs">
                {data.products.total} total
              </Badge>
            )}
          </Flex>
          {(data.recentProducts || []).length === 0 ? (
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
                  {data.recentProducts.map((product, i) => (
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
                        GH₵{(product.price || 0).toFixed(2)}
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

        {/* Low Stock Alerts */}
        <Card p="20px" bg={cardBg}>
          <Flex justify="space-between" align="center" mb="16px">
            <Text fontSize="lg" fontWeight="700" color={textColor}>
              Low Stock Alerts
            </Text>
            {(data.products?.lowStock || 0) > 0 && (
              <Badge colorScheme="red" borderRadius="full" px="8px" py="2px" fontSize="xs">
                {data.products.lowStock} items
              </Badge>
            )}
          </Flex>
          {(data.lowStockProducts || []).length === 0 ? (
            <Flex direction="column" align="center" py="40px" color="gray.400">
              <Icon as={MdWarning} w="36px" h="36px" mb="8px" />
              <Text fontWeight="500">All stocked up!</Text>
              <Text fontSize="sm">No products below threshold</Text>
            </Flex>
          ) : (
            <Box overflowX="auto" borderRadius="12px" border="1px solid" borderColor={borderColor}>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr bg={headerBg}>
                    <Th borderColor={borderColor} fontSize="xs">Product</Th>
                    <Th borderColor={borderColor} fontSize="xs">SKU</Th>
                    <Th borderColor={borderColor} fontSize="xs" isNumeric>Stock</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.lowStockProducts.map((product, i) => (
                    <Tr key={product.sku || i} _hover={{ bg: rowHover }}>
                      <Td borderColor={borderColor} color={textColor} fontWeight="500" fontSize="sm">
                        {product.name}
                      </Td>
                      <Td borderColor={borderColor}>
                        <Badge colorScheme="gray" fontSize="xs" fontFamily="mono" borderRadius="6px">
                          {product.sku}
                        </Badge>
                      </Td>
                      <Td borderColor={borderColor} isNumeric>
                        <Badge
                          colorScheme={(product.stock || 0) <= 3 ? "red" : "orange"}
                          fontSize="xs"
                          borderRadius="6px"
                        >
                          {product.stock}
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
