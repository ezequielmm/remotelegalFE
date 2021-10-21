import React, { useRef, useEffect, useState, useContext } from "react";
import { Col } from "antd/lib/grid";
import Row from "antd/lib/row";
import styled, { ThemeProvider } from "styled-components";
import { Form } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Icon from "@rl/prp-components-library/src/components/Icon";
import Modal from "@rl/prp-components-library/src/components/Modal";
import { ModalSize } from "@rl/prp-components-library/src/components/Modal/Modal";
import { InputWrapper } from "@rl/prp-components-library/src/components/Input/styles";
import Select from "@rl/prp-components-library/src/components/Select";
import Space from "@rl/prp-components-library/src/components/Space";
import Title from "@rl/prp-components-library/src/components/Title";
import Divider from "@rl/prp-components-library/src/components/Divider";
import { useHistory, useParams } from "react-router";
import Drawer from "@rl/prp-components-library/src/components/Drawer";
import {
    createLocalVideoTrack,
    createLocalAudioTrack,
    Room,
    LocalVideoTrack,
    LocalAudioTrack,
    VideoTrack,
    AudioTrack,
} from "twilio-video";
import actions from "../../../state/InDepo/InDepoActions";
import * as CONSTANTS from "../../../constants/TroubleShootUserDevices";
import useUserTracks, { StreamOption, MediaStreamTypes } from "../../../hooks/userTracks/useUserTracks";
import Overlay from "./Overlay";
import TestVolume from "../../../components/TestVolume";
import TestVideo from "../../../components/TestVideo";
import SpeakerTestAudio from "../../../assets/sounds/SpeakerTestAudio.mp3";
import { ReactComponent as VolumeOnIcon } from "../../../assets/icons/volume-on.svg";
import changeSpeakers from "../../../helpers/changeSpeakers";
import { GlobalStateContext } from "../../../state/GlobalState";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";
import createDevices, { Device } from "../helpers/createDevices";
import trackpubsToTracks from "../../../helpers/trackPubsToTracks";
import { theme } from "../../../constants/styles/theme";
import { getREM } from "../../../constants/styles/utils";
import { breakpoints } from "../../../constants/styles/breakpoints";
import { ThemeMode } from "../../../types/ThemeType";
import useNotifyParticipantPresence from "../../../hooks/InDepo/useNotifyParticipantPresence";
import { useSendParticipantStatus } from "../../../hooks/InDepo/useParticipantStatus";
import { WindowSizeContext } from "../../../contexts/WindowSizeContext";

interface TroubleShootDevicesModalProps {
    isDepo?: boolean;
    visible?: boolean;
    onClose?: () => void;
    videoTracks?: VideoTrack[];
    audioTracks?: AudioTrack[];
    shouldUseCurrentStream?: boolean;
}
interface SettingsWrapperProps {
    children: React.ReactNode;
    isDepo: boolean;
    onClose: () => void;
    visible: boolean;
    widthMorethanLg: boolean;
}

const StyledCol = styled(Col)`
    > * {
        z-index: 1;
    }
`;

const StyledForm = styled(Form)`
    @media (max-width: ${breakpoints.sm}) {
        .ant-form-item {
            margin-bottom: ${getREM(theme.default.spaces[6])};
        }
    }
`;

const getMediaTracks = (tracks, type) =>
    tracks.filter((track) => track.kind === type).map((trackPublication) => trackPublication?.mediaStreamTrack);

const SettingsWrapper = ({ isDepo, children, onClose, visible, widthMorethanLg }: SettingsWrapperProps) => {
    return (
        <>
            {isDepo && !widthMorethanLg ? (
                <ThemeProvider theme={{ ...theme, mode: ThemeMode.default }}>
                    <Drawer visible={isDepo ? visible : true} onClose={onClose} placement="bottom" height="100%">
                        {children}
                    </Drawer>
                </ThemeProvider>
            ) : (
                <Modal
                    onCancel={onClose}
                    onlyBody
                    visible={visible}
                    destroyOnClose
                    closable={!!isDepo}
                    centered
                    mask={!!isDepo}
                    size={ModalSize.large}
                >
                    {children}
                </Modal>
            )}
        </>
    );
};

