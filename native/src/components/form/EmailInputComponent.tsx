import { FormControl, Input, WarningOutlineIcon, IInputProps } from "native-base"
import React, { useMemo, useState } from "react"
import isEmail from 'validator/es/lib/isEmail';


export const EmailInputComponent: React.FC<{
    displayError: boolean,
    handleInputValidity: (isValid: boolean) => void
} & IInputProps> = ({
    onChangeText,
    handleInputValidity,
    displayError,
    ...props
}) => {
        const [inputText, setInputText] = useState<string>();
        const [isValidEmailFormat, setIsValidEmailFormat] = useState<boolean>();

        const invalid = useMemo(() => {
            if (inputText && displayError) {
                const isValidEmail = isEmail(inputText)
                setIsValidEmailFormat(isValidEmail)

                handleInputValidity(isValidEmail)
                return !isValidEmail;
            } else {
                setIsValidEmailFormat(true)
            }

            const valid = displayError && !inputText

            handleInputValidity(!inputText)

            return valid;
        }, [displayError, inputText])

        const handleOnChangeText = (text: string) => {
            setInputText(text);

            onChangeText && onChangeText(text)
        }

        return <FormControl isInvalid={invalid}>
            <Input value={inputText} size="md" variant="underlined" placeholder="Email" borderBottomColor={invalid ? "error.600" : "darkText"} placeholderTextColor={"darkText"} onChangeText={handleOnChangeText} {...props} />

            {(invalid && !inputText) && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Email is required
            </FormControl.ErrorMessage>}


            {!isValidEmailFormat && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                Email is invalid
            </FormControl.ErrorMessage>}
        </FormControl>
    }