import React, { useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteParticipant, Room } from "twilio-video";
import { theme } from "../../../constants/styles/theme";
import Participant from "../Participant";
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
    attendees: Room["participants"];
    layoutSize: LayoutSize;
    witnessID: string;
    localParticipant: LocalParticipant;
}

const VideoConference = ({ attendees, layoutSize, witnessID, localParticipant }: IVideoConferenceProps) => {
    const [layoutClass, setLayoutClass] = useState<TLayoutClass>(null);
    const [attendeesHeight, setAttendeesHeight] = useState<string>("");
    const [witnessHeight, setWitnessHeight] = useState<string>("");
    const participantContainer = useRef<HTMLDivElement>(null);
    const videoConferenceContainer = useRef<HTMLDivElement>(null);
    const participants = [localParticipant, ...Array.from(attendees.values())];
    const witness = participants.find((participant) => participant.identity === witnessID);

    const calculateAttendeesHeight = (participantRef: React.MutableRefObject<HTMLDivElement>): string => {
        if (!participantRef.current) return "";

        let { height } = window.getComputedStyle(participantRef.current);
        height = height.replace("px", ""); // remove "px" string

        return `${Number(height) * 2 + theme.default.baseUnit}px`;
    };

    const calculateWitnessHeight = (
        participantRef: React.MutableRefObject<HTMLDivElement>,
        videoConferenceRef: React.MutableRefObject<HTMLDivElement>
    ): string => {
        if (!participantRef.current) return "";

        const { height } = window.getComputedStyle(videoConferenceRef.current);
        const videoConferenceHeight = Number(height.replace("px", ""));
        const attendeesContainerHeight = Number(calculateAttendeesHeight(participantRef).replace("px", ""));

        return `${videoConferenceHeight - attendeesContainerHeight - theme.default.baseUnit}px`;
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
        setAttendeesHeight("");
        setWitnessHeight("");
    }, [layoutSize]);

    useEffect(() => {
        if (layoutClass === "grid") {
            setAttendeesHeight(calculateAttendeesHeight(participantContainer));
            setWitnessHeight(calculateWitnessHeight(participantContainer, videoConferenceContainer));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [layoutClass]);

    return (
        <StyledVideoConference className={layoutClass} ref={videoConferenceContainer}>
            <StyledDeponentContainer height={witnessHeight}>
                <Participant participant={witness} />
            </StyledDeponentContainer>
            <StyledAttendeesContainer height={attendeesHeight}>
                {participants
                    .filter((participant) => participant.identity !== witnessID)
                    .map((participant: RemoteParticipant, i) => (
                        <StyledParticipantContainer key={participant.sid} ref={i === 0 ? participantContainer : null}>
                            <Participant participant={participant} />
                        </StyledParticipantContainer>
                    ))}
            </StyledAttendeesContainer>
        </StyledVideoConference>
    );
};

export default VideoConference;
