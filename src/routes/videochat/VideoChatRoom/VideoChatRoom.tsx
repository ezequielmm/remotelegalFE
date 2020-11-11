import React from "react";
import { RemoteParticipant, Room } from "twilio-video";
import Participant from "../Participant/Participant";
import ControlsBar from "../../../components/ControlsBar/ControlsBar";
import {
    StyledParticipantContainer,
    StyledInDepoLayout,
    StyledVideoConference,
    StyledAttendeesContainer,
    StyledDeponentContainer,
    StyledInDepoContainer,
    StyledRoomFooter,
} from "./styles";

const VideoChatRoom = ({ room, handleLogout }: { room: Room; handleLogout: (ev: any) => any }) => {
    return (
        <StyledInDepoContainer>
            <StyledInDepoLayout>
                <StyledVideoConference>
                    <StyledDeponentContainer>
                        <Participant participant={room.localParticipant} />
                    </StyledDeponentContainer>
                    <StyledAttendeesContainer>
                        {Array.from(room.participants.values()).map((participant: RemoteParticipant) => (
                            <StyledParticipantContainer>
                                <Participant key={participant.sid} participant={participant} />
                            </StyledParticipantContainer>
                        ))}
                    </StyledAttendeesContainer>
                </StyledVideoConference>
            </StyledInDepoLayout>
            <StyledRoomFooter>
                <ControlsBar room={room} onEndCall={handleLogout} />
            </StyledRoomFooter>
        </StyledInDepoContainer>
    );
};

export default VideoChatRoom;
