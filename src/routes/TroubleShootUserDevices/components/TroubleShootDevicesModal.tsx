import { Col } from "antd/lib/grid";
import Row from "antd/lib/row";
import styled from "styled-components";
import { Form } from "antd";
import { useRef, useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router";
import Modal from "../../../components/Modal";
import actions from "../../../state/InDepo/InDepoActions";
import { ModalSize } from "../../../components/Modal/Modal";
import Select from "../../../components/Select";
import * as CONSTANTS from "../../../constants/TroubleShootUserDevices";
import Space from "../../../components/Space";
import Title from "../../../components/Typography/Title";
import useUserTracks, { StreamOption } from "../../../hooks/useUserTracks";
import Overlay from "./Overlay";
import { InputWrapper } from "../../../components/Input/styles";
import TestVolume from "../../../components/TestVolume";
import TestVideo from "../../../components/TestVideo";
import SpeakerTestAudio from "../../../assets/sounds/SpeakerTestAudio.mp3";
import { ReactComponent as VolumeOnIcon } from "../../../assets/icons/volume-on.svg";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
import changeSpeakers from "../../../helpers/changeSpeakers";
import { useSendParticipantStatus } from "../../../hooks/InDepo/useParticipantStatus";
import { GlobalStateContext } from "../../../state/GlobalState";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";
import createDevices, { Device } from "../helpers/createDevices";
import trackpubsToTracks from "../../../helpers/trackPubsToTracks";
import { theme } from "../../../constants/styles/theme";
import { getREM } from "../../../constants/styles/utils";
import { breakpoints } from "../../../constants/styles/breakpoints";

interface TroubleShootDevicesModalProps {
    isDepo?: boolean;
    visible?: boolean;
    onClose?: () => void;
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

const TroubleShootDevicesModal = ({ isDepo, visible = true, onClose }: TroubleShootDevicesModalProps) => {
    const {
        gettingTracks,
        options,
        selectedOptions,
        activeStreams,
        errors,
        setSelectedOptions,
        stopOldTrackAndSetNewTrack,
    } = useUserTracks(visible);
    const [isMuted, setMuted] = useState(true);
    const history = useHistory();
    const { dispatch, state } = useContext(GlobalStateContext);
    const { mockDepoRoom, currentRoom } = state.room;
    const oldDevices = localStorage.getItem("selectedDevices") && JSON.parse(localStorage.getItem("selectedDevices"));
    const availableRoom = currentRoom || mockDepoRoom;
    const { depositionID } = useParams<{ depositionID: string }>();
    const [isVideoOff, setVideoOff] = useState(true);
    const [audioRef, setAudioRef] = useState<HTMLMediaElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [sendMutedStatus, sendMutedLoading, sendMutedError, sendMutedResponse] = useSendParticipantStatus();
    const addAlert = useFloatingAlertContext();

    const cameraError = errors.length && errors.filter((error) => error?.videoinput)[0];
    const micError = errors.length && errors.filter((error) => error?.audioinput)[0];
    const isCameraBlocked = cameraError && cameraError.videoinput.name === "NotAllowedError";
    const cameraErrorSubTitle =
        (isCameraBlocked && CONSTANTS.CAMERA_BLOCKED_ERROR_MESSAGES.subtitle) ||
        (cameraError && CONSTANTS.CAMERA_UNAVAILABLE_ERROR_MESSAGES.subtitle);
    const cameraErrorTitle =
        (isCameraBlocked && CONSTANTS.CAMERA_BLOCKED_ERROR_MESSAGES.title) ||
        (cameraError && CONSTANTS.CAMERA_UNAVAILABLE_ERROR_MESSAGES.title);

    useEffect(() => {
        const sendToDepo = () => {
            const devices = createDevices({ video: cameraError, audio: micError }, selectedOptions);
            localStorage.setItem("selectedDevices", JSON.stringify(devices));
            dispatch(actions.setInitialCameraStatus(!isVideoOff));
            history.push(`/deposition/join/${depositionID}`);
        };

        if (sendMutedResponse) {
            sendToDepo();
        }
    }, [
        history,
        sendMutedResponse,
        dispatch,
        isVideoOff,
        selectedOptions,
        cameraError,
        micError,
        depositionID,
        isMuted,
    ]);

    useEffect(() => {
        if (sendMutedError) {
            addAlert({
                message: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [sendMutedError, addAlert]);

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
                activeStreams.audioinput.stream.getTracks()[0].enabled = isMuted;
                return setMuted(!isMuted);
            }
            return null;
        }
        if (activeStreams.videoinput.stream) {
            activeStreams.videoinput.stream.getTracks()[0].enabled = isVideoOff;
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
                stopOldTrackAndSetNewTrack(parsedDevice);
            } else {
                changeSpeakers(audioRef, parsedDevice.value);
            }
            setSelectedOptions({ ...selectedOptions, [parsedDevice.kind]: parsedDevice });
        }
    };

    const sendMutedStatusToServer = () => {
        sendMutedStatus(isMuted);
    };

    const setNewDevices = async () => {
        const devices = createDevices({ video: cameraError, audio: micError }, selectedOptions);
        const videoDevice = devices.video as Device;
        const audioDevice = devices.audio as Device;
        const speakersDevice = devices.speakers;
        const hasVideoChanged = oldDevices?.video?.deviceId?.exact !== videoDevice?.deviceId?.exact;
        const hasAudioChanged = oldDevices?.audio?.deviceId?.exact !== audioDevice?.deviceId?.exact;
        const haveSpeakersChanged = oldDevices?.speakers !== speakersDevice;
        if (hasVideoChanged) {
            const { deviceId } = videoDevice;
            try {
                const localVideoTrack = trackpubsToTracks(availableRoom.localParticipant.videoTracks);
                if (localVideoTrack[0]) {
                    await localVideoTrack[0].restart({ deviceId });
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (hasAudioChanged) {
            try {
                const { deviceId } = audioDevice;
                const localAudioTrack = trackpubsToTracks(availableRoom.localParticipant.audioTracks);
                if (localAudioTrack[0]) {
                    await localAudioTrack[0].restart({ deviceId });
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (haveSpeakersChanged) {
            dispatch(actions.changeSpeaker(speakersDevice));
        }
        if (hasAudioChanged || hasVideoChanged || haveSpeakersChanged) {
            localStorage.setItem("selectedDevices", JSON.stringify(devices));
        }
        onClose();
    };

    return (
        <>
            {gettingTracks && !isDepo && <Overlay />}
            <Modal
                onCancel={onClose}
                onlyBody
                visible={isDepo ? visible : true}
                destroyOnClose
                closable={!!isDepo}
                centered
                mask={!!isDepo}
                size={ModalSize.large}
            >
                <StyledForm layout="vertical">
                    <Space direction="vertical" fullWidth>
                        <Space.Item fullWidth>
                            <Title
                                dataTestId={isDepo ? "setting_in_depo" : "troubleshooting_settings"}
                                level={4}
                                weight="light"
                            >
                                {isDepo ? CONSTANTS.IN_DEPO_TITLE : CONSTANTS.TITLE}
                            </Title>
                        </Space.Item>
                        <Space.Item fullWidth>
                            <Row gutter={24}>
                                <StyledCol sm={13}>
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
                                            >
                                                <track kind="captions" />
                                            </audio>
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
                                                        key={device.value}
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
                                                        key={device.value}
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
                                                        key={device.value}
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
                                loading={sendMutedLoading}
                                disabled={sendMutedLoading}
                                type="primary"
                            >
                                {isDepo ? CONSTANTS.CHANGE_DEVICES_LABEL : CONSTANTS.JOIN_BUTTON_LABEL}
                            </Button>
                        </Space>
                    </Space>
                </StyledForm>
            </Modal>
        </>
    );
};
export default TroubleShootDevicesModal;
