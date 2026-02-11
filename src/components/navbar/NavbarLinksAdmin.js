import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import PropTypes from 'prop-types';
import React from 'react';
import { MdNotificationsNone, MdCheckCircle, MdError, MdInfo, MdDeleteSweep, MdOpenInNew } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { useAuth } from 'contexts/AuthContext';
import { useNotifications } from 'contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const typeConfig = {
  success: { icon: MdCheckCircle, color: 'green.500' },
  error: { icon: MdError, color: 'red.500' },
  info: { icon: MdInfo, color: 'blue.500' },
  warning: { icon: MdError, color: 'orange.500' },
};

export default function HeaderLinks(props) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const navigate = useNavigate();
  const toast = useToast();

  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    navigate('/auth/sign-in');
  };

  const displayName = user?.email || 'Admin';
  const initials = user?.email ? user.email.charAt(0).toUpperCase() : 'A';

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      />

      <Button
        as="a"
        href="https://expertofficefurnish.com"
        target="_blank"
        rel="noopener noreferrer"
        variant="ghost"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        me="10px"
        title="Visit main site"
      >
        <Icon
          h="18px"
          w="18px"
          color={navbarIcon}
          as={MdOpenInNew}
        />
      </Button>

      {/* Notification Bell */}
      <Menu>
        <MenuButton p="0px" position="relative">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-2px"
              right="4px"
              colorScheme="red"
              borderRadius="full"
              fontSize="9px"
              minW="16px"
              h="16px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              lineHeight="1"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: '30px', md: 'unset' }}
          minW={{ base: 'unset', md: '400px', xl: '450px' }}
          maxW={{ base: '360px', md: 'unset' }}
          maxH="480px"
          overflowY="auto"
        >
          {/* Header */}
          <Flex
            w="100%"
            px="20px"
            pt="16px"
            pb="12px"
            justify="space-between"
            align="center"
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <Flex align="center" gap="8px">
              <Text fontSize="md" fontWeight="600" color={textColor}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Badge colorScheme="brand" borderRadius="full" fontSize="xs">
                  {unreadCount} new
                </Badge>
              )}
            </Flex>
            <Flex gap="4px">
              {unreadCount > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  color="brand.500"
                  onClick={markAllAsRead}
                  fontSize="xs"
                >
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  color="gray.400"
                  onClick={clearAll}
                  fontSize="xs"
                  leftIcon={<Icon as={MdDeleteSweep} w="14px" h="14px" />}
                >
                  Clear
                </Button>
              )}
            </Flex>
          </Flex>

          {/* Notification Items */}
          {notifications.length === 0 ? (
            <Flex flexDirection="column" py="32px" align="center">
              <Icon as={MdNotificationsNone} w="32px" h="32px" color="gray.300" mb="8px" />
              <Text fontSize="sm" color="gray.400">
                No notifications yet
              </Text>
            </Flex>
          ) : (
            <Box py="8px">
              {notifications.map((n) => {
                const cfg = typeConfig[n.type] || typeConfig.info;
                return (
                  <MenuItem
                    key={n.id}
                    px="20px"
                    py="10px"
                    _hover={{ bg: hoverBg }}
                    _focus={{ bg: hoverBg }}
                    borderRadius="0"
                    onClick={() => markAsRead(n.id)}
                  >
                    <Flex align="flex-start" gap="12px" w="100%">
                      <Icon as={cfg.icon} color={cfg.color} w="18px" h="18px" mt="2px" flexShrink={0} />
                      <Box flex="1" minW="0">
                        <Text
                          fontSize="sm"
                          fontWeight={n.read ? 'normal' : '600'}
                          color={textColor}
                          noOfLines={1}
                        >
                          {n.title}
                        </Text>
                        {n.description && (
                          <Text fontSize="xs" color={textColorSecondary} noOfLines={2} mt="2px">
                            {n.description}
                          </Text>
                        )}
                        <Text fontSize="xs" color="gray.400" mt="4px">
                          {timeAgo(n.timestamp)}
                        </Text>
                      </Box>
                      {!n.read && (
                        <Box w="8px" h="8px" borderRadius="full" bg="brand.500" mt="6px" flexShrink={0} />
                      )}
                    </Flex>
                  </MenuItem>
                );
              })}
            </Box>
          )}
        </MenuList>
      </Menu>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
        onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: 'pointer' }}
            color="white"
            name={initials}
            bg="brand.500"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              {displayName}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            {user?.role && (
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                borderRadius="8px"
                px="14px"
                cursor="default"
              >
                <Text fontSize="sm" color="gray.500">
                  Role: {user.role}
                </Text>
              </MenuItem>
            )}
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={handleLogout}
            >
              <Text fontSize="sm">Log out</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
