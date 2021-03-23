import React, { useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteParticipant, Room } from "twilio-video";
import useSignalR from "../../../hooks/useSignalR";
import { TimeZones } from "../../../models/general";
import { NotificationEntityType, Notification } from "../../../types/Notification";
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
    timeZone: TimeZones;
    isBreakroom?: boolean;
    localParticipant: LocalParticipant;
    atendeesVisibility?: boolean;
}

const VideoConference = ({
    isBreakroom,
    attendees,
    timeZone,
    layoutSize,
    localParticipant,
    atendeesVisibility = true,
}: IVideoConferenceProps) => {
    const [layoutClass, setLayoutClass] = useState<TLayoutClass>(null);
    const participantContainer = useRef<HTMLDivElement>(null);
    const videoConferenceContainer = useRef<HTMLDivElement>(null);
    const participants = [localParticipant, ...Array.from(attendees.values())];
    const witness = participants.find((participant) => JSON.parse(participant.identity).role === "Witness");
    const { subscribeToGroup, signalR } = useSignalR("/depositionHub");
    const [participantsStatus, setParticipantsStatus] = useState({});

    useEffect(() => {
        if (signalR) {
            subscribeToGroup("ReceiveNotification", (message: Notification) => {
                if (message?.entityType === NotificationEntityType.participantStatus) {
                    const { content } = message;
                    setParticipantsStatus((status) => ({ ...status, [`${content.email}`]: content }));
                }
            });
        }
    }, [signalR, subscribeToGroup]);

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
    }, [layoutSize]);

    return (
        <StyledVideoConference
            className={`${layoutClass} ${isBreakroom && "breakrooms"}`}
            ref={videoConferenceContainer}
            show={atendeesVisibility}
        >
            {!isBreakroom && (
                <StyledDeponentContainer isUnique={isBreakroom && participants.length === 1}>
                    <Participant
                        timeZone={timeZone}
                        participant={isBreakroom ? participants[1] : witness}
                        isWitness
                        isMuted={!!(witness && participantsStatus[JSON.parse(witness?.identity)?.email]?.isMuted)}
                    />
                </StyledDeponentContainer>
            )}
            <StyledAttendeesContainer
                participantsLength={
                    participants.filter((participant) => JSON.parse(participant.identity).role !== "Witness").length
                }
            >
                {participants
                    .filter((participant) => isBreakroom || JSON.parse(participant.identity).role !== "Witness")
                    .map((participant: RemoteParticipant, i) => (
                        <StyledParticipantContainer key={participant.sid} ref={i === 0 ? participantContainer : null}>
                            <Participant
                                participant={participant}
                                isMuted={!!participantsStatus[JSON.parse(participant.identity)?.email]?.isMuted}
                            />
                        </StyledParticipantContainer>
                    ))}
            </StyledAttendeesContainer>
        </StyledVideoConference>
    );
};

export default VideoConference;
