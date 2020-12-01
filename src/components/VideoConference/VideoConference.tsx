import React, { useEffect, useState, useRef } from "react";
import { RemoteParticipant, Room } from "twilio-video";
import { theme } from "../../constants/styles/theme";
import Participant from "../../routes/VideoChat/Participant";
import {
    StyledVideoConference,
    StyledDeponentContainer,
    StyledAttendeesContainer,
    StyledParticipantContainer,
} from "./styles";

enum LayoutSize {
    default,
    grid,
    vertical,
}

type TLayoutClass = keyof typeof LayoutSize;

interface IVideoConferenceProps {
    deponent: Room["localParticipant"];
    antendees: Room["participants"];
    layoutSize: LayoutSize;
}

const VideoConference = ({ deponent, antendees, layoutSize }: IVideoConferenceProps) => {
    const [layoutClass, setLayoutClass] = useState<TLayoutClass>(null);
    const [antendeesHeight, setAntendeesHeight] = useState<string>("");
    const [deponentHeight, setDeponentHeight] = useState<string>("");
    const participantContainer = useRef<HTMLDivElement>(null);
    const videoConferenceContainer = useRef<HTMLDivElement>(null);

    const calculateAntendeesHeight = (participantRef: React.MutableRefObject<HTMLDivElement>): string => {
        if (!participantRef.current) return "";

        let { height } = window.getComputedStyle(participantRef.current);
        height = height.replace("px", ""); // remove "px" string

        return `${Number(height) * 2 + theme.default.baseUnit}px`;
    };

    const calculateDeponentHeight = (
        participantRef: React.MutableRefObject<HTMLDivElement>,
        videoConferenceRef: React.MutableRefObject<HTMLDivElement>
    ): string => {
        if (!participantRef.current) return "";

        const { height } = window.getComputedStyle(videoConferenceRef.current);
        const videoConferenceHeight = Number(height.replace("px", ""));
        const antendeesContainerHeight = Number(calculateAntendeesHeight(participantRef).replace("px", ""));

        return `${videoConferenceHeight - antendeesContainerHeight - theme.default.baseUnit}px`;
    };

    useEffect(() => {
        switch (layoutSize) {
            case LayoutSize.vertical:
                setLayoutClass("vertical");
                break;
            case LayoutSize.grid:
                setLayoutClass("grid");
                break;
            default:
                setLayoutClass("default");
                break;
        }

        // Reset grid height
        setAntendeesHeight("");
        setDeponentHeight("");
    }, [layoutSize]);

    useEffect(() => {
        if (layoutClass === "grid") {
            setAntendeesHeight(calculateAntendeesHeight(participantContainer));
            setDeponentHeight(calculateDeponentHeight(participantContainer, videoConferenceContainer));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutClass]);

    return (
        <StyledVideoConference className={layoutClass} ref={videoConferenceContainer}>
            <StyledDeponentContainer height={deponentHeight}>
                <Participant participant={deponent} />
            </StyledDeponentContainer>
            <StyledAttendeesContainer height={antendeesHeight}>
                {Array.from(antendees.values()).map((participant: RemoteParticipant, i) => (
                    <StyledParticipantContainer key={participant.sid} ref={i === 0 ? participantContainer : null}>
                        <Participant participant={participant} />
                    </StyledParticipantContainer>
                ))}
            </StyledAttendeesContainer>
        </StyledVideoConference>
    );
};

export default VideoConference;
