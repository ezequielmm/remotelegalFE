import React, { SetStateAction, useEffect, useState } from "react";
import { Row, Form, Tooltip, Upload, Col } from "antd";
import styled from "styled-components";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { InputWrapper } from "../../../components/Input/styles";
import Space from "../../../components/Space";
import Input from "../../../components/Input";
import Select from "../../../components/Select";
import RadioGroup from "../../../components/RadioGroup";
import Radio from "../../../components/Radio";
import TextArea from "../../../components/TextArea";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import ButtonUpload from "../../../components/ButtonUpload";
import Icon from "../../../components/Icon";
import { ReactComponent as InformationIcon } from "../../../assets/icons/information.svg";
import { ReactComponent as AttachClipIcon } from "../../../assets/icons/attach-clip.svg";
import { DepositionModel } from "../../../models";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { useEditDeposition } from "../../../hooks/activeDepositionDetails/hooks";
import Message from "../../../components/Message";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";

interface IModalProps {
    open: boolean;
    handleClose: React.Dispatch<SetStateAction<boolean>>;
    deposition: DepositionModel.IDeposition;
    fetchDeposition: () => void;
}

const StyledCloseIcon = styled(CloseIcon)`
    width: ${getREM(1)};
    height: ${getREM(1)};
`;

