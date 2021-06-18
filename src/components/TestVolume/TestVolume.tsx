import React from "react";
import { Progress } from "antd";
import styled from "styled-components";
import { ProgressProps } from "antd/lib/progress";
import Space from "../Space";
import Icon from "../Icon";
import { ReactComponent as MicrophoneIcon } from "../../assets/in-depo/microphone.svg";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";

export interface TestVolumeProps {
    percent: number;
}

const StyledProgress = styled(Progress)`
    .ant-progress-steps-item {
        border-radius ${getREM(theme.default.spaces[2])};
        margin-right: ${getREM(theme.default.spaces[2])};
    }
`;

const TestVolume = ({ percent }: TestVolumeProps) => {
    return (
        <Space align="center">
            <Icon icon={MicrophoneIcon} color={theme.colors.disabled[6]} size={9} />
            <StyledProgress
                steps={5}
                showInfo={false}
                strokeColor={theme.default.successColor}
                trailColor={theme.colors.disabled[6]}
                percent={percent}
                strokeWidth={theme.default.spaces[3] * theme.default.baseUnit}
            />
        </Space>
    );
};

export default TestVolume;
