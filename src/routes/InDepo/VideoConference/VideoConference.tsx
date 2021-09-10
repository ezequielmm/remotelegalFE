import { useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteParticipant, Room } from "twilio-video";
import { useGetParticipantStatus } from "../../../hooks/InDepo/useParticipantStatus";
import { TimeZones } from "../../../models/general";
import Participant from "../Participant";
import {
    StyledVideoConference,
    StyledVideoConferenceWrapper,
    StyledDeponentContainer,
    StyledAttendeesContainer,
    StyledParticipantContainer,
} from "./styles";
import AspectRatio from "../../../assets/in-depo/aspect-ratio-16-8.svg";

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
    const { participantsStatus } = useGetParticipantStatus();
    const participants = [localParticipant, ...Array.from(attendees.values())];
    const witness = participants.find((participant) => JSON.parse(participant.identity).role === "Witness");
    const participantsFiltered = participants.filter(
        (participant) => isBreakroom || JSON.parse(participant.identity).role !== "Witness"
    );

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
        <StyledVideoConferenceWrapper layout={layoutClass}>
            <StyledVideoConference
                className={`${layoutClass} ${isBreakroom ? "breakrooms" : ""}`}
                ref={videoConferenceContainer}
                show={atendeesVisibility}
            >
                {!isBreakroom && (
                    <StyledDeponentContainer isSingle={isBreakroom && participants.length === 1}>
                        <Participant
                            isLocal={
                                isBreakroom
                                    ? participants[1]?.sid === localParticipant.sid
                                    : witness?.sid === localParticipant.sid
                            }
                            timeZone={timeZone}
                            participant={witness}
                            isWitness
                            isVideoOnly={layoutClass === "default"}
                            isMuted={
                                enableMuteUnmute &&
                                !!(witness && participantsStatus[JSON.parse(witness?.identity)?.email]?.isMuted)
                            }
                        />
                    </StyledDeponentContainer>
                )}
                <StyledAttendeesContainer
                    participantsLength={participantsFiltered.length}
                    layout={layoutClass}
                    isBreakroom={isBreakroom}
                >
                    {participantsFiltered.map((participant: RemoteParticipant, i) => (
                        <StyledParticipantContainer
                            key={participant.sid}
                            ref={i === 0 ? participantContainer : null}
                            participantsLength={participantsFiltered.length}
                            layout={layoutClass}
                            isBreakrooms={isBreakroom}
                        >
                            <Participant
                                isLocal={participant?.sid === localParticipant?.sid}
                                isMuted={
                                    enableMuteUnmute &&
                                    !!participantsStatus[JSON.parse(participant.identity)?.email]?.isMuted
                                }
                                participant={participant}
                                isVideoOnly={layoutClass === "default"}
                                isSingle={participantsFiltered.length === 1}
                            />
                        </StyledParticipantContainer>
                    ))}
                </StyledAttendeesContainer>
            </StyledVideoConference>
            <img src={AspectRatio} alt="16/8" className="aspect-ratio" />
        </StyledVideoConferenceWrapper>
    );
};

export default VideoConference;
