import React from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import useDataTrack from "../../../hooks/InDepo/useDataTrack";
import useParticipantTracks from "../../../hooks/InDepo/useParticipantTracks";
import { TimeZones } from "../../../models/general";
import Clock from "../../../components/Clock";
import Text from "../../../components/Typography/Text";
import { StyledIdentityBox, StyledParticipantMask, StyledTimeBox } from "./styles";
import ColorStatus from "../../../types/ColorStatus";

const AspectRatio = require("../../../assets/in-depo/aspect-ratio-16-9.svg");

const Participant = ({
    timeZone,
    participant,
    isWitness,
}: {
    timeZone?: TimeZones;
    participant: LocalParticipant | RemoteParticipant;
    isWitness?: boolean;
}) => {
    const { videoDisabled, videoRef, audioRef, dataTracks } = useParticipantTracks(participant);
    const identity = participant && JSON.parse(participant.identity);
    useDataTrack(dataTracks);

    const normalizedRoles = {
        CourtReporter: "Court Reporter",
        TechExpert: "Tech Expert",
    };

    return (
        <StyledParticipantMask videoDisabled={videoDisabled}>
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            <img src={AspectRatio} alt="16/9" />
            {timeZone && (
                <StyledTimeBox>
                    <Clock timeZone={timeZone} />
                </StyledTimeBox>
            )}
            <StyledIdentityBox>
                {isWitness && (
                    <Text
                        data-testid="witness-name"
                        size="small"
                        lineHeight={1.25}
                        weight="bold"
                        state={ColorStatus.white}
                    >
                        {isWitness && identity ? identity.name || "Guest" : "waiting for witness"}
                    </Text>
                )}
                {!isWitness && (
                    <Text
                        data-testid="participant-name"
                        size="small"
                        lineHeight={1.25}
                        weight="bold"
                        state={ColorStatus.white}
                    >
                        {!isWitness ? identity?.name : "Guest"}
                    </Text>
                )}
                <Text data-testid="participant-role" size="small" lineHeight={1.25} state={ColorStatus.white}>
                    {identity && normalizedRoles[identity.role] ? normalizedRoles[identity.role] : identity?.role}
                </Text>
            </StyledIdentityBox>
        </StyledParticipantMask>
    );
};

export default Participant;
