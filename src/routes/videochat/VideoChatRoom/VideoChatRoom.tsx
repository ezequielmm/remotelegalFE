import React from "react";
import { RemoteParticipant, Room } from "twilio-video";
import { Button } from "antd";
import Participant from "../Participant/Participant";
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
                <Button onClick={handleLogout}>Disconnect</Button>
            </StyledRoomFooter>
        </StyledInDepoContainer>
    );
};

export default VideoChatRoom;
