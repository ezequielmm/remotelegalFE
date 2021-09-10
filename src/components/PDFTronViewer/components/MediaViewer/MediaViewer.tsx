import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Title from "prp-components-library/src/components/Title";
import Text from "prp-components-library/src/components/Text";
import Button from "prp-components-library/src/components/Button";
import Icon from "prp-components-library/src/components/Icon";
import ColorStatus from "prp-components-library/src/types/ColorStatus";
import { NETWORK_ERROR } from "../../../../constants/inDepo";
import { mapTimeZone } from "../../../../models/general";
import { GlobalStateContext } from "../../../../state/GlobalState";
import actions from "../../../../state/InDepo/InDepoActions";
import { getREM } from "../../../../constants/styles/utils";
import Message from "../../../Message";
import VideoPlayer from "../../../VideoPlayer";

import { ReactComponent as DeleteIcon } from "../../../../assets/icons/delete.svg";
import { IVideoPlayer } from "../../../VideoPlayer/VideoPlayer";

interface MediaViewerProps extends IVideoPlayer {
    url: string;
    stampLabelFromFile?: string;
    readOnly?: boolean;
    onMediaReady?: () => void;
    onError?: () => void;
    onStamp?: (stampLabel: string) => void;
}
interface stampProps {
    selected?: boolean;
}

const StyledMediaViewerContainer = styled.div`
    position: relative;
`;

const StyledStampLabelContainer = styled.div<stampProps>`
    padding: ${({ theme }) => getREM(theme.default.spaces[6])};
    background-color: ${({ theme }) => theme.colors.inDepoNeutrals[3]};
    border-radius: ${({ theme }) => getREM(theme.default.borderRadiusBase)};
    position: absolute;
    left: ${({ theme }) => getREM(theme.default.spaces[4])};
    top: ${({ theme }) => getREM(theme.default.spaces[4])};
    text-align: center;
    border: 2px solid
        ${({ selected, theme }) => (selected ? theme.colors.inDepoBlue[3] : theme.colors.inDepoNeutrals[3])};
`;

const StyledDeleteButton = styled(Button)`
    position: absolute;
    top: ${({ theme }) => `calc(100% + ${getREM(theme.default.spaces[4])})`};
    left: 50%;
    transform: translateX(-50%);
    padding: 0 ${({ theme }) => getREM(theme.default.spaces[4])};
    background-color: ${({ theme }) => theme.colors.inDepoNeutrals[5]};
    border-color: ${({ theme }) => theme.colors.inDepoNeutrals[5]};
`;

export default function MediaViewer({
    url,
    stampLabelFromFile,
    isOnlyAudio,
    readOnly,
    onInit,
    onMediaReady,
    onError,
    onStamp,
}: MediaViewerProps) {
    const { state, dispatch } = useContext(GlobalStateContext);
    const { timeZone, stampLabel } = state.room;
    const [currentStampLabel, setCurrentStampLabel] = useState("");
    const [stampSelected, setStampSelected] = useState(false);

    const onErrorMessage = () => {
        Message({
            content: NETWORK_ERROR,
            type: "error",
            duration: 3,
        });
        onError();
    };

    const timeStamp = dayjs().tz(mapTimeZone[timeZone]).format("MMM DD YYYY");

    useEffect(() => {
        setCurrentStampLabel(stampLabel || stampLabelFromFile);
    }, [stampLabel, stampLabelFromFile]);

    useEffect(() => {
        if (currentStampLabel && !readOnly) dispatch(actions.setStampLabel(currentStampLabel));
    }, [currentStampLabel, readOnly, dispatch]);

    const handleStampSelected = () => {
        setStampSelected(!stampSelected);
    };

    const handleDeleteStamp = () => {
        onStamp("");
    };

    return (
        <StyledMediaViewerContainer>
            <VideoPlayer
                url={url}
                isOnlyAudio={isOnlyAudio}
                onError={onErrorMessage}
                onReady={onMediaReady}
                onInit={onInit}
                fullScreen
            />
            {currentStampLabel && (
                <StyledStampLabelContainer
                    onClick={handleStampSelected}
                    selected={stampSelected}
                    data-testid="stamp_label"
                >
                    <Title level={6} color={ColorStatus.white} noMargin>
                        {currentStampLabel}
                    </Title>
                    <Text data-testid="stamp_label_timestamp" state={ColorStatus.white}>
                        {timeStamp}
                    </Text>
                    {stampSelected && !readOnly && (
                        <StyledDeleteButton
                            data-testid="stamp_label_delete_button"
                            type="secondary"
                            size="small"
                            onClick={handleDeleteStamp}
                        >
                            <Icon icon={DeleteIcon} size={8} style={{ color: "white" }} />
                        </StyledDeleteButton>
                    )}
                </StyledStampLabelContainer>
            )}
        </StyledMediaViewerContainer>
    );
}
