import { Input as AntInput } from "antd";
import styled from "styled-components";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { IInputProps } from "./Input";

export const StyledInput = styled(AntInput).attrs((props: IInputProps) => ({
    invalid: props.invalid ? "true" : undefined,
}))<IInputProps>`
    ${({ size, invalid, theme }) => {
        const { inputHeightBase, disabledColor, errorColor } = theme.default;

        // TODO add switch of sizes
        const maxHeight = size === undefined || size === "middle" ? getREM(inputHeightBase) : "unset";

        const sizeStyles = `
                max-height: ${maxHeight};
            `;

        const invalidStyles = `
                border-color: ${errorColor};
                box-shadow: 0 0 0 2px ${hexToRGBA(errorColor, 0.2)};
            `;

        const styles = `
            line-height: 1.3;
            ${sizeStyles};
            ${invalid ? invalidStyles : ""};

            &::placeholder, input::placeholder {
                color: ${disabledColor};
                line-height: 1.3;
            }

            input {
                line-height: 1.3;
                border-radius: 0;
            }
            `;

        return styles;
    }}
`;

export const InputWrapper = styled.div`
    & > *:not(:last-child) {
        margin-bottom: ${({ theme }) => getREM(theme.default.spaces[1])};
    }
`;
