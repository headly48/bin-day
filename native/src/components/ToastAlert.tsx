import { VStack, HStack, IconButton, CloseIcon, Text, Alert, IAlertProps, useToast } from "native-base";
import React from "react";

export const ToastAlert = ({
    id,
    status,
    variant,
    title,
    description,
    isClosable,
    toast,
    ...rest
}: { id?: string, title: string, description?: string, isClosable: boolean, toast: ReturnType<typeof useToast> } & IAlertProps) => <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={status ? status : "info"} variant={variant} {...rest}>
        <VStack space={1} flexShrink={1} w="100%">
            <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                <HStack space={2} flexShrink={1} alignItems="center">
                    <Alert.Icon />
                    <Text fontSize="md" fontWeight="medium" flexShrink={1} color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                        {title}
                    </Text>
                </HStack>
                {isClosable ? <IconButton variant="unstyled" icon={<CloseIcon size="3" />} _icon={{
                    color: variant === "solid" ? "lightText" : "darkText"
                }} onPress={() => toast.close(id)} /> : null}
            </HStack>
            {description && (<Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                {description}
            </Text>)}
        </VStack>
    </Alert>;