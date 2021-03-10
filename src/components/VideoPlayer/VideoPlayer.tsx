import { Slider } from "antd";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import screenfull from "screenfull";
import styled from "styled-components";
import Space from "../Space";
import Icon from "../Icon";
import { ReactComponent as ExpandIcon } from "../../assets/icons/fullscreen-button.svg";
import { ReactComponent as PauseIcon } from "../../assets/icons/Pause.svg";
import { ReactComponent as PlayIcon } from "../../assets/icons/Play.svg";
import { ReactComponent as ContractIcon } from "../../assets/icons/Contract.svg";
import Duration from "./Duration";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";
import Text from "../Typography/Text";
import actions from "../../state/PostDepo/PostDepoActions";
import { GlobalStateContext } from "../../state/GlobalState";

const StyledVideoPlayer = styled.div`
    width: 100%;
    position: relative;
    video {
        display: block;
    }
`;

const StyledControls = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: ${getREM(theme.default.spaces[12])} ${getREM(theme.default.spaces[8])} ${getREM(theme.default.spaces[3])};
    background: linear-gradient(180deg, ${hexToRGBA("#000", 0)} 0%, ${hexToRGBA("#000", 0.7)} 100%);
}
    .anticon {
        cursor: pointer;
        &:hover {   
            opacity: 0.6;
        }
    }
    .ant-slider{
        .ant-slider-track{
            background-color ${theme.default.primaryColor};
        }
        .ant-slider-rail{
            background-color ${hexToRGBA(theme.default.whiteColor, 0.2)};
        }
        .ant-slider-handle{
            opacity: 0;
            transition: opacity 0.3s;
            &:focus{
                opacity: 1;
            }
        }
        &:hover{
            .ant-slider-handle{
                opacity: 1;
            }
        }
    }
    time{
        color: ${theme.default.whiteColor};
        font-size: ${getREM(theme.default.spaces[4])};
        vertical-align: middle;
        display: inline-block;
        & + span{
            display: inline-block;
            color: ${theme.default.whiteColor};
            font-size: ${getREM(theme.default.spaces[4])};
            vertical-align: middle;
            margin: 0 ${getREM(theme.default.spaces[2])};
        }
    }
`;

const StyledTimeContainer = styled.div`
    padding-bottom: ${getREM(theme.default.spaces[2])};
`;

interface IVideoPlayer extends ReactPlayerProps {
    fullScreen?: boolean;
}

const VideoPlayer = ({ fullScreen, fallback, ...rest }: IVideoPlayer) => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { changeTime, currentTime, playing, duration } = state.postDepo;

    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const player = useRef(null);
    const styledPlayerRef = useRef(null);

    const handleDuration = (newDuration) => {
        dispatch(actions.setDuration(newDuration));
    };

    const handlePlayPause = () => {
        dispatch(actions.setPlaying(!playing));
    };

    const handlePlay = () => {
        dispatch(actions.setPlaying(true));
    };

    const handleProgress = (state) => {
        dispatch(actions.setCurrentTime(state.played * duration));
    };

    const handleSliderChange = useCallback(
        (value) => {
            dispatch(actions.setCurrentTime(value));
            player.current.seekTo(value);
        },
        [player, dispatch]
    );

    const handleFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle(styledPlayerRef.current);
        }
        setFullscreen(!fullscreen);
    };

    useEffect(() => {
        return () => dispatch(actions.resetVideoData());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (player && player.current && changeTime.time !== undefined) {
            handleSliderChange(changeTime.time);
        }
    }, [handleSliderChange, changeTime, styledPlayerRef]);

    return (
        <StyledVideoPlayer ref={styledPlayerRef} data-testid="video_player">
            <ReactPlayer
                data-testid="react_player"
                ref={player}
                playing={playing}
                onPlay={handlePlay}
                onProgress={handleProgress}
                onDuration={handleDuration}
                width="100%"
                height={isVideoReady ? "100%" : "0"}
                progressInterval={250}
                onReady={() => setIsVideoReady(true)}
                {...rest}
            />
            {!isVideoReady && fallback}
            {isVideoReady && (
                <StyledControls data-testid="video_player_control">
                    <Space justify="space-between" align="center" fullWidth>
                        <Space.Item>
                            <Icon size={5} onClick={handlePlayPause} icon={playing ? PauseIcon : PlayIcon} />
                        </Space.Item>
                        <Space.Item flex="1 1">
                            <Slider
                                value={currentTime}
                                step={0.25}
                                defaultValue={currentTime}
                                max={duration}
                                onChange={handleSliderChange}
                                tooltipVisible={false}
                            />
                        </Space.Item>
                        <Space.Item>
                            <StyledTimeContainer>
                                <Duration seconds={currentTime} />
                                <Text>/</Text>
                                <Duration seconds={duration} />
                            </StyledTimeContainer>
                        </Space.Item>
                        {fullScreen && (
                            <Space.Item>
                                <Icon
                                    size={6}
                                    icon={fullscreen ? ContractIcon : ExpandIcon}
                                    onClick={handleFullScreen}
                                />
                            </Space.Item>
                        )}
                    </Space>
                </StyledControls>
            )}
        </StyledVideoPlayer>
    );
};

export default VideoPlayer;
