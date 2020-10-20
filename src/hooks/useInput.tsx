import React, { useState } from "react";
import { Input } from "antd";

const useInput = (name: string, placeholder?: string, type?: string, isInvalid?: { (value: string): boolean }) => {
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
        />
    );

    return { inputValue, input, invalid };
};

export default useInput;
