import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Box, Pressable, VStack, HStack, Text, Divider } from "native-base";
import React from "react";
import { useAuthenticationContext } from "../../providers/AuthenticationProvider";
import Icon from "react-native-vector-icons/Ionicons";


const getIcon = (screenName) => {
  switch (screenName) {
    case "Inbox":
      return "email";
    case "Outbox":
      return "send";
    case "Favorites":
      return "heart";
    case "Archive":
      return "archive";
    case "Trash":
      return "trash-can";
    case "Spam":
      return "alert-circle";
    default:
      return undefined;
  }
};

export const DrawerContent = ({ ...props }: DrawerContentComponentProps) => {
  const auth = useAuthenticationContext();


  return (
    <DrawerContentScrollView {...props} safeArea={true}>
      <VStack space="6" my="2" mx="1">
        <Box px="4">
          <Text bold color="gray.700">
            Bin Day
          </Text>
          <Text fontSize="14" mt="1" color="gray.500" fontWeight="500">
            {auth?.user?.username}
          </Text>
        </Box>
        <VStack divider={<Divider />} space="4">
          <VStack space="3">
            {props.state.routes.map((route, index) => {
              let name = route.name;
              if(!(route.params as any)?.displayInNav) {
                return null
              }

              return (<Pressable
                px="5"
                py="3"
                rounded="md"
                bg={
                  index === props.state.index
                    ? "rgba(6, 182, 212, 0.1)"
                    : "transparent"
                }
                onPress={(event) => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space="7" alignItems="center">
                  <Icon
                    color={
                      index === props.state.index ? "primary.500" : "gray.500"
                    }
                    size="5"
                    as={<MaterialCommunityIcons name={getIcon(name)} />}
                  />
                  <Text
                    fontWeight="500"
                    color={
                      index === props.state.index ? "primary.500" : "gray.700"
                    }
                  >
                    {name}
                  </Text>
                </HStack>
              </Pressable>)

            })}
          </VStack>
          <VStack space="5">
            <VStack space="3">
              {auth?.isAuthenticated && <Pressable px="5" py="3" onPress={() => auth.logoutUser(false)}>
                <HStack space="7" alignItems="center">
                  <Icon
                    name="log-out-outline"
                    color="darkText"
                    size={25}
                  />
                  <Text fontWeight="500" color="darkText">
                    Logout
                  </Text>
                </HStack>
              </Pressable>}


            </VStack>
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}
