import { FormControl, IInputProps, Input, WarningOutlineIcon } from "native-base";
import React, { useMemo, useState } from "react";

export const NameInputComponent: React.FC<{
    displayError: boolean,
    handleInputValidity: (isValid: boolean) => void
    requiredErrorMessage?: string
} & IInputProps> = ({
    onChangeText,
    handleInputValidity,
    displayError,
    requiredErrorMessage = 'Name is required',
    ...props
}) => {
        const [inputText, setInputText] = useState<string>();

        const isInputInvalid = useMemo(() => {

            handleInputValidity(!!inputText)
            return (displayError && !inputText)
        }, [displayError, inputText])

        const handleOnChangeText = (text: string) => {
            setInputText(text);

            onChangeText && onChangeText(text)
        }

        return <FormControl isInvalid={isInputInvalid}>
            <Input variant="underlined" type="text" size="md" w="100%" py="0" borderBottomColor={isInputInvalid ? "error.600" : "darkText"} placeholderTextColor={"darkText"} onChangeText={handleOnChangeText}
                placeholder="Name" {...props} />

            {isInputInvalid && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                {requiredErrorMessage}
            </FormControl.ErrorMessage>}
        </FormControl>;
    };