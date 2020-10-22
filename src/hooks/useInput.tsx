import React, { useState } from "react";
import Input from "../components/Input";

const useInput = (
    name: string,
    placeholder?: string,
    type?: string,
    isInvalid?: { (value: string): boolean },
    disabled?: boolean
) => {
    const [inputValue, setValue] = useState("");
    const [touched, setTouched] = useState(false);
    const [invalid, setInvalid] = useState(false);

    const input = (
        <Input
            type={type}
            placeholder={placeholder}
            name={name}
            id={name}
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
                setValue(value);
            }}
            disabled={disabled}
            invalid={invalid}
        />
    );

    return { inputValue, input, invalid };
};

export default useInput;
