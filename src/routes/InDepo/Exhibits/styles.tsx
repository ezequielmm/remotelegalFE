import styled from "styled-components";
import { Space as AntSpace } from "antd";
import { getPX } from "../../../constants/styles/utils";

export const ExhibitTabPaneSpacer = styled(AntSpace)`
    height: inherit;
    width: 100%;
    overflow: hidden;

    .ant-space-item {
        position: relative;
        .spinner {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
    }

    > :last-child {
        height: inherit;
        overflow: hidden;
    }
    ${({ theme }) => `
        @media (max-width: ${theme.default.breakpoints.sm}) {
            .ant-result-icon {
                margin-bottom: 0;
            }
        }
    `}
`;

export const ScrollTableContainer = styled(AntSpace)`
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-right: ${({ theme }) => getPX(theme.default.spaces[3])};
    overflow-y: auto;
    scrollbar-color: ${({ theme }) => `${theme.colors.inDepoBlue[6]} ${theme.colors.inDepoNeutrals[1]}`};
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: ${({ theme }) => getPX(theme.default.spaces[2])};
        height: ${({ theme }) => getPX(theme.default.spaces[2])};
    }
    &::-webkit-scrollbar-track {
        background-color: ${({ theme }) => theme.colors.inDepoNeutrals[1]};
    }
    &::-webkit-scrollbar-thumb {
        border-radius: ${({ theme }) => getPX(theme.default.spaces[5])};
        background: ${({ theme }) => theme.colors.inDepoBlue[6]};
    }

    > :last-child {
        flex-grow: 1;
    }
`;
