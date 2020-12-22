import { Progress } from "antd";
import styled from "styled-components";
import { getPX, getREM } from "../../constants/styles/utils";

export const StyledProgressBar = styled(Progress)`
    margin-right: ${({ theme }) => getREM(theme.default.spaces[3] * 0.75)};
    .ant-progress-status-active .ant-progress-bg {
        background-color: ${({ theme }) => theme.default.successColor};
    }
`;

export const StyledProgressBarContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: ${({ theme }) => getPX(-theme.default.spaces[0])};
`;

export const StyledComponentContainer = styled.div`
    padding-top: ${({ theme }) => getREM(theme.default.spaces[3] * 0.75)};
`;
