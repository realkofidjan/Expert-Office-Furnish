import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { IoMenuOutline } from 'react-icons/io5';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const changeNavbar = () => {
      setScrolled(window.scrollY > 1);
    };
    window.addEventListener('scroll', changeNavbar);
    return () => {
      window.removeEventListener('scroll', changeNavbar);
    };
  }, []);

  const {
    secondary,
    message,
    brandText,
    onOpen,
    onToggleDesktopSidebar,
    sidebarExpanded,
    sidebarW,
  } = props;

  let mainText = useColorModeValue('navy.700', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
  let menuColor = useColorModeValue('gray.600', 'white');

  return (
    <Box
      position="fixed"
      boxShadow="none"
      bg={navbarBg}
      borderColor="transparent"
      filter="none"
      backdropFilter="blur(20px)"
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration="0.25s, 0.25s, 0.25s, 0s"
      transitionProperty="box-shadow, background-color, filter, border, left, width"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="75px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      pb="8px"
      left={{
        base: '12px',
        md: `${(sidebarW || 0) + 12}px`,
      }}
      right={{ base: '12px', md: '20px' }}
      px={{ base: '12px', md: '16px' }}
      pt="8px"
      top={{ base: '12px', md: '16px', xl: '20px' }}
      w="auto"
      zIndex="1300"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Flex
        w="100%"
        flexDirection={{ base: 'column', md: 'row' }}
        alignItems={{ xl: 'center' }}
      >
        <Flex align="center" mb={{ base: '8px', md: '0px' }}>
          {/* Desktop: toggle expand/collapse */}
          <IconButton
            icon={
              <Icon
                as={sidebarExpanded ? MdChevronLeft : MdChevronRight}
                w="22px"
                h="22px"
              />
            }
            variant="ghost"
            color={menuColor}
            size="sm"
            borderRadius="10px"
            mr="12px"
            display={{ base: 'none', md: 'flex' }}
            onClick={onToggleDesktopSidebar}
            aria-label="Toggle sidebar"
            _hover={{ bg: 'gray.100', _dark: { bg: 'whiteAlpha.100' } }}
          />
          {/* Mobile hamburger */}
          <IconButton
            icon={<Icon as={IoMenuOutline} w="22px" h="22px" />}
            variant="ghost"
            color={menuColor}
            size="sm"
            borderRadius="10px"
            mr="12px"
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            aria-label="Open menu"
            _hover={{ bg: 'gray.100', _dark: { bg: 'whiteAlpha.100' } }}
          />
          <Box>
            <Breadcrumb>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                <BreadcrumbLink href="#" color={secondaryText}>
                  Pages
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
                <BreadcrumbLink href="#" color={secondaryText}>
                  {brandText}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Link
              color={mainText}
              href="#"
              bg="inherit"
              borderRadius="inherit"
              fontWeight="bold"
              fontSize={{ base: '24px', md: '28px', lg: '34px' }}
              _hover={{ color: mainText }}
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{ boxShadow: 'none' }}
            >
              {brandText}
            </Link>
          </Box>
        </Flex>
        <Box ms="auto" w={{ base: '100%', md: 'unset' }}>
          <AdminNavbarLinks
            onOpen={onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
      {secondary ? <Text color="white">{message}</Text> : null}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
  onToggleDesktopSidebar: PropTypes.func,
  sidebarExpanded: PropTypes.bool,
  sidebarW: PropTypes.number,
};
