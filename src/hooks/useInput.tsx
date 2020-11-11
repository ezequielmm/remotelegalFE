import React, { useState } from "react";
import Input from "../components/Input";
import { IInputProps } from "../components/Input/Input";

const useInput = (
    isInvalid?: {
        (value: string): boolean;
    },
    inputProps?: JSX.IntrinsicAttributes & IInputProps
) => {
    const [inputValue, setValue] = useState("");
    const [touched, setTouched] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const input = (
        <Input
            {...inputProps}
            value={inputValue}
            onBlur={({ target: { value } }) => {
                if (!touched && isInvalid) {
                    setInvalid(isInvalid(value));
                }
                if (isInvalid) {
                    setTouched(true);
                }
            }}
            onChange={({ target: { value } }) => {
                if (isInvalid && touched) {
                    setInvalid(isInvalid(value));
                }

                return setValue(value);
            }}
            invalid={invalid}
        />
    );

    return { inputValue, input, invalid, setInvalid, touched, setValue };
};

export default useInput;
