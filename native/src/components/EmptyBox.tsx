import { Button, Box, Center, VStack, Heading, Icon, Image } from "native-base"
import React, { FC, ReactNode } from "react"

export const EmptyBox = (props: {children: any, heading: string}) => {

    return (<Box bgColor={"white"} shadow="5" borderRadius={"md"} width="2/3" p="6" minWidth={"400"}>
        <Box borderStyle={"dashed"} borderColor={"#cbd5e1"} borderWidth={"3"} borderRadius={"md"} padding="4" width={"100%"} >
            <Center>

                <VStack space={"6"} alignItems="center">
                    <Image source={require('../assets/location-pin-pngrepo-com.png')} width="32" height="32" />

                    <Heading size={"md"} color="darkText">{props.heading}</Heading>

                    {props.children}
                </VStack>
            </Center>
        </Box>
    </Box>)
}