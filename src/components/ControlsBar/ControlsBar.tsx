import React, { ReactElement, useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";
import Badge from "prp-components-library/src/components/Badge";
import Button from "prp-components-library/src/components/Button";
import Confirm from "prp-components-library/src/components/Confirm";
import Dropdown from "prp-components-library/src/components/Dropdown";
import Icon from "prp-components-library/src/components/Icon";
import Menu from "prp-components-library/src/components/Menu";
import Popover from "prp-components-library/src/components/Popover";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import { ThemeProvider } from "styled-components";
import { Row, Col } from "antd";
import { LocalAudioTrack, LocalParticipant, LocalVideoTrack } from "twilio-video";
import { ReactComponent as ArrowIcon } from "../../assets/general/Arrow.svg";
import { ReactComponent as ChatIcon } from "../../assets/icons/comment_icon.svg";
import { ReactComponent as SettingsIcon } from "../../assets/in-depo/settings.svg";
import { ReactComponent as BreakroomsIcon } from "../../assets/in-depo/Breakrooms.svg";
import { ReactComponent as CameraOffIcon } from "../../assets/in-depo/Camera.off.svg";
import { ReactComponent as CameraOnIcon } from "../../assets/in-depo/Camera.on.svg";
import { ReactComponent as EndCallIcon } from "../../assets/in-depo/End.call.svg";
import { ReactComponent as ExhibitsIcon } from "../../assets/in-depo/Exhibits.svg";
import { ReactComponent as MuteIcon } from "../../assets/in-depo/Mute.svg";
import { ReactComponent as PauseIcon } from "../../assets/in-depo/Pause.svg";
import { ReactComponent as RealTimeIcon } from "../../assets/in-depo/Real.time.svg";
import { ReactComponent as RecordIcon } from "../../assets/in-depo/Record.svg";
import { ReactComponent as SummaryIcon } from "../../assets/in-depo/Summary.svg";
import { ReactComponent as SupportIcon } from "../../assets/in-depo/Support.svg";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import { ReactComponent as KebebHorizontalIcon } from "../../assets/icons/kebeb.horizontal.svg";
import { ReactComponent as KebebIcon } from "../../assets/icons/kebeb.svg";
import { ReactComponent as LockIcon } from "../../assets/icons/Lock.svg";
import * as CONSTANTS from "../../constants/inDepo";
import { theme } from "../../constants/styles/theme";
import { getREM } from "../../constants/styles/utils";
import { useAuthentication } from "../../hooks/auth";
import useChat from "../../hooks/InDepo/useChat";
import useEndDepo from "../../hooks/InDepo/useEndDepo";
import useJoinDepositionLink from "../../hooks/InDepo/useJoinDepositionLink";
import { useSendParticipantStatus } from "../../hooks/InDepo/useParticipantStatus";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import useRecording from "../../hooks/InDepo/useRecording";
import useTracksStatus from "../../hooks/InDepo/useTracksStatus";
import useStreamAudio from "../../hooks/useStreamAudio";
import { BreakroomModel } from "../../models";
import Chat from "../../routes/InDepo/Chat";
import ColorStatus from "../../types/ColorStatus";
import { ThemeMode } from "../../types/ThemeType";
import Control from "../Control/Control";
import Logo from "../Logo";
import CopyLink from "./components/CopyLink";
import EndDepoModal from "./components/EndDepoModal";
import getLeaveModalTextContent from "./helpers/getLeaveModalTextContent";
import {
    LockedMenuItem,
    StyledComposedIconContainer,
    StyledContainer,
    StyledLogo,
    StyledMoreWrapper,
    StyledDrawer,
    StyledDrawerSpace,
    StyledEndButton,
} from "./styles";
import HelpModal from "./components/HelpModal";
import TroubleShootDevicesModal from "../../routes/TroubleShootUserDevices/components/TroubleShootDevicesModal";
import useWindowSize from "../../hooks/useWindowSize";

interface IControlsBar {
    breakrooms?: BreakroomModel.Breakroom[];
    canJoinToLockedBreakroom?: boolean;
    disableBreakrooms?: boolean;
    disableChat?: boolean;
    isPreDepo?: boolean;
    canRecord: boolean;
    leaveWithoutModal?: boolean;
    canEnd: boolean;
    localParticipant: LocalParticipant;
    exhibitsOpen: boolean;
    togglerExhibits: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    realTimeOpen: boolean;
    isRecording: boolean;
    togglerRealTime: React.Dispatch<React.SetStateAction<boolean>> | ((value: React.SetStateAction<boolean>) => void);
    handleJoinBreakroom?: (roomNumber: string) => void;
    initialAudioEnabled?: boolean;
    jobNumber?: string;
}

export default function ControlsBar({
    breakrooms,
    canJoinToLockedBreakroom = false,
    disableBreakrooms = false,
    disableChat = false,
    leaveWithoutModal = false,
    localParticipant,
    exhibitsOpen,
    togglerExhibits,
    realTimeOpen,
    isPreDepo,
    togglerRealTime,
    isRecording,
    canEnd,
    canRecord,
    handleJoinBreakroom,
    initialAudioEnabled,
    jobNumber,
}: IControlsBar): ReactElement {
    const { videoTracks, audioTracks } = useParticipantTracks(localParticipant);
    const { isAudioEnabled, isCameraEnabled, setAudioEnabled, setCameraEnabled } = useTracksStatus(
        audioTracks as LocalAudioTrack[],
        videoTracks as LocalVideoTrack[]
    );
    const { startPauseRecording, loadingStartPauseRecording } = useRecording(!isRecording);
    const [chatOpen, togglerChat] = useState(false);
    const [showSettings, setSettings] = useState(false);
    const [unreadedChats, setUnreadedChats] = useState(0);
    const [summaryOpen, togglerSummary] = useState(false);
    const [moreOpen, togglerMore] = useState(false);
    const [breakroomsOpen, togglerBreakrooms] = useState(false);
    const [endDepoModal, setEndDepoModal] = useState(false);
    const [helpModal, setHelpModal] = useState(false);
    const [breakroomModal, setBreakroomModal] = useState(false);
    const [openLeaveModal, setOpenLeaveModal] = useState(false);
    const { setEndDepo, loading } = useEndDepo();
    const joinDepositionLink = useJoinDepositionLink();
    const [sendToggledMuted] = useSendParticipantStatus();
    const isWitness = localParticipant && JSON.parse(localParticipant.identity)?.role === "Witness";
    const history = useHistory();
    const { isAuthenticated } = useAuthentication();
    const leaveModalTextContent = getLeaveModalTextContent(isRecording, isWitness);
    const [windowWidth] = useWindowSize();
    const [drawerVisible, setDrawerVisible] = useState(false);

    const toggleBreakrooms = () => togglerBreakrooms((prevState) => !prevState);
    const toggleChat = () => togglerChat((prevState) => !prevState);
    const toggleSummary = () => togglerSummary((prevState) => !prevState);
    const toggleMore = () => togglerMore((prevState) => !prevState);
    const toggleExhibits = () => togglerExhibits((prevState) => !prevState);
    const toggleRealTime = () => togglerRealTime((prevState) => !prevState);
    const toggleLeaveModal = () => setOpenLeaveModal((prevState) => !prevState);
    const toggleSettingsModal = useCallback(() => setSettings((showSettings) => !showSettings), []);

    const { messages, sendMessage, loadClient, loadingClient, errorLoadingClient } = useChat({
        chatOpen,
        setUnreadedChats,
        unreadedChats,
        disableChat,
    });

    const [newMessagePopUp, setNewMessagePopUp] = useState({
        unreadedChats,
        show: false,
    });

    const author = messages[messages.length - 1]?.state?.author;

    const newMessageObj = {
        lastMessage: messages[messages.length - 1]?.state?.body || "",
        author: (author && JSON.parse(messages[messages.length - 1]?.state?.author)?.name) || "",
    };

    useEffect(() => {
        let timer;
        if (unreadedChats > newMessagePopUp.unreadedChats) {
            setNewMessagePopUp((prevState) => ({ ...prevState, show: true }));
            timer = setTimeout(() => {
                setNewMessagePopUp((prevState) => ({
                    ...prevState,
                    show: false,
                    unreadedChats,
                }));
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [messages, newMessagePopUp.unreadedChats, unreadedChats]);

    useEffect(() => {
        if (chatOpen)
            setNewMessagePopUp((prevState) => ({
                ...prevState,
                show: false,
                unreadedChats: 0,
            }));
    }, [chatOpen]);

    useStreamAudio(isAudioEnabled, audioTracks, isPreDepo);

    const handleRedirection = () => {
        return isWitness && !isAuthenticated
            ? history.push({
                  pathname: "/deposition/end",
                  state: { isWitness: true },
              })
            : history.push(
                  isAuthenticated
                      ? "/depositions"
                      : {
                            pathname: "/sign-up",
                            state: { email: JSON.parse(localParticipant.identity).email },
                        }
              );
    };
    const handleDrawerVisible = () => {
        setDrawerVisible(!drawerVisible);
    };

    React.useEffect(() => {
        if (initialAudioEnabled !== undefined) {
            setAudioEnabled(initialAudioEnabled);
        }
    }, [initialAudioEnabled, setAudioEnabled]);

    const summaryTheme = { ...theme, mode: ThemeMode.default };

    const composeBreakroomsIcon = (
        <StyledComposedIconContainer>
            <Icon icon={BreakroomsIcon} size="1.625rem" />
            <Icon icon={ArrowIcon} rotate={180} size="1.625rem" />
        </StyledComposedIconContainer>
    );

    const renderBreakrooms = () => {
        const menuItems = [];

        breakrooms.forEach((item, i) => {
            menuItems.push(
                item.isLocked ? (
                    <LockedMenuItem disabled $unsetDisabledCursor key="key-0">
                        <Space align="center" justify="space-between" size="large" fullWidth>
                            <Text block state={ColorStatus.disabled}>
                                {item.name}
                            </Text>
                            <Button
                                icon={<Icon icon={LockIcon} />}
                                disabled={!canJoinToLockedBreakroom}
                                data-testid="breakroom_locked"
                                type="link"
                                onClick={() => {
                                    toggleBreakrooms();
                                    if (isRecording) return setBreakroomModal(true);
                                    handleJoinBreakroom(item.id);
                                }}
                            >
                                LOCKED
                            </Button>
                        </Space>
                    </LockedMenuItem>
                ) : (
                    <Menu.Item disabled $unsetDisabledCursor key={item.id}>
                        <Space align="center" justify="space-between" size="large" fullWidth>
                            <Text block state={ColorStatus.white}>
                                {item.name}
                            </Text>
                            <Button
                                disabled={disableBreakrooms}
                                data-testid="join_breakroom"
                                onClick={() => {
                                    toggleBreakrooms();
                                    if (isRecording) return setBreakroomModal(true);
                                    handleJoinBreakroom(item.id);
                                }}
                                type="link"
                            >
                                {CONSTANTS.CONTROLS_BAR_JOIN_BUTTON}
                            </Button>
                        </Space>
                    </Menu.Item>
                )
            );
            if (breakrooms.length > i + 1) menuItems.push(<Menu.Divider key={`${item.id}divider`} />);
        });

        return menuItems;
    };

    return (
        <StyledContainer pl={6} pr={3} align="center" data-testid="controls_container">
            <TroubleShootDevicesModal onClose={toggleSettingsModal} isDepo visible={showSettings} />
            <Confirm
                visible={breakroomModal}
                title={CONSTANTS.BREAKROOM_ON_THE_RECORD_TITLE}
                subTitle={CONSTANTS.BREAKROOM_ON_THE_RECORD_MESSAGE}
                positiveLabel="Ok"
                onPositiveClick={() => setBreakroomModal(false)}
            />
            <Confirm
                visible={openLeaveModal}
                title={leaveModalTextContent.title}
                subTitle={leaveModalTextContent.subTitle}
                positiveLabel={leaveModalTextContent.positiveLabel}
                negativeLabel={leaveModalTextContent.negativeLabel}
                onNegativeClick={toggleLeaveModal}
                onPositiveClick={() => {
                    toggleLeaveModal();
                    return isRecording && isWitness ? null : setTimeout(handleRedirection, 500);
                }}
            />
            <EndDepoModal
                endDepoFunc={() => {
                    setEndDepoModal(false);
                    return setEndDepo(true);
                }}
                visible={endDepoModal}
                closeModal={() => setEndDepoModal(false)}
            />
            <HelpModal visible={helpModal} jobNumber={jobNumber} closeModal={() => setHelpModal(false)} />
            {windowWidth >= parseInt(theme.default.breakpoints.sm, 10) && (
                <Space.Item flex="1 0 0">
                    <StyledLogo>
                        <Logo version="light" height="100%" />
                    </StyledLogo>
                </Space.Item>
            )}
            <Space.Item flex="1 0 0" fullHeight>
                <Space size={4} justify="center" align="center" fullHeight>
                    <Control
                        data-testid="audio"
                        type="circle"
                        onClick={() => {
                            setAudioEnabled(!isAudioEnabled);
                            sendToggledMuted(isAudioEnabled);
                        }}
                        isActive={isAudioEnabled}
                        icon={
                            isAudioEnabled ? (
                                <Icon data-testid="unmuted" icon={UnmuteIcon} size="1.625rem" />
                            ) : (
                                <Icon data-testid="muted" icon={MuteIcon} size="1.625rem" />
                            )
                        }
                    />
                    <Control
                        data-testid="camera"
                        type="circle"
                        onClick={() => setCameraEnabled(!isCameraEnabled)}
                        isActive={isCameraEnabled}
                        icon={
                            isCameraEnabled ? (
                                <Icon data-testid="camerashown" icon={CameraOnIcon} size="1.625rem" />
                            ) : (
                                <Icon data-testid="camerahidden" icon={CameraOffIcon} size="1.625rem" />
                            )
                        }
                    />
                    {windowWidth >= parseInt(theme.default.breakpoints.sm, 10) && canRecord && (
                        <Control
                            disabled={loadingStartPauseRecording}
                            data-testid="record"
                            isActive={isRecording}
                            onClick={startPauseRecording}
                            type="rounded"
                            label={
                                isRecording
                                    ? CONSTANTS.CONTROLS_BAR_OFF_THE_RECORD_LABEL
                                    : CONSTANTS.CONTROLS_BAR_ON_THE_RECORD_LABEL
                            }
                            icon={
                                isRecording ? (
                                    <Icon icon={PauseIcon} size="1.625rem" />
                                ) : (
                                    <Icon icon={RecordIcon} size="1.625rem" />
                                )
                            }
                        />
                    )}

                    {windowWidth >= parseInt(theme.default.breakpoints.sm, 10) && canEnd && (
                        <Control
                            data-testid="end"
                            onClick={() => {
                                if (loading) {
                                    return;
                                }
                                setEndDepoModal(true);
                            }}
                            type="rounded"
                            color="red"
                            label={CONSTANTS.CONTROLS_BAR_END_LABEL}
                            icon={<Icon icon={EndCallIcon} size="1.625rem" />}
                        />
                    )}
                </Space>
            </Space.Item>
            {windowWidth >= parseInt(theme.default.breakpoints.sm, 10) ? (
                <Space.Item flex="1 0 0" fullHeight>
                    <Space justify="flex-end" align="center" fullHeight>
                        <Space align="center">
                            <Control
                                data-testid="exhibits"
                                isActive={exhibitsOpen}
                                onClick={toggleExhibits}
                                type="simple"
                                label={CONSTANTS.CONTROLS_BAR_EXHIBITS_LABEL}
                                icon={<Icon icon={ExhibitsIcon} size="1.625rem" />}
                            />
                            <Control
                                data-testid="realtime"
                                isActive={realTimeOpen}
                                onClick={toggleRealTime}
                                type="simple"
                                label={CONSTANTS.CONTROLS_BAR_REAL_TIME_LABEL}
                                icon={<Icon icon={RealTimeIcon} size="1.625rem" />}
                            />
                            {breakrooms && !!breakrooms.length && (
                                <Dropdown
                                    onVisibleChange={toggleBreakrooms}
                                    visible={breakroomsOpen}
                                    overlay={<Menu>{renderBreakrooms()}</Menu>}
                                    arrow
                                    styled
                                    placement="topRight"
                                    trigger={["click"]}
                                >
                                    <Control
                                        data-testid="breakrooms"
                                        isActive={breakroomsOpen}
                                        type="simple"
                                        label={CONSTANTS.CONTROLS_BAR_BREAKROOMS_LABEL}
                                        icon={composeBreakroomsIcon}
                                    />
                                </Dropdown>
                            )}
                            {!disableChat && (
                                <Popover
                                    overlay={
                                        <Space size="0" direction="vertical">
                                            <Text weight="bold" state={ColorStatus.white}>
                                                {newMessageObj.author}
                                            </Text>
                                            <Text state={ColorStatus.white}>{newMessageObj.lastMessage}</Text>
                                        </Space>
                                    }
                                    trigger="click"
                                    dataTestId={CONSTANTS.POPOVER_NEW_MESSAGE}
                                    visible={newMessagePopUp.show}
                                    closable
                                    onClose={() =>
                                        setNewMessagePopUp((prevState) => ({
                                            ...prevState,
                                            show: false,
                                            unreadedChats,
                                        }))
                                    }
                                >
                                    <Dropdown
                                        dataTestId={CONSTANTS.CHAT_DROPDOWN_TEST_ID}
                                        overlay={
                                            <ThemeProvider theme={summaryTheme}>
                                                <Chat
                                                    closePopOver={toggleChat}
                                                    open={chatOpen}
                                                    height={getREM(theme.default.spaces[6] * 28)}
                                                    messages={messages}
                                                    sendMessage={sendMessage}
                                                    loadClient={loadClient}
                                                    loadingClient={loadingClient}
                                                    errorLoadingClient={errorLoadingClient}
                                                />
                                            </ThemeProvider>
                                        }
                                        placement="topCenter"
                                        onVisibleChange={toggleChat}
                                        visible={chatOpen}
                                        trigger={["click"]}
                                        arrow
                                        styled
                                        overlayStyle={{ width: getREM(theme.default.spaces[6] * 23) }}
                                        theme={summaryTheme}
                                    >
                                        <Control
                                            data-testid={CONSTANTS.CHAT_CONTROL_TEST_ID}
                                            isActive={chatOpen}
                                            type="simple"
                                            label={CONSTANTS.CONTROLS_BAR_CHAT_LABEL}
                                            icon={
                                                <Badge
                                                    data-testid={CONSTANTS.UNREADED_CHATS_TEST_ID}
                                                    count={unreadedChats}
                                                    size="small"
                                                    color={ColorStatus.error}
                                                    rounded
                                                >
                                                    <Icon icon={ChatIcon} size="1.625rem" />
                                                </Badge>
                                            }
                                        />
                                    </Dropdown>
                                </Popover>
                            )}
                            <Dropdown
                                dataTestId="summary_button"
                                overlay={<CopyLink closePopOver={toggleSummary} link={joinDepositionLink} />}
                                placement="topRight"
                                onVisibleChange={toggleSummary}
                                visible={summaryOpen}
                                trigger={["click"]}
                                arrow
                                styled
                                overlayStyle={{ width: getREM(theme.default.spaces[6] * 23) }}
                                theme={summaryTheme}
                            >
                                <Control
                                    isActive={summaryOpen}
                                    type="simple"
                                    label={CONSTANTS.CONTROLS_BAR_SUMMARY_LABEL}
                                    icon={<Icon icon={SummaryIcon} size="1.625rem" />}
                                />
                            </Dropdown>
                            <Dropdown
                                dataTestId="more_dropdown"
                                onVisibleChange={toggleMore}
                                visible={moreOpen}
                                overlay={
                                    <Menu selectable={false}>
                                        <Menu.Item key="0" onClick={() => setHelpModal(true)}>
                                            <Button
                                                icon={<Icon icon={SupportIcon} size={8} color={ColorStatus.white} />}
                                                data-testid="support_button"
                                                type="link"
                                            >
                                                <Text state={ColorStatus.white} size="small">
                                                    {CONSTANTS.CONTROLS_BAR_SUPPORT_LABEL}
                                                </Text>
                                            </Button>
                                        </Menu.Item>
                                        <Menu.Item key="1" onClick={toggleSettingsModal}>
                                            <Button
                                                icon={<Icon icon={SettingsIcon} size={8} color={ColorStatus.white} />}
                                                data-testid="settings_button"
                                                type="link"
                                            >
                                                <Text state={ColorStatus.white} size="small">
                                                    {CONSTANTS.CONTROLS_BAR_SETTINGS_LABEL}
                                                </Text>
                                            </Button>
                                        </Menu.Item>
                                    </Menu>
                                }
                                arrow
                                styled
                                overlayStyle={{ width: getREM(theme.default.spaces[6] * 10) }}
                                placement="topRight"
                                trigger={["click"]}
                            >
                                <Control
                                    data-testid="more_control"
                                    isActive={moreOpen}
                                    type="simple"
                                    label={CONSTANTS.CONTROLS_BAR_MORE_LABEL}
                                    icon={<Icon icon={KebebHorizontalIcon} size="1.625rem" />}
                                />
                            </Dropdown>
                        </Space>
                        {!canEnd && !canRecord && (
                            <Control
                                data-testid={CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID}
                                isActive={openLeaveModal}
                                color="red"
                                type="simple"
                                onClick={() => (leaveWithoutModal ? handleRedirection() : toggleLeaveModal())}
                                label={CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON}
                                icon={
                                    <Space px={4}>
                                        <Icon icon={BreakroomsIcon} size="1.625rem" />
                                    </Space>
                                }
                            />
                        )}
                    </Space>
                </Space.Item>
            ) : (
                <>
                    <StyledMoreWrapper>
                        <Control
                            isActive
                            type="circle"
                            icon={<Icon icon={KebebIcon} color={theme.default.whiteColor} size="1.625rem" />}
                            onClick={handleDrawerVisible}
                        />
                    </StyledMoreWrapper>
                    <StyledDrawer
                        visible={drawerVisible}
                        onClose={handleDrawerVisible}
                        closable={false}
                        placement="bottom"
                        height="auto"
                        footer={
                            <StyledEndButton
                                size="middle"
                                icon={<Icon icon={BreakroomsIcon} size={6} color={theme.default.whiteColor} />}
                            >
                                Leave Deposition
                            </StyledEndButton>
                        }
                    >
                        <StyledDrawerSpace fullWidth align="center">
                            <Row style={{ width: "100%" }}>
                                <Col xs={8}>
                                    <Control
                                        data-testid="exhibits_mobile"
                                        isActive={exhibitsOpen}
                                        onClick={toggleExhibits}
                                        type="simple"
                                        label={CONSTANTS.CONTROLS_BAR_EXHIBITS_LABEL}
                                        icon={<Icon icon={ExhibitsIcon} size="1.625rem" />}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Control
                                        data-testid="breakrooms"
                                        isActive={breakroomsOpen}
                                        type="simple"
                                        label={CONSTANTS.CONTROLS_BAR_BREAKROOMS_LABEL}
                                        icon={composeBreakroomsIcon}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Control
                                        data-testid={CONSTANTS.CHAT_CONTROL_TEST_ID}
                                        isActive={chatOpen}
                                        type="simple"
                                        label={CONSTANTS.CONTROLS_BAR_CHAT_LABEL}
                                        icon={
                                            <Badge
                                                data-testid={CONSTANTS.UNREADED_CHATS_TEST_ID}
                                                count={unreadedChats}
                                                size="small"
                                                color={ColorStatus.error}
                                                rounded
                                            >
                                                <Icon icon={ChatIcon} size="1.625rem" />
                                            </Badge>
                                        }
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Control
                                        isActive={summaryOpen}
                                        type="simple"
                                        label={CONSTANTS.CONTROLS_BAR_SUMMARY_LABEL}
                                        icon={<Icon icon={SummaryIcon} size="1.625rem" />}
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Control
                                        data-testid="more_control"
                                        isActive={moreOpen}
                                        type="simple"
                                        label={CONSTANTS.CONTROLS_BAR_MORE_LABEL}
                                        icon={<Icon icon={KebebHorizontalIcon} size="1.625rem" />}
                                    />
                                </Col>
                            </Row>
                        </StyledDrawerSpace>
                    </StyledDrawer>
                </>
            )}
        </StyledContainer>
    );
}