const EditDepoModal = ({ open, handleClose, deposition, fetchDeposition }: IModalProps) => {
    const [formStatus, setFormStatus] = useState({
        status: deposition.status,
        job: deposition.job,
        caption: deposition.caption,
        isVideoRecordingNeeded: deposition.isVideoRecordingNeeded,
        details: deposition.details,
        file: null,
        deleteCaption: false,
    });
    const [invalidFile, setInvalidFile] = useState(false);

    const [editDeposition, loading, error, editedDeposition] = useEditDeposition();

    const handleCloseModalAndResetFormStatus = () => {
        handleClose(false);
        setTimeout(() => {
            if (invalidFile) {
                setInvalidFile(false);
            }
            setFormStatus({
                status: deposition.status,
                job: deposition.job,
                caption: deposition.caption,
                isVideoRecordingNeeded: deposition.isVideoRecordingNeeded,
                details: deposition.details,
                file: null,
                deleteCaption: false,
            });
        }, 200);
    };
    useEffect(() => {
        if (editedDeposition) {
            Message({
                content: CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST,
                type: "success",
                duration: 3,
            });
            handleClose(false);
            setTimeout(() => fetchDeposition(), 200);
        }
    }, [editedDeposition, fetchDeposition, handleClose]);

    useEffect(() => {
        if (error) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [error]);

    const handleSubmit = () => {
        const { file, caption, deleteCaption, ...bodyWithoutFile } = formStatus;
        if (invalidFile) {
            return;
        }
        editDeposition(deposition.id, bodyWithoutFile, file, deleteCaption);
    };

    return (
        <Modal
            destroyOnClose
            visible={open}
            centered
            onlyBody
            onCancel={() => {
                if (loading) {
                    return;
                }
                handleCloseModalAndResetFormStatus();
            }}
        >
            <Space direction="vertical" size="large" fullWidth>
                <Space.Item fullWidth>
                    <Title
                        level={4}
                        weight="light"
                        noMargin
                        dataTestId={CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_TITLE}
                    >
                        {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_TITLE}
                    </Title>
                </Space.Item>
                <Space.Item fullWidth>
                    <Form layout="vertical">
                        <Row>
                            <Col span={11}>
                                <Form.Item label="Status" htmlFor="status">
                                    <InputWrapper>
                                        <Select
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_STATUS
                                            }
                                            aria-label="status"
                                            value={formStatus.status}
                                            onChange={(value) => setFormStatus({ ...formStatus, status: value })}
                                        >
                                            {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_STATUS_OPTIONS.map(
                                                (item) => (
                                                    <Select.Option data-testid={item} value={item} key={item}>
                                                        {item}
                                                    </Select.Option>
                                                )
                                            )}
                                        </Select>
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item label="JOB #" htmlFor="job">
                                    <InputWrapper>
                                        <Input
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB
                                            }
                                            value={formStatus.job}
                                            onChange={(e) =>
                                                setFormStatus({
                                                    ...formStatus,
                                                    job: e.target.value,
                                                })
                                            }
                                            maxLength={10}
                                            name="job"
                                        />
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item label="Caption (optional)">
                                    {formStatus.caption ? (
                                        <Button
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID
                                            }
                                            icon={<Icon icon={AttachClipIcon} size={8} />}
                                        >
                                            {formStatus.caption.displayName}
                                            <StyledCloseIcon
                                                data-testid={
                                                    CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_REMOVE_FILE_TEST_ID
                                                }
                                                onClick={() =>
                                                    setFormStatus({ ...formStatus, caption: null, deleteCaption: true })
                                                }
                                            />
                                        </Button>
                                    ) : (
                                        <Upload
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID
                                            }
                                            customRequest={({ file }) => {
                                                const isInvalid = file.type !== "application/pdf";
                                                if (isInvalid) {
                                                    setInvalidFile(true);
                                                }
                                                return setFormStatus({ ...formStatus, file });
                                            }}
                                            accept=".pdf"
                                            showUploadList={false}
                                        >
                                            <ButtonUpload
                                                fileName={formStatus.file?.name}
                                                label={formStatus.file ? formStatus.file.name : "Upload Caption"}
                                                removeFile={(e) => {
                                                    e.stopPropagation();
                                                    if (invalidFile) {
                                                        setInvalidFile(false);
                                                    }
                                                    setFormStatus({ ...formStatus, file: null });
                                                }}
                                            />
                                        </Upload>
                                    )}
                                    {invalidFile && (
                                        <Text
                                            size="small"
                                            dataTestId={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_FILE_ERROR_MESSAGE_DATA_TEST_ID
                                            }
                                            state={ColorStatus.error}
                                        >
                                            {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_FILE_ERROR_MESSAGE}
                                        </Text>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item
                            label={
                                <Space align="center">
                                    <Text size="small">
                                        {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_RADIO_LABEL}
                                    </Text>
                                    <Tooltip
                                        data-testid="tooltip"
                                        title={CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_RADIO_LABEL_TOOLTIP}
                                    >
                                        <Icon icon={InformationIcon} size={6} />
                                    </Tooltip>
                                </Space>
                            }
                        >
                            <RadioGroup
                                data-testid={
                                    CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_VIDEO_RECORDING_RADIO_GROUP
                                }
                                value={formStatus.isVideoRecordingNeeded}
                                onChange={(e) =>
                                    setFormStatus({ ...formStatus, isVideoRecordingNeeded: e.target.value })
                                }
                            >
                                {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_RADIO_OPTIONS.map((value) => (
                                    <Radio
                                        data-testid={`${value.value} ${value.label}`}
                                        value={value.value}
                                        key={value.label}
                                    >
                                        {value.label}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </Form.Item>
                        <Form.Item label="Special Request" htmlFor="special_request">
                            <TextArea
                                name="special_request"
                                data-testid={CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS}
                                value={formStatus.details}
                                maxLength={500}
                                onChange={(e) =>
                                    setFormStatus({
                                        ...formStatus,
                                        details: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                        <Row justify="end">
                            <Space size="large">
                                <Button
                                    type="text"
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CANCEL_BUTTON_TEST_ID
                                    }
                                    disabled={loading}
                                    onClick={handleCloseModalAndResetFormStatus}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CANCEL_BUTTON_TEXT}
                                </Button>
                                <Button
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID
                                    }
                                    disabled={loading}
                                    loading={loading}
                                    htmlType="submit"
                                    type="primary"
                                    onClick={handleSubmit}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEXT}
                                </Button>
                            </Space>
                        </Row>
                    </Form>
                </Space.Item>
            </Space>
        </Modal>
    );
};
export default EditDepoModal;
