import React, { useContext, useEffect, useState } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
// import { datadogLogs } from "@datadog/browser-logs";
import useDataTrack from "../../../hooks/InDepo/useDataTrack";
import useParticipantTracks from "../../../hooks/InDepo/useParticipantTracks";
import { TimeZones } from "../../../models/general";
import Clock from "../../../components/Clock";
import Text from "../../../components/Typography/Text";
// import * as CONSTANTS from "../../../constants/inDepo";

import {
    StyledIdentityBox,
    // StyledNetworkQuality,
    StyledParticipantMask,
    StyledParticipantMicContainer,
    StyledTimeBox,
} from "./styles";
import ColorStatus from "../../../types/ColorStatus";
import { theme } from "../../../constants/styles/theme";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ReactComponent as MuteIcon } from "../../../assets/in-depo/Participant.muted.svg";

import Icon from "../../../components/Icon";
import Space from "../../../components/Space";
import normalizedRoles from "../../../constants/roles";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

const Participant = ({
    timeZone,
    participant,
    isWitness,
    isMuted = false,
    networkLevel,
}: {
    timeZone?: TimeZones;
    participant: LocalParticipant | RemoteParticipant;
    isWitness?: boolean;
    isMuted?: boolean;
    networkLevel?: number;
}) => {
    const { videoRef, audioRef, dataTracks } = useParticipantTracks(participant);
    const [hasBorder, setHasBorder] = useState(false);
    const { state } = useContext(GlobalStateContext);
    const { dominantSpeaker } = state.room;
    const identity = participant && JSON.parse(participant.identity);
    useDataTrack(dataTracks);
    const addFloatingAlert = useFloatingAlertContext();

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

    // useEffect(() => {
    //     if (networkLevel <= 2 && networkLevel !== null) {
    //         datadogLogs.logger.info("Network quality low", { networkLevel, user: identity });
    //         const args = {
    //             message: CONSTANTS.CONNECTION_UNSTABLE,
    //             type: "info",
    //             duration: 3,
    //         };
    //         addFloatingAlert(args);
    //     }
    // }, [networkLevel, addFloatingAlert, identity]);

    return (
        <StyledParticipantMask highlight={hasBorder}>
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            {timeZone && (
                <StyledTimeBox>
                    <Clock timeZone={timeZone} />
                </StyledTimeBox>
            )}
            <StyledIdentityBox showMicStatus={isMuted}>
                <Space align="center">
                    {isMuted && (
                        <StyledParticipantMicContainer>
                            <Icon
                                data-testid="participant_muted"
                                color={theme.default.whiteColor}
                                icon={MuteIcon}
                                size={9}
                            />
                        </StyledParticipantMicContainer>
                    )}
                    <Space direction="vertical" size="0">
                        {isWitness && (
                            <Text
                                data-testid="participant_name"
                                size="small"
                                lineHeight={theme.default.spaces[8]}
                                weight="bold"
                                state={ColorStatus.white}
                                block
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
                            {identity && normalizedRoles[identity.role]
                                ? normalizedRoles[identity.role]
                                : identity?.role}
                        </Text>
                    </Space>
                    {/* <div style={{ marginLeft: "auto" }}>
                        <StyledParticipantMicContainer style={{ color: "white" }}>
                            <StyledNetworkQuality
                                data-testid={CONSTANTS.NETWORK_INDICATOR_TEST_ID}
                                steps={5}
                                showInfo={false}
                                strokeColor={networkLevel <= 2 ? theme.default.warningColor : theme.default.whiteColor}
                                trailColor={theme.colors.disabled[6]}
                                percent={networkLevel * 20}
                                strokeWidth={theme.default.spaces[3] * theme.default.baseUnit}
                            />
                        </StyledParticipantMicContainer>
                    </div> */}
                </Space>
            </StyledIdentityBox>
        </StyledParticipantMask>
    );
};

export default Participant;
