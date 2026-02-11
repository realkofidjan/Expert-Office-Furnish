import React from "react";
import { Button, Flex, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }) {
  const textColor = useColorModeValue("secondaryGray.600", "gray.400");
  const activeBg = useColorModeValue("brand.500", "brand.400");

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  // Build page numbers to show
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <Flex justify="space-between" align="center" mt="16px" flexWrap="wrap" gap="10px">
      <Text fontSize="sm" color={textColor}>
        Showing {start}-{end} of {totalItems}
      </Text>
      <Flex align="center" gap="4px">
        <Button
          size="sm"
          variant="ghost"
          borderRadius="8px"
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          minW="32px"
          p="0"
        >
          <Icon as={MdChevronLeft} w="20px" h="20px" />
        </Button>
        {startPage > 1 && (
          <>
            <Button
              size="sm"
              variant="ghost"
              borderRadius="8px"
              onClick={() => onPageChange(1)}
              minW="32px"
              fontSize="sm"
            >
              1
            </Button>
            {startPage > 2 && (
              <Text fontSize="sm" color={textColor} px="4px">...</Text>
            )}
          </>
        )}
        {pages.map((page) => (
          <Button
            key={page}
            size="sm"
            borderRadius="8px"
            minW="32px"
            fontSize="sm"
            bg={page === currentPage ? activeBg : "transparent"}
            color={page === currentPage ? "white" : textColor}
            _hover={{ bg: page === currentPage ? activeBg : "gray.100" }}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <Text fontSize="sm" color={textColor} px="4px">...</Text>
            )}
            <Button
              size="sm"
              variant="ghost"
              borderRadius="8px"
              onClick={() => onPageChange(totalPages)}
              minW="32px"
              fontSize="sm"
            >
              {totalPages}
            </Button>
          </>
        )}
        <Button
          size="sm"
          variant="ghost"
          borderRadius="8px"
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          minW="32px"
          p="0"
        >
          <Icon as={MdChevronRight} w="20px" h="20px" />
        </Button>
      </Flex>
    </Flex>
  );
}
