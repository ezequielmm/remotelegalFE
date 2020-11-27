import React from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import { useDataTrack, useVideoChatRef } from "../../../hooks/VideoChat/hooks";
import { StyledParticipantMask, StyledIdentityBox } from "./styles";
import Text from "../../../components/Typography/Text";

const Participant = ({ participant }: { participant: LocalParticipant | RemoteParticipant }) => {
    const { videoRef, audioRef, dataTracks } = useVideoChatRef(participant);

    useDataTrack(dataTracks);

    return (
        <StyledParticipantMask>
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            <StyledIdentityBox>
                <Text size="small" weight="bold" state="white">
                    {participant.identity}
                </Text>
            </StyledIdentityBox>
        </StyledParticipantMask>
    );
};

export default Participant;
