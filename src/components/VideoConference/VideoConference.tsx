import React from "react";
import { RemoteParticipant, Room } from "twilio-video";
import Participant from "../../routes/VideoChat/Participant";
import {
    StyledVideoConference,
    StyledDeponentContainer,
    StyledAttendeesContainer,
    StyledParticipantContainer,
} from "./styles";

declare interface IVideoConferenceProps {
    deponent: Room["localParticipant"];
    antendees: Room["participants"];
    layoutSize: number;
}

const VideoConference = ({ deponent, antendees, layoutSize }: IVideoConferenceProps) => {
    const videoLayoutClass = () => {
        if (layoutSize === 2) return "vertical";
        if (layoutSize === 1) return "grid";
        return "";
    };

    return (
        <StyledVideoConference className={videoLayoutClass()}>
            <StyledDeponentContainer>
                <Participant participant={deponent} />
            </StyledDeponentContainer>
            <StyledAttendeesContainer>
                {Array.from(antendees.values()).map((participant: RemoteParticipant) => (
                    <StyledParticipantContainer>
                        <Participant key={participant.sid} participant={participant} />
                    </StyledParticipantContainer>
                ))}
            </StyledAttendeesContainer>
        </StyledVideoConference>
    );
};

export default VideoConference;
