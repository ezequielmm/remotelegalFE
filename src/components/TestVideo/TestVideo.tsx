import { MutableRefObject, forwardRef } from "react";
import styled from "styled-components";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Title from "prp-components-library/src/components/Title";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import Control from "../Control/Control";
import { ReactComponent as MuteIcon } from "../../assets/in-depo/Mute.svg";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import { ReactComponent as CameraOnIcon } from "../../assets/in-depo/Camera.on.svg";
import { ReactComponent as CameraOffIcon } from "../../assets/in-depo/Camera.off.svg";
import ColorStatus from "../../types/ColorStatus";

export interface ITestVideoProps {
    showButtons?: boolean;
    isMuted?: boolean;
    isVideoOn?: boolean;
    onClickMuted?: () => void;
    onClickVideo?: () => void;
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
        display: block;
    }
`;

const StyledVideoError = styled(Space)`
    top: 0;
    left: 0;
    text-align: center;
    padding: ${getREM(theme.default.spaces[9] * 2)} ${getREM(theme.default.spaces[12])}
        ${getREM(theme.default.spaces[12] * 3)};
    min-height: ${getREM(theme.default.spaces[12] * 4)};
`;

export const TestVideoControlsWrapper = styled(Space)`
    position: absolute;
    bottom: ${getREM(theme.default.spaces[6])};
    left: 0;
    width: 100%;

    ${({ theme }) => `
        @media (max-width: ${theme.default.breakpoints.sm}) {
            bottom: ${getREM(theme.default.spaces[4])};
        }
    `};
`;

const TestVideo = forwardRef(
    (
        {
            isMuted,
            isVideoOn,
            showButtons = true,
            hasError,
            errorTitle,
            errorText,
            onClickMuted,
            onClickVideo,
            ...rest
        }: ITestVideoProps,
        ref: MutableRefObject<HTMLVideoElement>
    ) => {
        return (
            <StyledTestVideo $hasError={hasError} {...rest}>
                {hasError ? (
                    <StyledVideoError align="center" justify="center" direction="vertical">
                        <Title dataTestId="video_title" level={5} weight="regular" color={ColorStatus.disabled}>
                            {errorTitle}
                        </Title>
                        <Text dataTestId="video_subtitle" ellipsis={false}>
                            {errorText}
                        </Text>
                    </StyledVideoError>
                ) : (
                    <video data-testid="video" ref={ref} autoPlay>
                        <track kind="captions" />
                    </video>
                )}
                <TestVideoControlsWrapper justify="center">
                    {showButtons && (
                        <>
                            <Control
                                data-testid={`audio_on_toggle_${isMuted}`}
                                onClick={onClickMuted}
                                type="circle"
                                isActive={!isMuted}
                                icon={<Icon icon={isMuted ? MuteIcon : UnmuteIcon} size="1.625rem" />}
                            />
                            <Control
                                data-testid={`video_on_toggle_${isVideoOn}`}
                                onClick={onClickVideo}
                                type="circle"
                                isActive={isVideoOn}
                                icon={<Icon icon={isVideoOn ? CameraOnIcon : CameraOffIcon} size="1.625rem" />}
                            />
                        </>
                    )}
                </TestVideoControlsWrapper>
            </StyledTestVideo>
        );
    }
);

export default TestVideo;
