import { Col } from "antd/lib/grid";
import Row from "antd/lib/row";
import { Form } from "antd";
import { useRef, useEffect, useState, useContext } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import Modal from "../../components/Modal";
import actions from "../../state/InDepo/InDepoActions";
import { ModalSize } from "../../components/Modal/Modal";
import Select from "../../components/Select";
import * as CONSTANTS from "../../constants/TroubleShootUserDevices";
import Space from "../../components/Space";
import Title from "../../components/Typography/Title";
import backgroundImage from "../../assets/pre-depo/bg.png";
import useUserTracks, { MediaStreamConstraints, StreamOption } from "../../hooks/useUserTracks";
import Overlay from "./components/Overlay";
import { InputWrapper } from "../../components/Input/styles";
import TestVolume from "../../components/TestVolume";
import TestVideo from "../../components/TestVideo";
import SpeakerTestAudio from "../../assets/sounds/SpeakerTestAudio.mp3";
import { ReactComponent as VolumeOnIcon } from "../../assets/icons/volume-on.svg";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import changeSpeakers from "../../helpers/changeSpeakers";
import { useSendParticipantStatus } from "../../hooks/InDepo/useParticipantStatus";
import { GlobalStateContext } from "../../state/GlobalState";
import useFloatingAlertContext from "../../hooks/useFloatingAlertContext";

const StylesCol = styled(Col)`
    > * {
        z-index: 1;
    }
`;
const TroubleShootUserDevices = () => {
    const {
        gettingTracks,
        options,
        selectedOptions,
        activeStreams,
        errors,
        setSelectedOptions,
        stopOldTrackAndSetNewTrack,
    } = useUserTracks();
    const [isMuted, setMuted] = useState(true);
    const history = useHistory();
    const { dispatch } = useContext(GlobalStateContext);
    const { depositionID } = useParams<{ depositionID: string }>();
    const [isVideoOff, setVideoOff] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLMediaElement>(null);
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
            const videoInput = selectedOptions.videoinput as StreamOption;
            const audioInput = selectedOptions.audioinput as StreamOption;
            const speakers = selectedOptions.audiooutput as StreamOption;
            const devices = {
                video:
                    isCameraBlocked || cameraError || CONSTANTS.INVALID_VALUES.includes(videoInput.value)
                        ? false
                        : {
                              ...MediaStreamConstraints.videoinput,
                              deviceId: {
                                  exact: videoInput.value,
                              },
                          },
                audio:
                    micError || CONSTANTS.INVALID_VALUES.includes(audioInput.value)
                        ? false
                        : {
                              ...MediaStreamConstraints.audioinput,
                              deviceId: {
                                  exact: audioInput.value,
                              },
                          },
                speakers: CONSTANTS.INVALID_VALUES.includes(speakers.value) ? false : speakers.value,
            };
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
        isCameraBlocked,
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
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        }
    };

    const isValueValid = (newValue: string, oldValue: string, deviceKind: string) => {
        const hasErrored = errors.filter((error) => error[deviceKind])[0];
        const isValid = (!CONSTANTS.INVALID_VALUES.includes(newValue) && oldValue !== newValue) || hasErrored;
        return isValid;
    };

    const handleDeviceChange = (device: StreamOption) => {
        const parsedDevice = JSON.parse(device as unknown as string) as StreamOption;
        const oldDevice = selectedOptions[parsedDevice.kind] as StreamOption;
        if (isValueValid(parsedDevice.value, oldDevice.value, parsedDevice.kind)) {
            if (parsedDevice.kind !== "audiooutput") {
                stopOldTrackAndSetNewTrack(parsedDevice);
            } else {
                changeSpeakers(audioRef.current, parsedDevice.value);
            }
            setSelectedOptions({ ...selectedOptions, [parsedDevice.kind]: parsedDevice });
        }
    };

    const sendMutedStatusToServer = () => {
        sendMutedStatus(isMuted);
    };

    return (
        <div
            style={{
                height: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center bottom",
            }}
        >
            {gettingTracks && <Overlay />}
            <Modal onlyBody destroyOnClose closable={false} visible centered mask={false} size={ModalSize.large}>
                <Form layout="vertical">
                    <Space direction="vertical" fullWidth>
                        <Space.Item fullWidth>
                            <Title level={4} weight="light">
                                {CONSTANTS.TITLE}
                            </Title>
                        </Space.Item>
                        <Space.Item fullWidth>
                            <Row gutter={24}>
                                <StylesCol span={13}>
                                    <TestVideo
                                        hasError={cameraError}
                                        errorText={cameraErrorSubTitle}
                                        errorTitle={cameraErrorTitle}
                                        isMuted={isMuted}
                                        onClickMuted={() => onClickTestIcons(true)}
                                        onClickVideo={onClickTestIcons}
                                        isVideoOn={!isVideoOff}
                                        ref={videoRef}
                                    />
                                    <Space size="large" fullWidth mt={8}>
                                        <TestVolume stream={isMuted ? null : activeStreams.audioinput.stream} />
                                        <Space ml={12}>
                                            <audio data-testid="audio_file" src={SpeakerTestAudio} ref={audioRef}>
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
                                        </Space>
                                    </Space>
                                </StylesCol>
                                <Col span={11}>
                                    <Form.Item label="Microphone" htmlFor="microphone">
                                        <InputWrapper>
                                            <Select
                                                onChange={handleDeviceChange}
                                                value={(selectedOptions?.audioinput as StreamOption)?.label || "-"}
                                                data-testid="microphone"
                                                aria-label="microphone"
                                            >
                                                {options?.audioinput.map((device) => (
                                                    <Select.Option
                                                        data-testid={device.value}
                                                        key={device.value}
                                                        value={JSON.stringify(device)}
                                                    >
                                                        {device.label || "-"}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </InputWrapper>
                                    </Form.Item>
                                    <Form.Item label="Speaker" htmlFor="speaker">
                                        <InputWrapper>
                                            <Select
                                                onChange={handleDeviceChange}
                                                value={(selectedOptions?.audiooutput as StreamOption)?.label || "-"}
                                                data-testid="speaker"
                                                aria-label="speaker"
                                            >
                                                {options?.audiooutput.map((device) => (
                                                    <Select.Option
                                                        data-testid={device.value}
                                                        key={device.value}
                                                        value={JSON.stringify(device)}
                                                    >
                                                        {device.label || "-"}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </InputWrapper>
                                    </Form.Item>
                                    <Form.Item label="Camera" htmlFor="camera">
                                        <InputWrapper>
                                            <Select
                                                onChange={handleDeviceChange}
                                                value={(selectedOptions?.videoinput as StreamOption)?.label || "-"}
                                                data-testid="camera"
                                                aria-label="camera"
                                            >
                                                {options?.videoinput.map((device) => (
                                                    <Select.Option
                                                        data-testid={device.value}
                                                        key={device.value}
                                                        value={JSON.stringify(device)}
                                                    >
                                                        {device.label || "-"}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </InputWrapper>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Space.Item>
                        <Space justify="flex-end" fullWidth>
                            <Button
                                data-testid="join_deposition_button"
                                onClick={sendMutedStatusToServer}
                                loading={sendMutedLoading}
                                disabled={sendMutedLoading}
                                type="primary"
                            >
                                {CONSTANTS.JOIN_BUTTON_LABEL}
                            </Button>
                        </Space>
                    </Space>
                </Form>
            </Modal>
        </div>
    );
};
export default TroubleShootUserDevices;
