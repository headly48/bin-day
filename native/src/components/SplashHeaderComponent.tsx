import { Box, Center, Stack, Heading } from "native-base"
import React from "react"
import RubbishBinSVG from "./assets/RubbishBinIcon"


export const SplashHeaderComponent: React.FC<{
    pageName: string,
    leftAction?: React.ReactNode
}
> = ({
    pageName,
    leftAction
}) => {

        return <Box marginBottom={20} marginTop={6}>
            {leftAction}
            <Center>
                <Stack space={12}>
                    <Stack space={8}>
                        <Center>
                            <Heading size={"3xl"} lineHeight={leftAction ? 0 : undefined}>Bin Day</Heading>

                        </Center>
                        <RubbishBinSVG height={"250"}></RubbishBinSVG>
                    </Stack>

                    <Center>
                        <Heading size={"2xl"}>{pageName}</Heading>
                    </Center>
                </Stack>
            </Center>
        </Box>
    }