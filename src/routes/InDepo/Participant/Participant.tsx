import { useContext, useEffect, useState } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import { datadogLogs } from "@datadog/browser-logs";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import useDataTrack from "../../../hooks/InDepo/useDataTrack";
import useParticipantTracks from "../../../hooks/InDepo/useParticipantTracks";
import { TimeZones } from "../../../models/general";
import Clock from "../../../components/Clock";
import * as CONSTANTS from "../../../constants/inDepo";
import {
    StyledIdentityBox,
    StyledNetworkQuality,
    StyledParticipantMask,
    StyledParticipantMicContainer,
    StyledTimeBox,
} from "./styles";
import ColorStatus from "../../../types/ColorStatus";
import { theme } from "../../../constants/styles/theme";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ReactComponent as MuteIcon } from "../../../assets/in-depo/Participant.muted.svg";
import AspectRatio from "../../../assets/in-depo/aspect-ratio-16-9.svg";
import normalizedRoles from "../../../constants/roles";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

const Participant = ({
    timeZone,
    participant,
    isWitness,
    isMuted = false,
    isLocal,
    isSingle,
}: {
    isLocal?: boolean;
    timeZone?: TimeZones;
    participant: LocalParticipant | RemoteParticipant;
    isWitness?: boolean;
    isMuted?: boolean;
    isSingle?: boolean;
}) => {
    const { videoRef, audioRef, dataTracks, netWorkLevel } = useParticipantTracks(participant);
    const [timeAlert, setTimeAlert] = useState(0);
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

    useEffect(() => {
        let interval;
        if (isLocal) {
            interval = setInterval(() => {
                if (timeAlert > 0) {
                    setTimeAlert(timeAlert - 1);
                }
                return null;
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [timeAlert, isLocal]);

    useEffect(() => {
        if (netWorkLevel <= 2 && netWorkLevel !== null && isLocal && timeAlert === 0) {
            setTimeAlert(CONSTANTS.NETWORK_QUALITY_TIME_SECONDS);
            datadogLogs.logger.info("Network quality low", { netWorkLevel, user: identity });
            const args = {
                message: CONSTANTS.CONNECTION_UNSTABLE,
                type: "info",
                duration: 3,
            };
            addFloatingAlert(args, true);
        }
    }, [netWorkLevel, addFloatingAlert, identity, isLocal, timeAlert]);

    return (
        <StyledParticipantMask highlight={hasBorder} isWitness={isWitness} isSingle={isSingle}>
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            <img src={AspectRatio} alt="16/9" className="aspect-ratio" />
            {timeZone && (
                <StyledTimeBox>
                    <Clock timeZone={timeZone} />
                </StyledTimeBox>
            )}
            <StyledIdentityBox>
                <Space align="flex-end" justify="space-between">
                    <Space size={1}>
                        <StyledParticipantMicContainer showMicStatus={isMuted}>
                            <Icon
                                data-testid="participant_muted"
                                color={theme.default.whiteColor}
                                icon={MuteIcon}
                                size={9}
                            />
                        </StyledParticipantMicContainer>
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
                    </Space>
                    <StyledNetworkQuality
                        data-testid={CONSTANTS.NETWORK_INDICATOR_TEST_ID}
                        steps={5}
                        showInfo={false}
                        strokeColor={netWorkLevel <= 2 ? theme.default.warningColor : theme.default.whiteColor}
                        trailColor={theme.colors.disabled[6]}
                        percent={netWorkLevel * 20}
                        strokeWidth={theme.default.spaces[3] * theme.default.baseUnit}
                    />
                </Space>
            </StyledIdentityBox>
        </StyledParticipantMask>
    );
};

export default Participant;
