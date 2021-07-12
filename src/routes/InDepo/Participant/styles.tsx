import styled from "styled-components";
import { Progress } from "antd";
import { getPX, getREM } from "../../../constants/styles/utils";
import { Theme } from "../../../types/ThemeType";

export const StyledParticipantMask = styled.div<{ highlight?: boolean }>`
    border-radius: ${({ theme }) => getPX(theme.default.borderRadiusBase, theme.default.baseUnit)};
    overflow: hidden;
    transform: translateZ(0); // Fix Safari stacking context problem
    width: 100%;
    height: 100%;
    background: ${({ theme }) => theme.colors.inDepoNeutrals[6]};
    position: relative;
    border: ${({ theme, highlight }) => (highlight ? `3px solid ${theme.default.successColor}` : "unset")};

    video {
        width: 100%;
        height: 100%;
        position: absolute;
        object-fit: contain;
    }

    &:before {
        width: 100%;
        content: "";
        height: 15%;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.05) 20%,
            rgba(0, 0, 0, 0.1) 40%,
            rgba(0, 0, 0, 0.2) 60%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.5) 100%
        );
        position: absolute;
        bottom: 0;
        left: 0;
    }
`;

export const StyledIdentityBox = styled.div<{ theme: Theme; showMicStatus?: boolean }>`
    position: absolute;
    bottom: 0;
    left: 0;
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[6])};
    padding: ${({ theme }) =>
        `${getREM(theme.default.spaces[12])} ${getREM(theme.default.spaces[4])} ${getREM(
            theme.default.spaces[7] / 2
        )}`};
    display: flex;
    flex-direction: column;
    max-width: 100%;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
    text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3), 0px 0px 8px rgba(0, 0, 0, 0.5);
    right: 0;
`;

export const StyledTimeBox = styled.div`
    text-transform: uppercase;
    position: absolute;
    font-size: ${({ theme }) => getREM(theme.default.fontSizes[6])};
    top: 0;
    right: 0;
    left: 0;
    padding: ${({ theme }) =>
        `
        ${getREM(theme.default.spaces[7] / 2)}
        ${getREM(theme.default.spaces[4])} 
        ${getREM(theme.default.spaces[12])} 
        `};
    display: flex;
    flex-direction: column;
    text-align: right;
    max-width: 100%;
    background: linear-gradient(0, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
    text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3), 0px 0px 8px rgba(0, 0, 0, 0.5);
`;

export const StyledParticipantMicContainer = styled.div`
    ${({ theme }) =>
        `
        &:not(:last-child) {
            margin-right: ${getREM(theme.default.spaces[1])};
        }
    `}
`;

export const StyledNetworkQuality = styled(Progress)`
    .ant-progress-steps-outer {
        align-items: flex-end;
        .ant-progress-steps-item:first-child {
            height: 4px !important;
        }
        .ant-progress-steps-item:nth-child(2) {
            height: 6px !important;
        }
        .ant-progress-steps-item:nth-child(3) {
            height: 8px !important;
        }
        .ant-progress-steps-item:nth-child(4) {
            height: 10px !important;
        }
        .ant-progress-steps-item:last-child {
            height: 12px !important;
        }
        .ant-progress-steps-item {
            border-radius: ${({ theme }) => getREM(theme.default.spaces[2])};
            margin-right: ${({ theme }) => getREM(theme.default.spaces[2])};
            width: 2px !important;
            margin-right: 0.12rem;
        }
    }
`;
