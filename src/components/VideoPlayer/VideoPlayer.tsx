import { Slider } from "antd";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import screenfull from "screenfull";
import { isIOS } from "react-device-detect";
import styled from "styled-components";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import { ReactComponent as ExpandIcon } from "../../assets/icons/fullscreen-button.svg";
import { ReactComponent as PauseIcon } from "../../assets/icons/Pause.svg";
import { ReactComponent as PlayIcon } from "../../assets/icons/Play.svg";
import { ReactComponent as ContractIcon } from "../../assets/icons/Contract.svg";
import { ReactComponent as AudioIcon } from "../../assets/icons/audio.svg";
import { ReactComponent as VolumeOnIcon } from "../../assets/icons/volume-on.svg";
import { ReactComponent as VolumeOffIcon } from "../../assets/icons/volume-off.svg";
import Duration from "./Duration";
import { getREM, hexToRGBA } from "../../constants/styles/utils";
import { theme } from "../../constants/styles/theme";
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
            background-color: ${theme.default.primaryColor};
        }
        .ant-slider-rail{
            background-color: ${hexToRGBA(theme.default.whiteColor, 0.2)};
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

const StyledOnlyAudioPlaceHolder = styled.div`
    background: ${theme.default.blackColor};
    padding: ${getREM(theme.default.spaces[4])} 0;
    color: ${hexToRGBA(theme.default.disabledColor, 0.2)};
    display: flex;
    justify-content: center;
`;

const StyledVolumeContainer = styled(Space)`
    width: ${getREM(5)};
`;

export interface IVideoPlayer extends ReactPlayerProps {
    fullScreen?: boolean;
    isOnlyAudio?: boolean;
    showVolume?: boolean;
}

const VideoPlayer = ({
    fullScreen,
    fallback,
    isOnlyAudio,
    url,
    onInit,
    onReady,
    showVolume = true,
    ...rest
}: IVideoPlayer) => {
    const { dispatch, state } = useContext(GlobalStateContext);
    const { changeTime, currentTime, playing, duration } = state.postDepo;

    const [fullscreen, setFullscreen] = useState<boolean>(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);

    const player = useRef(null);
    const styledPlayerRef = useRef(null);
    const currentUrl = useRef(null);

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

    const handleVolumeChange = (value) => {
        setVolume(parseFloat(value));
        setMuted(value === 0 ?? false);
    };

    const muteVideo = () => {
        setMuted(!muted);
        setVolume(muted && volume === 0 ? 1 : volume);
    };

    useEffect(() => {
        return () => dispatch(actions.resetVideoData());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (player && player.current && changeTime.time !== undefined) {
            handleSliderChange(changeTime.time / 1000);
        }
    }, [handleSliderChange, changeTime, styledPlayerRef]);

    useEffect(() => {
        if (onInit) onInit();
    }, [onInit]);

    useEffect(() => {
        if (url && !currentUrl.current) {
            currentUrl.current = url;
        }
        return () => {
            currentUrl.current = null;
        };
    }, [url, currentUrl]);

    const handleOnReady = (player) => {
        setIsVideoReady(true);
        if (player && onReady) {
            onReady(player);
        }
    };

    return (
        <StyledVideoPlayer ref={styledPlayerRef} data-testid="video_player">
            {isOnlyAudio && (
                <StyledOnlyAudioPlaceHolder
                    data-testid="only_audio_image"
                    style={{ visibility: isVideoReady ? "visible" : "hidden", height: isVideoReady ? "100%" : "0" }}
                >
                    <Icon width="2em" size={getREM(theme.default.spaces[11] * 10)} icon={AudioIcon} />
                </StyledOnlyAudioPlaceHolder>
            )}
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
                onReady={handleOnReady}
                volume={volume}
                muted={muted}
                url={currentUrl?.current}
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
                        {!isIOS && showVolume && (
                            <StyledVolumeContainer align="center" size={1}>
                                <Icon
                                    size={7}
                                    color={theme.default.whiteColor}
                                    onClick={muteVideo}
                                    icon={muted ? VolumeOffIcon : VolumeOnIcon}
                                />
                                <Space.Item flex="1 1">
                                    <Slider
                                        value={muted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        step={0.1}
                                        max={1}
                                        tooltipVisible={false}
                                        trackStyle={{ backgroundColor: theme.default.whiteColor }}
                                    />
                                </Space.Item>
                            </StyledVolumeContainer>
                        )}
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
