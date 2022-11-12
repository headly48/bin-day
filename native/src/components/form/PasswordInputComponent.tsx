import { FormControl, IInputProps, Input, Pressable, WarningOutlineIcon } from "native-base";
import React, { useMemo, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

export const PasswordInputComponent: React.FC<{
    displayError: boolean,
    handleInputValidity: (isValid: boolean) => void
} & IInputProps> = ({
    onChangeText,
    handleInputValidity,
    displayError,
    ...props
}) => {
        const [inputText, setInputText] = useState<string>();
        const [showPassword, setShowPassword] = React.useState<boolean>(false);

        const isInputInvalid = useMemo(() => {

            handleInputValidity(!!inputText)
            return (displayError && !inputText)
        }, [displayError, inputText])

        const handleOnChangeText = (text: string) => {
            setInputText(text);

            onChangeText && onChangeText(text)
        }

        return <FormControl isInvalid={isInputInvalid}>
            <Input variant="underlined" size="md" type={showPassword ? "text" : "password"} w="100%" py="0" borderBottomColor={isInputInvalid ? "error.600" : "darkText"} placeholderTextColor={"darkText"} onChangeText={handleOnChangeText}
                placeholder="Password"
                InputRightElement={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                        {!showPassword ? <Icon name="eye-outline" size={24} color="darkText" /> : <Icon name="eye-off-outline" size={24} color={"darkText"} />}
                    </Pressable>} />

            {isInputInvalid && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Password is required
            </FormControl.ErrorMessage>}
        </FormControl>;
    };