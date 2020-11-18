import styled from "styled-components";
import { Button as AntButton } from "antd";

export const StyledUploadButton = styled(AntButton)`
    border-color: ${({ theme }) => theme.default.primaryColor};
    text-transform: uppercase;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.default.primaryColor};
    &:hover,
    &:focus {
        background: ${({ theme }) => theme.colors.primary[0]};
    }
`;

export const StyledAttachButton = styled(AntButton)`
    font-size: ${({ theme }) => theme.default.fontSizeBase};
    border: 1px solid #d9d9d9;
    color: ${({ theme }) => theme.default.primaryColor};
    display: flex;
    align-items: center;
    max-width: 100%;
    .close-icon {
        svg {
            vertical-align: bottom;
        }
    }
    &:hover,
    &:focus {
        border-color: #d9d9d9;
    }
`;
