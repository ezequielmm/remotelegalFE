import { Progress } from "antd";
import styled from "styled-components";
import { getPX, getREM } from "../../constants/styles/utils";
import Button from "../Button";

export const StyledProgressBar = styled(Progress)`
    margin-right: ${({ theme }) => getREM(theme.default.spaces[4])};
    .ant-progress-status-active .ant-progress-bg {
        background-color: ${({ theme }) => theme.default.successColor};
    }
    .ant-progress-inner {
        background-color: ${({ theme }) =>
            theme.mode === "default" ? theme.colors.disabled[5] : theme.default.secondary};
    }
`;

export const StyledProgressBarContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: ${({ theme }) => getPX(-theme.default.spaces[2])};
`;

export const StyledComponentContainer = styled.div`
    padding-top: ${({ theme }) => getREM(theme.default.spaces[4])};
    width: 100%;
`;

export const StyledButton = styled(Button)`
    padding-top: ${({ theme }) => getREM(theme.default.spaces[4])};
`;
