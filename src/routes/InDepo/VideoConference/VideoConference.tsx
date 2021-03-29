import React, { useContext, useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteParticipant, Room } from "twilio-video";
import { useGetParticipantStatus } from "../../../hooks/InDepo/useParticipantStatus";
import { TimeZones } from "../../../models/general";
import { GlobalStateContext } from "../../../state/GlobalState";
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
    enableMuteUnmute?: boolean;
}

const VideoConference = ({
    isBreakroom,
    attendees,
    timeZone,
    layoutSize,
    localParticipant,
    atendeesVisibility = true,
    enableMuteUnmute = false,
}: IVideoConferenceProps) => {
    const [layoutClass, setLayoutClass] = useState<TLayoutClass>(null);
    const participantContainer = useRef<HTMLDivElement>(null);
    const videoConferenceContainer = useRef<HTMLDivElement>(null);
    const participants = [localParticipant, ...Array.from(attendees.values())];
    const witness = participants.find((participant) => JSON.parse(participant.identity).role === "Witness");
    const { participantsStatus } = useGetParticipantStatus();

    const { state } = useContext(GlobalStateContext);
    const { dominantSpeaker } = state.room;
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

    const moveParticipantToFrontOfArray = (participantsArray) => {
        const participantsWithoutWitnessOrBreakrooms = participantsArray.filter(
            (participant) => isBreakroom || JSON.parse(participant.identity).role !== "Witness"
        );
        if (dominantSpeaker && JSON.parse(dominantSpeaker.identity).role !== "Witness") {
            const filteredParticipantArray = participantsWithoutWitnessOrBreakrooms.filter(
                (participant) => participant.sid !== dominantSpeaker.sid
            );

            const participantArrayWithDominantOnFront = [dominantSpeaker, ...filteredParticipantArray];
            return participantArrayWithDominantOnFront;
        }
        return participantsWithoutWitnessOrBreakrooms;
    };

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
                        isMuted={
                            enableMuteUnmute &&
                            !!(witness && participantsStatus[JSON.parse(witness?.identity)?.email]?.isMuted)
                        }
                    />
                </StyledDeponentContainer>
            )}
            <StyledAttendeesContainer
                participantsLength={
                    participants.filter((participant) => JSON.parse(participant.identity).role !== "Witness").length
                }
            >
                {moveParticipantToFrontOfArray(participants).map((participant: RemoteParticipant, i) => (
                    <StyledParticipantContainer key={participant.sid} ref={i === 0 ? participantContainer : null}>
                        <Participant
                            isMuted={
                                enableMuteUnmute &&
                                !!participantsStatus[JSON.parse(participant.identity)?.email]?.isMuted
                            }
                            participant={participant}
                        />
                    </StyledParticipantContainer>
                ))}
            </StyledAttendeesContainer>
        </StyledVideoConference>
    );
};

export default VideoConference;
