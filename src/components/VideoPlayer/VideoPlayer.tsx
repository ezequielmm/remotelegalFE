import { Slider } from "antd";
import React, { useRef, useState } from "react";
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

const StyledVideoPlayer = styled.div`
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

const VideoPlayer = ({ ...rest }: ReactPlayerProps) => {
    const [playing, setPlaying] = useState<boolean>(false);
    const [duration, setDuration] = useState<number>(0);
    const [fullscreen, setfullscreen] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);

    const player = useRef(null);
    const styledPlayerRef = useRef(null);

    const handleDuration = (newDuration) => {
        setDuration(newDuration);
    };

    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handlePlay = () => {
        setPlaying(true);
    };

    const handleProgress = (state) => {
        setCurrentTime(state.played * duration);
    };

    const handleSliderChange = (value) => {
        setCurrentTime(value);
        player.current.seekTo(value);
    };

    const handleFullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle(styledPlayerRef.current);
        }
        setfullscreen(!fullscreen);
    };

    return (
        <StyledVideoPlayer ref={styledPlayerRef}>
            <ReactPlayer
                ref={player}
                playing={playing}
                onPlay={handlePlay}
                onProgress={handleProgress}
                onDuration={handleDuration}
                progressInterval={250}
                {...rest}
            />
            <StyledControls>
                <Space justify="space-between" align="center">
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
                    <Space.Item>
                        <Icon size={6} icon={fullscreen ? ContractIcon : ExpandIcon} onClick={handleFullScreen} />
                    </Space.Item>
                </Space>
            </StyledControls>
        </StyledVideoPlayer>
    );
};

export default VideoPlayer;
