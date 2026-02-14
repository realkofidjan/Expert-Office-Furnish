import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Text,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  MdInventory2,
  MdCategory,
  MdShoppingCart,
  MdPeople,
  MdRequestQuote,
  MdHistory,
  MdNotifications,
  MdDashboard,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSearch } from "contexts/SearchContext";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: MdDashboard, keywords: ["dashboard", "home", "overview", "stats"] },
  { name: "Products", path: "/products", icon: MdInventory2, keywords: ["products", "inventory", "items", "stock", "sku"] },
  { name: "Categories", path: "/categories", icon: MdCategory, keywords: ["categories", "subcategories", "organize"] },
  { name: "Orders", path: "/orders", icon: MdShoppingCart, keywords: ["orders", "checkout", "delivery", "payment"] },
  { name: "Quotes", path: "/quotes", icon: MdRequestQuote, keywords: ["quotes", "requests", "pricing"] },
  { name: "Notifications", path: "/notifications", icon: MdNotifications, keywords: ["notifications", "alerts", "messages"] },
  { name: "Customers", path: "/customers", icon: MdPeople, keywords: ["customers", "users", "clients"] },
  { name: "Logs", path: "/logs", icon: MdHistory, keywords: ["logs", "activity", "audit", "history"] },
];

export function SearchBar(props) {
  const { variant, background, children, placeholder, borderRadius, ...rest } = props;

  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");
  const dropdownBg = useColorModeValue("white", "navy.800");
  const hoverBg = useColorModeValue("gray.50", "whiteAlpha.100");
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textSecondary = useColorModeValue("gray.500", "gray.400");
  const shadow = useColorModeValue(
    "0px 4px 20px rgba(112, 144, 176, 0.18)",
    "0px 4px 20px rgba(0, 0, 0, 0.3)"
  );

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const { setSearchQuery } = useSearch();

  const filtered = query.trim()
    ? navItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        );
      })
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item) {
    navigate(item.path);
    setQuery("");
    setSearchQuery("");
    setShowDropdown(false);
  }

  function handleKeyDown(e) {
    if (!showDropdown || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  return (
    <Box ref={wrapperRef} position="relative" {...rest}>
      <InputGroup w={{ base: "100%", md: "200px" }}>
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{ boxShadow: "none" }}
              icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
            />
          }
        />
        <Input
          variant="search"
          fontSize="sm"
          bg={background ? background : inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={borderRadius ? borderRadius : "30px"}
          placeholder={placeholder ? placeholder : "Search..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => query.trim() && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
      </InputGroup>

      {showDropdown && filtered.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left="0"
          right="0"
          mt="8px"
          bg={dropdownBg}
          borderRadius="16px"
          boxShadow={shadow}
          zIndex="dropdown"
          overflow="hidden"
          py="6px"
          minW="240px"
        >
          {filtered.map((item, i) => (
            <Flex
              key={item.path}
              align="center"
              gap="12px"
              px="16px"
              py="10px"
              cursor="pointer"
              bg={i === selectedIndex ? hoverBg : "transparent"}
              _hover={{ bg: hoverBg }}
              onClick={() => handleSelect(item)}
            >
              <Icon as={item.icon} w="18px" h="18px" color="brand.500" />
              <Box>
                <Text fontSize="sm" fontWeight="500" color={textColor}>
                  {item.name}
                </Text>
                <Text fontSize="xs" color={textSecondary}>
                  Go to {item.name.toLowerCase()}
                </Text>
              </Box>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}
