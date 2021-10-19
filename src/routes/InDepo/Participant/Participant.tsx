import { useContext, useEffect, useState } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import { datadogLogs } from "@datadog/browser-logs";
import Dropdown from "prp-components-library/src/components/Dropdown";
import Menu from "prp-components-library/src/components/Menu";
import Button from "prp-components-library/src/components/Button";
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
    StyledParticipantOptions,
    StyledTimeBox,
    StyledOptionsIcon,
} from "./styles";
import ColorStatus from "../../../types/ColorStatus";
import { theme } from "../../../constants/styles/theme";
import { GlobalStateContext } from "../../../state/GlobalState";
import { ReactComponent as MuteIcon } from "../../../assets/in-depo/Participant.muted.svg";
import AspectRatio from "../../../assets/in-depo/participant-16-9.svg";
import normalizedRoles from "../../../constants/roles";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";
import { ReactComponent as kebebIcon } from "../../../assets/icons/kebeb.horizontal.svg";
import { ReactComponent as EditIcon } from "../../../assets/icons/edit.svg";
import { Roles } from "../../../models/participant";
import { IIdentity } from "../../../constants/identity";

const Participant = ({
    timeZone,
    participant,
    isWitness,
    isMuted = false,
    isLocal,
    isSingle,
    isVideoOnly = false,
    onEditParticipantRole = null,
    canUserEditParticipantRole = false,
}: {
    isLocal?: boolean;
    timeZone?: TimeZones;
    participant: LocalParticipant | RemoteParticipant;
    isWitness?: boolean;
    isMuted?: boolean;
    isSingle?: boolean;
    isVideoOnly?: boolean;
    onEditParticipantRole?: (identity: IIdentity) => void;
    canUserEditParticipantRole?: boolean;
}) => {
    const { videoRef, audioRef, dataTracks, netWorkLevel } = useParticipantTracks(participant);
    const [timeAlert, setTimeAlert] = useState(0);
    const [hasBorder, setHasBorder] = useState(false);
    const [shouldShowChangeRoleOptions, setShouldShowChangeRoleOptions] = useState(false);
    const [isMouseHover, setIsMouseHover] = useState(false);
    const { state } = useContext(GlobalStateContext);
    const { dominantSpeaker, depoRoomReconnecting } = state.room;
    useDataTrack(dataTracks);
    const addFloatingAlert = useFloatingAlertContext();
    const identity = participant && JSON.parse(participant.identity);

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
        if (netWorkLevel <= 2 && netWorkLevel !== null && isLocal && timeAlert === 0 && !depoRoomReconnecting) {
            setTimeAlert(CONSTANTS.NETWORK_QUALITY_TIME_SECONDS);
            datadogLogs.logger.info("Network quality low", { netWorkLevel, user: identity });
            const args = {
                message: CONSTANTS.CONNECTION_UNSTABLE,
                type: "info",
                duration: 3,
            };
            addFloatingAlert(args, true);
        }
    }, [netWorkLevel, addFloatingAlert, identity, isLocal, timeAlert, depoRoomReconnecting]);

    useEffect(() => {
        setShouldShowChangeRoleOptions(
            canUserEditParticipantRole &&
                identity?.role !== Roles.courtReporter &&
                !identity?.isAdmin &&
                isMouseHover &&
                participant !== undefined
        );
    }, [canUserEditParticipantRole, identity, isMouseHover, participant]);

    const menu = () => (
        <Menu>
            <Menu.Item key="0">
                <Button
                    data-testid="option_edit_participant_button"
                    type="link"
                    icon={<Icon icon={EditIcon} size={8} style={{ color: "white" }} />}
                    onClick={() => onEditParticipantRole(identity)}
                >
                    <Text state={ColorStatus.white} size="small">
                        Edit Participant
                    </Text>
                </Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <StyledParticipantMask
            highlight={hasBorder}
            isSingle={isSingle}
            isVideoOnly={isVideoOnly}
            isWitness={isWitness}
            data-testid="participant-mask"
            onMouseEnter={() => setIsMouseHover(true)}
            onMouseLeave={() => setIsMouseHover(false)}
        >
            <img src={AspectRatio} alt="16/9" className="aspect-ratio" />
            <video ref={videoRef} autoPlay />
            <audio ref={audioRef} autoPlay />
            {timeZone && (
                <StyledTimeBox>
                    <Clock timeZone={timeZone} />
                </StyledTimeBox>
            )}
            {shouldShowChangeRoleOptions && (
                <StyledParticipantOptions>
                    <Dropdown
                        overlay={menu()}
                        trigger={["click"]}
                        styled
                        arrow
                        placement="bottomRight"
                        dataTestId="dropdown_options"
                    >
                        <StyledOptionsIcon icon={kebebIcon} size={9} />
                    </Dropdown>
                </StyledParticipantOptions>
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
