import React, { MutableRefObject } from "react";
import styled from "styled-components";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import Space from "../Space";
import Control from "../Control/Control";
import { ReactComponent as MuteIcon } from "../../assets/in-depo/Mute.svg";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import { ReactComponent as CameraOnIcon } from "../../assets/in-depo/Camera.on.svg";
import { ReactComponent as CameraOffIcon } from "../../assets/in-depo/Camera.off.svg";
import Icon from "../Icon";
import Title from "../Typography/Title";
import Text from "../Typography/Text";
import ColorStatus from "../../types/ColorStatus";

export interface ITestVideoProps {
    isMuted?: boolean;
    isVideoOn?: boolean;
    ref?: MutableRefObject<HTMLVideoElement>;
    hasError?: boolean;
    errorTitle?: string;
    errorText?: string;
}

export interface IStyledTestVideo {
    $hasError: boolean;
}

const StyledTestVideo = styled.div<IStyledTestVideo>`
    overflow: hidden;
    min-height: ${getREM(theme.default.spaces[12] * 4)};
    background: ${({ $hasError }) => `${$hasError ? theme.default.disabledBg : theme.colors.inDepoNeutrals[6]}`};
    border-radius: ${getREM(theme.default.spaces[4])};
    position: relative;
    video {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
`;

const StyledVideoError = styled(Space)`
    top: 0;
    left: 0;
    text-align: center;
    padding: ${getREM(theme.default.spaces[11] * 2)} ${getREM(theme.default.spaces[12] * 2)}
        ${getREM(theme.default.spaces[11] * 3)};
    min-height: ${getREM(theme.default.spaces[12] * 4)};
`;

export const TestVideoControlsWrapper = styled(Space)`
    position: absolute;
    bottom: ${getREM(theme.default.spaces[6])};
    left: 0;
    width: 100%;
`;

const TestVideo = React.forwardRef(
    ({ isMuted, isVideoOn, ref, hasError, errorTitle, errorText, ...rest }: ITestVideoProps) => {
        return (
            <StyledTestVideo $hasError={hasError} {...rest}>
                {hasError ? (
                    <StyledVideoError align="center" justify="center" direction="vertical">
                        <Title level={4} color={ColorStatus.disabled}>
                            {errorTitle}
                        </Title>
                        <Text ellipsis={false}>{errorText}</Text>
                    </StyledVideoError>
                ) : (
                    <video ref={ref} autoPlay>
                        <track kind="captions" />
                    </video>
                )}
                <TestVideoControlsWrapper justify="center">
                    <Control
                        type="circle"
                        isActive={!isMuted}
                        icon={<Icon icon={isMuted ? MuteIcon : UnmuteIcon} size="1.625rem" />}
                    />
                    <Control
                        type="circle"
                        isActive={isVideoOn}
                        icon={<Icon icon={isVideoOn ? CameraOnIcon : CameraOffIcon} size="1.625rem" />}
                    />
                </TestVideoControlsWrapper>
            </StyledTestVideo>
        );
    }
);

export default TestVideo;
