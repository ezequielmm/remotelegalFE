import { Progress } from "antd";
import styled from "styled-components";

export const StyledProgressBarHeader = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0 2px 0;
    gap: 5px;
    svg {
        fill: ${({ theme }) => theme.default.whiteColor};
    }
`;

export const StyledProgressBar = styled(Progress)`
    .ant-progress-status-active .ant-progress-bg {
        background-color: "#8A9A0E";
    }
`;

export const StyledProgressBarContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    .close-icon {
        svg {
            fill: ${({ theme }) => theme.default.whiteColor};
        }
    }
`;
