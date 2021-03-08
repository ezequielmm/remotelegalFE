import { Input } from "antd";
import styled from "styled-components";
import { getPX, getREM } from "../../constants/styles/utils";
import { ITextAreaProps } from "./TextArea";

const { TextArea: AntTextArea } = Input;

export const StyledTextArea = styled(AntTextArea).attrs((props: ITextAreaProps) => ({
    invalid: props.invalid ? "true" : undefined,
}))<ITextAreaProps>`
    ${({ size, invalid, theme }) => {
        const { TextAreaHeightBase, disabledColor, errorColor } = theme.default;

        // TODO add switch of sizes
        const maxHeight = size === undefined || size === "middle" ? getREM(TextAreaHeightBase) : "unset";

        const sizeStyles = `
                max-height: ${maxHeight};
            `;

        const invalidStyles = `
                border-color: ${errorColor};
                box-shadow: 0 0 0 2px rgba(${errorColor}, 0.2);
            `;

        const styles = `
            line-height: 1.3;
            ${sizeStyles};
            ${invalid ? invalidStyles : ""};
            resize: none;

            &::placeholder, text-area::placeholder {
                color: ${disabledColor};
                line-height: 1.3;
            }

            text-area {
                line-height: 1.3;
                border-radius: 0;
            }

            padding-right: ${getREM(theme.default.spaces[6])}; 
            scrollbar-color: ${`${theme.colors.disabled[6]} ${theme.colors.disabled[4]}`};
            &::-webkit-scrollbar {
                width: ${getPX(theme.default.spaces[2])};
                height: ${getPX(theme.default.spaces[2])};
            }
            &::-webkit-scrollbar-track {
                background-color: ${theme.colors.disabled[4]};
                border-radius: ${getPX(theme.default.spaces[2])};
                margin: ${getREM(theme.default.spaces[6])};
            }
            &::-webkit-scrollbar-thumb {
                border-radius: ${getPX(theme.default.spaces[2])};
                background: ${theme.colors.disabled[6]};
            }
            `;

        return styles;
    }}
`;

export const TextAreaWrapper = styled.div`
    & > *:not(:last-child) {
        margin-bottom: ${({ theme }) => getREM(theme.default.spaces[3])};
    }
`;