const TroubleShootDevicesModal = ({
    isDepo,
    visible = true,
    onClose,
    audioTracks = [],
    videoTracks = [],
    shouldUseCurrentStream = false,
}: TroubleShootDevicesModalProps) => {
    const {
        gettingTracks,
        options,
        selectedOptions,
        activeStreams,
        errors,
        setSelectedOptions,
        stopOldTrackAndSetNewTrack,
        loadUserStreams,
        stopExampleTrack,
    } = useUserTracks(visible, shouldUseCurrentStream);
    const [isMuted, setMuted] = useState(true);
    const history = useHistory();
    const { dispatch, state } = useContext(GlobalStateContext);
    const { mockDepoRoom, currentRoom, tracks, changeAudioDevice, depoRoomReconnecting } = state.room;
    const oldDevices = localStorage.getItem("selectedDevices") && JSON.parse(localStorage.getItem("selectedDevices"));
    const availableRoom: Room = currentRoom || mockDepoRoom;
    const { depositionID } = useParams<{ depositionID: string }>();
    const [cameraError, setCameraError] = useState(false);
    const [micError, setMicError] = useState(false);
    const [isCameraBlocked, setIsCameraBlocked] = useState(false);
    const [isVideoOff, setVideoOff] = useState(true);
    const [audioRef, setAudioRef] = useState<HTMLMediaElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [sendUserPresence, userPresenceLoading, userPresenceError, userPresenceResponse] =
        useNotifyParticipantPresence();
    const addAlert = useFloatingAlertContext();
    const [sendToggledMuted] = useSendParticipantStatus();

    const cameraErrorSubTitle =
        (isCameraBlocked && CONSTANTS.CAMERA_BLOCKED_ERROR_MESSAGES.subtitle) ||
        (cameraError && CONSTANTS.CAMERA_UNAVAILABLE_ERROR_MESSAGES.subtitle);
    const cameraErrorTitle =
        (isCameraBlocked && CONSTANTS.CAMERA_BLOCKED_ERROR_MESSAGES.title) ||
        (cameraError && CONSTANTS.CAMERA_UNAVAILABLE_ERROR_MESSAGES.title);
    const [windowWidth] = useContext(WindowSizeContext);
    const widthMorethanLg = windowWidth >= parseInt(theme.default.breakpoints.lg, 10);

    useEffect(() => {
        if (visible && !shouldUseCurrentStream) {
            loadUserStreams(null, null);
        }
    }, [visible, shouldUseCurrentStream, loadUserStreams]);

    useEffect(() => {
        if (!options) {
            loadUserStreams(null, null);
        }
    }, [options, loadUserStreams]);

    useEffect(() => {
        if (visible && audioTracks.length && videoTracks.length) {
            const audioMediaTracks = getMediaTracks(audioTracks, "audio");
            const videoMediaTracks = getMediaTracks(videoTracks, "video");
            const audioStream = new MediaStream(audioMediaTracks);
            const videoStream = new MediaStream(videoMediaTracks);
            loadUserStreams(audioStream, videoStream);
        }
        if (visible === false) {
            stopExampleTrack();
        }
    }, [visible, audioTracks, videoTracks, loadUserStreams, stopExampleTrack]);

    useEffect(() => {
        if (changeAudioDevice) {
            stopOldTrackAndSetNewTrack(changeAudioDevice, true);
            setSelectedOptions((oldSelectedOptions) => {
                return { ...oldSelectedOptions, [changeAudioDevice.kind]: changeAudioDevice };
            });
        }
    }, [changeAudioDevice, stopOldTrackAndSetNewTrack, setSelectedOptions]);

    useEffect(() => {
        const cameraError = errors.length >= 1 && errors.filter((error) => error?.videoinput)[0];
        const micError = errors.length >= 1 && errors.filter((error) => error?.audioinput)[0];
        const isCameraBlocked = cameraError && cameraError.videoinput.name === "NotAllowedError";
        const toggleErrors = (resetValues?: boolean) => {
            if (cameraError) {
                setCameraError(resetValues ? false : cameraError);
            }
            if (micError) {
                setMicError(resetValues ? false : micError);
            }
            if (isCameraBlocked) {
                setIsCameraBlocked(resetValues ? false : isCameraBlocked);
            }
        };
        toggleErrors();
        return () => {
            toggleErrors(true);
        };
    }, [errors]);

    useEffect(() => {
        const sendToDepo = () => {
            const devices = createDevices({ video: cameraError, audio: micError }, selectedOptions);
            localStorage.setItem("selectedDevices", JSON.stringify(devices));
            dispatch(actions.setInitialCameraStatus(!isVideoOff));
            history.push(`/deposition/join/${depositionID}`);
        };

        if (userPresenceResponse) {
            sendToDepo();
        }
    }, [
        history,
        userPresenceResponse,
        dispatch,
        isVideoOff,
        selectedOptions,
        cameraError,
        micError,
        depositionID,
        isMuted,
    ]);

    useEffect(() => {
        if (userPresenceError) {
            addAlert({
                message: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [userPresenceError, addAlert]);

    useEffect(() => {
        if (videoRef.current && activeStreams.videoinput.stream) {
            videoRef.current.srcObject = activeStreams.videoinput.stream;
        }
        setVideoOff(!activeStreams.videoinput.stream);
    }, [activeStreams.videoinput.stream]);

    useEffect(() => {
        setMuted(!activeStreams.audioinput.stream);
    }, [activeStreams.audioinput.stream]);

    useEffect(() => {
        const devices = localStorage.getItem("selectedDevices") && JSON.parse(localStorage.getItem("selectedDevices"));
        if (devices?.speakers && audioRef && visible) {
            changeSpeakers(audioRef, devices.speakers);
        }
    }, [audioRef, visible]);

    const onClickTestIcons = (audio?: boolean) => {
        if (audio === true) {
            if (activeStreams.audioinput.stream) {
                activeStreams.audioinput.stream
                    .getTracks()
                    .filter((track) => track.kind === MediaStreamTypes.audioinput)[0].enabled = isMuted;
                return setMuted(!isMuted);
            }
            return null;
        }
        if (activeStreams.videoinput.stream) {
            activeStreams.videoinput.stream
                .getTracks()
                .filter((track) => track.kind === MediaStreamTypes.videoinput)[0].enabled = isVideoOff;
            return setVideoOff(!isVideoOff);
        }
        return null;
    };

    const handleSpeakerTest = () => {
        if (audioRef) {
            audioRef.currentTime = 0;
            audioRef.play();
        }
    };

    const isValueValid = (newValue: string, oldValue: string) => {
        const isValid = !CONSTANTS.INVALID_VALUES.includes(newValue) && oldValue !== newValue;
        return isValid;
    };

    const handleDeviceChange = (device: StreamOption) => {
        const parsedDevice = JSON.parse(device as unknown as string) as StreamOption;
        const oldDevice = selectedOptions[parsedDevice.kind] as StreamOption;

        if (isValueValid(parsedDevice.value, oldDevice.value)) {
            if (parsedDevice.kind !== "audiooutput") {
                if (availableRoom?.localParticipant?.audioTracks) {
                    const localTrack = trackpubsToTracks(availableRoom.localParticipant.audioTracks)[0];
                    if (localTrack && typeof localTrack.stop === "function") {
                        localTrack.stop();
                    }
                }
                stopOldTrackAndSetNewTrack(parsedDevice);
            } else {
                changeSpeakers(audioRef, parsedDevice.value);
            }
            setSelectedOptions({ ...selectedOptions, [parsedDevice.kind]: parsedDevice });
        }
    };

    const sendMutedStatusToServer = () => {
        sendUserPresence(isMuted);
    };

    const setNewDevices = async () => {
        if (depoRoomReconnecting) {
            return addAlert({
                message: CONSTANTS.NOT_CONNECTED_TO_DEPO,
                closable: true,
                type: "info",
                duration: 3,
                dataTestId: "depo_disconnected_troubleshoot_toast",
            });
        }
        const devices = createDevices({ video: cameraError, audio: micError }, selectedOptions);
        const videoDevice = devices.video as Device;
        const audioDevice = devices.audio as Device;
        const speakersDevice = devices.speakers;
        const existingVideoTrack: LocalVideoTrack | undefined = trackpubsToTracks(
            availableRoom.localParticipant.videoTracks
        )[0];
        const existingAudioTrack: LocalAudioTrack | undefined = trackpubsToTracks(
            availableRoom.localParticipant.audioTracks
        )[0];
        // TODO: Replace label with id
        const hasVideoChanged = existingVideoTrack?.mediaStreamTrack?.label !== videoDevice?.label;
        const hasAudioChanged = existingAudioTrack?.mediaStreamTrack?.label !== audioDevice?.label;
        const haveSpeakersChanged = oldDevices?.speakers !== speakersDevice;
        const tracksCopy = [...tracks];
        if (hasVideoChanged) {
            const { deviceId } = videoDevice;
            try {
                if (existingVideoTrack) {
                    await existingVideoTrack.restart({ deviceId });
                } else {
                    const localVideoTrack = await createLocalVideoTrack({ deviceId });
                    await availableRoom.localParticipant.publishTrack(localVideoTrack);
                    dispatch(actions.changeVideoSource(true));
                    dispatch(actions.setInitialCameraStatus(true));
                    tracksCopy.push(localVideoTrack);
                }
            } catch (error) {
                console.error(
                    `(troubleShootDevicesModal) video device changed error of deposition ${depositionID}:`,
                    error
                );
            }
        }
        if (hasAudioChanged) {
            try {
                const { deviceId } = audioDevice;
                if (existingAudioTrack) {
                    await existingAudioTrack.restart({ deviceId });
                } else {
                    const localAudioTrack = await createLocalAudioTrack({ deviceId });
                    await availableRoom.localParticipant.publishTrack(localAudioTrack);
                    await sendToggledMuted(false);
                    dispatch(actions.changeAudioSource(true));
                    dispatch(actions.setPublishedAudioTrackStatus(true));
                    tracksCopy.push(localAudioTrack);
                }
            } catch (error) {
                console.error(
                    `(troubleShootDevicesModal) audio device changed error of deposition ${depositionID}:`,
                    error
                );
            }
        }
        if (haveSpeakersChanged) {
            dispatch(actions.changeSpeaker(speakersDevice));
        }
        if (hasAudioChanged || hasVideoChanged || haveSpeakersChanged) {
            localStorage.setItem("selectedDevices", JSON.stringify(devices));
            dispatch(actions.addUserTracks(tracksCopy));
        }
        return onClose();
    };

    return (
        <>
            {gettingTracks && !isDepo && <Overlay />}
            <SettingsWrapper
                widthMorethanLg={widthMorethanLg}
                onClose={onClose}
                visible={isDepo ? visible : true}
                isDepo={isDepo}
            >
                <StyledForm layout="vertical">
                    <Space direction="vertical" fullWidth mt={widthMorethanLg ? null : 3}>
                        <Space.Item fullWidth>
                            <Title
                                dataTestId={isDepo ? "setting_in_depo" : "troubleshooting_settings"}
                                level={widthMorethanLg ? 4 : 6}
                                weight="light"
                            >
                                {isDepo ? CONSTANTS.IN_DEPO_TITLE : CONSTANTS.TITLE}
                            </Title>
                        </Space.Item>
                        {!widthMorethanLg && (
                            <Divider style={{ marginBottom: getREM(theme.default.spaces[6]) }} hasMargin={false} />
                        )}
                        <Space.Item fullWidth>
                            <Row gutter={24}>
                                <StyledCol sm={13} xs={24}>
                                    <TestVideo
                                        showButtons={!isDepo}
                                        hasError={cameraError}
                                        errorText={cameraErrorSubTitle}
                                        errorTitle={cameraErrorTitle}
                                        isMuted={isMuted}
                                        onClickMuted={() => onClickTestIcons(true)}
                                        onClickVideo={onClickTestIcons}
                                        isVideoOn={!isVideoOff}
                                        ref={videoRef}
                                    />
                                    <Space size="large" fullWidth my={9} justify="space-between">
                                        <TestVolume stream={isMuted ? null : activeStreams.audioinput.stream} />
                                        <Space.Item>
                                            <audio
                                                ref={(newRef) => setAudioRef(newRef)}
                                                data-testid="audio_file"
                                                src={SpeakerTestAudio}
                                            />
                                            <Button
                                                data-testid="test_speakers"
                                                type="link"
                                                onClick={handleSpeakerTest}
                                                icon={<Icon icon={VolumeOnIcon} size={8} />}
                                            >
                                                {CONSTANTS.SPEAKER_TEST_LABEL}
                                            </Button>
                                        </Space.Item>
                                    </Space>
                                </StyledCol>
                                <Col sm={11} xs={24}>
                                    <StyledForm.Item label="Microphone" htmlFor="microphone">
                                        <InputWrapper>
                                            <Select
                                                onChange={handleDeviceChange}
                                                value={(selectedOptions?.audioinput as StreamOption)?.label || "-"}
                                                data-testid="microphone"
                                                aria-label="microphone"
                                            >
                                                {options?.audioinput.map((device) => (
                                                    <Select.Option
                                                        data-testid={device.label}
                                                        key={`${device.label}${device.value}${device.kind}`}
                                                        value={JSON.stringify(device)}
                                                    >
                                                        {device.label || "-"}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </InputWrapper>
                                    </StyledForm.Item>
                                    <StyledForm.Item label="Speaker" htmlFor="speaker">
                                        <InputWrapper>
                                            <Select
                                                onChange={handleDeviceChange}
                                                value={(selectedOptions?.audiooutput as StreamOption)?.label || "-"}
                                                data-testid="speaker"
                                                aria-label="speaker"
                                            >
                                                {options?.audiooutput.map((device) => (
                                                    <Select.Option
                                                        data-testid={device.label}
                                                        key={`${device.label}${device.value}${device.kind}`}
                                                        value={JSON.stringify(device)}
                                                    >
                                                        {device.label || "-"}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </InputWrapper>
                                    </StyledForm.Item>
                                    <StyledForm.Item label="Camera" htmlFor="camera">
                                        <InputWrapper>
                                            <Select
                                                onChange={handleDeviceChange}
                                                value={(selectedOptions?.videoinput as StreamOption)?.label || "-"}
                                                data-testid="camera"
                                                aria-label="camera"
                                            >
                                                {options?.videoinput.map((device) => (
                                                    <Select.Option
                                                        data-testid={device.label}
                                                        key={`${device.label}${device.value}${device.kind}`}
                                                        value={JSON.stringify(device)}
                                                    >
                                                        {device.label || "-"}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </InputWrapper>
                                    </StyledForm.Item>
                                </Col>
                            </Row>
                        </Space.Item>
                        <Space justify="flex-end" fullWidth>
                            <Button
                                data-testid={isDepo ? "submit_new_devices_button" : "join_deposition_button"}
                                onClick={isDepo ? setNewDevices : sendMutedStatusToServer}
                                loading={userPresenceLoading}
                                disabled={userPresenceLoading}
                                type="primary"
                            >
                                {isDepo ? CONSTANTS.CHANGE_DEVICES_LABEL : CONSTANTS.JOIN_BUTTON_LABEL}
                            </Button>
                        </Space>
                    </Space>
                </StyledForm>
            </SettingsWrapper>
        </>
    );
};
export default TroubleShootDevicesModal;
