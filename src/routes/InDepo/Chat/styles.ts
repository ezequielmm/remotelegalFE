import { Input } from "antd";
import styled from "styled-components";
import Button from "@rl/prp-components-library/src/components/Button";
import Card from "@rl/prp-components-library/src/components/Card";
import Icon from "@rl/prp-components-library/src/components/Icon";
import { getPX, getREM } from "../../../constants/styles/utils";

const { TextArea } = Input;

export const StyledChatContainer = styled(Card)<{ height?: number | string }>`
    height: ${({ height }) => height};

    .ant-card-body {
        height: inherit;
        display: flex;
        flex-direction: column;
    }
`;

export const StyledChatBody = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: ${({ theme }) => getREM(theme.default.spaces[9])};
    padding-bottom: 0;
`;

export const StyledMessagesContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: ${({ theme }) => `${getREM(theme.default.spaces[3])}`};
    scrollbar-color: ${({ theme }) => `${theme.colors.disabled[7]} ${theme.default.disabledBg}`};
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: ${({ theme }) => getPX(theme.default.spaces[2])};
    }
    &::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.default.disabledBg};
    }
    &::-webkit-scrollbar-thumb {
        border-radius: ${({ theme }) => getPX(theme.default.spaces[5])};
        background: ${({ theme }) => theme.colors.disabled[7]};
    }
`;

export const StyledSendMessage = styled.div`
    width: 100%;
    display: flex;
    background: linear-gradient(180deg, #f3f3f3 0%, #ffffff 40%);
    align-items: flex-start;
`;

export const StyledInput = styled(TextArea)`
    border: 0;
    background: transparent;
    padding: 0;
    resize: none;
    border-radius: 0;
    min-height: 0 !important;
    &:focus,
    &:active {
        outline: none;
        border: 0;
        box-shadow: none;
    }
    &::placeholder {
        color: ${({ theme }) => theme.colors.disabled[7]};
    }
    &[disabled] {
        border: 0;
        background: transparent;
    }
    padding-right: ${({ theme }) => `${getREM(theme.default.spaces[3])}`};
    scrollbar-color: ${({ theme }) => `${theme.colors.disabled[7]} ${theme.default.disabledBg}`};
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: ${({ theme }) => getPX(theme.default.spaces[2])};
    }
    &::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.default.disabledBg};
    }
    &::-webkit-scrollbar-thumb {
        border-radius: ${({ theme }) => getPX(theme.default.spaces[5])};
        background: ${({ theme }) => theme.colors.disabled[7]};
    }
`;

export const StyledSendButton = styled(Button)`
    ${({ theme }) => {
        const { spaces } = theme.default;
        return `padding: ${getREM(spaces[6])} ${getREM(spaces[9])} ${getREM(spaces[6])} ${getREM(spaces[6])}`;
    }};
`;

export const StyledCloseIcon = styled(Icon)`
    position: absolute;
    top: ${({ theme }) => getREM(theme.default.spaces[4])};
    right: ${({ theme }) => getREM(theme.default.spaces[4])};
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[3])};
    color: ${({ theme }) => theme.colors.secondary[5]};
`;
export const StyledInputWrapper = styled.div`
    padding: ${({ theme }) =>
        `${getREM(theme.default.spaces[6])} 0 ${getREM(theme.default.spaces[9])} ${getREM(theme.default.spaces[6])}`};
    flex: 1 1;
`;
