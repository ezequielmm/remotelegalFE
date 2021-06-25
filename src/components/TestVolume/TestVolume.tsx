import React from "react";
import { Progress } from "antd";
import styled from "styled-components";
import Space from "../Space";
import Icon from "../Icon";
import { ReactComponent as MicrophoneIcon } from "../../assets/in-depo/microphone.svg";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import useVolumeLevel from "../../hooks/useVolumeMeter";

export interface TestVolumeProps {
    stream?: MediaStream;
}

const StyledProgress = styled(Progress)`
    .ant-progress-steps-item {
        border-radius: ${getREM(theme.default.spaces[2])};
        margin-right: ${getREM(theme.default.spaces[2])};
    }
`;

const TestVolume = ({ stream }: TestVolumeProps) => {
    const { volumeLevel } = useVolumeLevel(stream);
    return (
        <Space align="center">
            <Icon data-testid="microphone_icon" icon={MicrophoneIcon} color={theme.colors.disabled[6]} size={9} />
            <StyledProgress
                data-testid={`microphone_meter_${stream ? volumeLevel : 0}`}
                steps={5}
                showInfo={false}
                strokeColor={theme.default.successColor}
                trailColor={theme.colors.disabled[6]}
                percent={stream ? Math.round(volumeLevel) : 0}
                strokeWidth={theme.default.spaces[3] * theme.default.baseUnit}
            />
        </Space>
    );
};

export default TestVolume;
