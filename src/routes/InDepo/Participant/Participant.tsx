import React, { useContext, useEffect, useState } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import useDataTrack from "../../../hooks/InDepo/useDataTrack";
import useParticipantTracks from "../../../hooks/InDepo/useParticipantTracks";
import { TimeZones } from "../../../models/general";
import Clock from "../../../components/Clock";
import Text from "../../../components/Typography/Text";
import { StyledIdentityBox, StyledParticipantMask, StyledTimeBox } from "./styles";
import ColorStatus from "../../../types/ColorStatus";
import { theme } from "../../../constants/styles/theme";
import { GlobalStateContext } from "../../../state/GlobalState";

const Participant = ({
    timeZone,
    participant,
    isWitness,
}: {
    timeZone?: TimeZones;
    participant: LocalParticipant | RemoteParticipant;
    isWitness?: boolean;
}) => {
    const { videoRef, audioRef, dataTracks } = useParticipantTracks(participant);
    const [hasBorder, setHasBorder] = useState(false);
    const { state } = useContext(GlobalStateContext);
    const { dominantSpeaker } = state.room;
    const identity = participant && JSON.parse(participant.identity);
    useDataTrack(dataTracks);

    useEffect(() => {
        const setParticipantBorder = () => {
            if (!participant) {
                return;
            }
            if (dominantSpeaker?.sid === participant.sid) {
                setHasBorder(true);
            }
        };
        setParticipantBorder();
        return () => participant && setHasBorder(false);
    }, [dominantSpeaker, participant]);

    const normalizedRoles = {
        CourtReporter: "Court Reporter",
        TechExpert: "Tech Expert",
    };

    return (
        <StyledParticipantMask highlight={hasBorder}>
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            {timeZone && (
                <StyledTimeBox>
                    <Clock timeZone={timeZone} />
                </StyledTimeBox>
            )}
            <StyledIdentityBox>
                {isWitness && (
                    <Text
                        data-testid="participant_name"
                        size="small"
                        lineHeight={theme.default.spaces[8]}
                        weight="bold"
                        state={ColorStatus.white}
                    >
                        {isWitness && identity ? identity.name || "Guest" : "waiting for witness"}
                    </Text>
                )}
                {!isWitness && (
                    <Text
                        data-testid="participant_name"
                        size="small"
                        lineHeight={theme.default.spaces[8]}
                        weight="bold"
                        state={ColorStatus.white}
                    >
                        {!isWitness ? identity?.name : "Guest"}
                    </Text>
                )}
                <Text
                    data-testid="participant_role"
                    size="small"
                    lineHeight={theme.default.spaces[8]}
                    state={ColorStatus.white}
                >
                    {identity && normalizedRoles[identity.role] ? normalizedRoles[identity.role] : identity?.role}
                </Text>
            </StyledIdentityBox>
        </StyledParticipantMask>
    );
};

export default Participant;
