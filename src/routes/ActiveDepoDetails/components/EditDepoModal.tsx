import React, { SetStateAction, useEffect, useState } from "react";
import { Row, Form, Tooltip, Upload, Col } from "antd";
import styled from "styled-components";
import dayjs from "dayjs";
import Button from "@rl/prp-components-library/src/components/Button";
import ButtonUpload from "@rl/prp-components-library/src/components/ButtonUpload";
import Confirm from "@rl/prp-components-library/src/components/Confirm";
import DatePicker from "@rl/prp-components-library/src/components/DatePicker";
import Icon from "@rl/prp-components-library/src/components/Icon";
import Input from "@rl/prp-components-library/src/components/Input";
import { InputWrapper } from "@rl/prp-components-library/src/components/Input/styles";
import Modal from "@rl/prp-components-library/src/components/Modal";
import Radio from "@rl/prp-components-library/src/components/Radio";
import RadioGroup from "@rl/prp-components-library/src/components/RadioGroup";
import Select from "@rl/prp-components-library/src/components/Select";
import Space from "@rl/prp-components-library/src/components/Space";
import { Status } from "@rl/prp-components-library/src/components/StatusPill/StatusPill";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import TextArea from "@rl/prp-components-library/src/components/TextArea";
import TimePicker from "@rl/prp-components-library/src/components/TimePicker";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as InformationIcon } from "../../../assets/icons/information.svg";
import { ReactComponent as AttachClipIcon } from "../../../assets/icons/attach-clip.svg";
import { DepositionModel } from "../../../models";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import {
    useEditDeposition,
    useCancelDeposition,
    useRevertCancelDeposition,
    useRescheduleDeposition,
} from "../../../hooks/activeDepositionDetails/hooks";
import Message from "../../../components/Message";
import { getREM } from "../../../constants/styles/utils";
import ColorStatus from "../../../types/ColorStatus";
import getModalTextContent, { getConfirmTextContent } from "../helpers/getModalTextContent";
import isCanceledDateInvalid from "../helpers/isCanceledDateInvalid";
import { mapTimeZone, TimeZones } from "../../../models/general";
import { theme } from "../../../constants/styles/theme";
import { formatToDateWithoutTZ } from "../../../helpers/formatToDateOffset";

dayjs.extend(isSameOrBefore);
dayjs.extend(timezone);

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
    const INITIAL_STATE = {
        calendarDate: dayjs(deposition.startDate).tz(mapTimeZone[deposition.timeZone]),
        startDate: dayjs(deposition.startDate).tz(mapTimeZone[deposition.timeZone]),
        endDate: deposition.endDate ? dayjs(deposition.endDate).tz(mapTimeZone[deposition.timeZone]) : null,
        timeZone: deposition.timeZone,
        status: deposition.status,
        job: deposition.job,
        caption: deposition.caption,
        isVideoRecordingNeeded: deposition.isVideoRecordingNeeded,
        details: deposition.details,
        file: null,
        deleteCaption: false,
    };
    const [formStatus, setFormStatus] = useState(INITIAL_STATE);
    const [invalidFile, setInvalidFile] = useState(false);
    const [invalidCancelDate, setInvalidCancelDate] = useState(false);
    const [editDeposition, editLoading, editError, editedDeposition] = useEditDeposition();
    const [rescheduleDeposition, rescheduleDepositionLoading, rescheduleDepositionError, rescheduledDeposition] =
        useRescheduleDeposition();
    const [cancelDeposition, cancelLoading, cancelError, canceledDeposition] = useCancelDeposition();
    const [revertCancelDeposition, revertCancelLoading, revertCancelError, revertedCanceledDeposition] =
        useRevertCancelDeposition();
    const [openStatusModal, setStatusModal] = useState({
        open: false,
        modalContent: {
            title: "",
            message: "",
            cancelButton: "",
            confirmButton: "",
        },
    });
    const { file, caption, deleteCaption, calendarDate, ...bodyWithoutFile } = formStatus;

    const isStatusCanceled = formStatus.status === Status.canceled;
    const isStatusConfirmed = deposition.status === Status.pending && formStatus.status === Status.confirmed;
    const isStatusConfirmedAfterCanceled =
        deposition.status === Status.canceled && formStatus.status === Status.confirmed;
    const [invalidStartTime, setInvalidStartTime] = useState(false);
    const [invalidEndTime, setInvalidEndTime] = useState(false);
    const [openRescheduleModal, setRescheduleModal] = useState({
        open: false,
        modalContent: {
            title: "",
            message: "",
            cancelButton: "",
            confirmButton: "",
        },
    });

    const handleCloseModalAndResetFormStatus = () => {
        handleClose(false);
        setTimeout(() => {
            if (invalidFile) {
                setInvalidFile(false);
            }
            setInvalidStartTime(false);
            setInvalidEndTime(false);
            setFormStatus(INITIAL_STATE);
        }, 200);
    };
    useEffect(() => {
        const content =
            isStatusConfirmed || isStatusConfirmedAfterCanceled
                ? CONSTANTS.DEPOSITION_DETAILS_CHANGE_TO_CONFIRM_EMAIL_SENT_TO_ALL
                : CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST;

        if (editedDeposition || canceledDeposition || revertedCanceledDeposition || rescheduledDeposition) {
            Message({
                content,
                type: "success",
                duration: 3,
            });
            handleClose(false);
            setTimeout(() => fetchDeposition(), 200);
        }
    }, [
        editedDeposition,
        fetchDeposition,
        handleClose,
        canceledDeposition,
        revertedCanceledDeposition,
        rescheduledDeposition,
        isStatusConfirmed,
        isStatusConfirmedAfterCanceled,
    ]);

    useEffect(() => {
        if (editError || revertCancelError || cancelError || rescheduleDepositionError) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [editError, revertCancelError, cancelError, rescheduleDepositionError]);

    const handleSubmit = () => {
        const isDepoConfirmedAndNowCanceled = isStatusCanceled && deposition.status === Status.confirmed;
        const isDepoNowConfirmed = deposition.status !== Status.confirmed && formStatus.status === Status.confirmed;
        const isDepoReverted = deposition.status === Status.canceled && !isStatusCanceled && !invalidFile;
        const isRescheduled =
            !formStatus.calendarDate.isSame(dayjs(deposition.startDate).tz(mapTimeZone[deposition.timeZone])) ||
            !formStatus.startDate.isSame(dayjs(deposition.startDate).tz(mapTimeZone[deposition.timeZone])) ||
            (formStatus.endDate !== null &&
                !formStatus.endDate.isSame(dayjs(deposition.endDate).tz(mapTimeZone[deposition.timeZone]))) ||
            (formStatus.endDate === null && deposition.endDate !== null) ||
            deposition.timeZone !== formStatus.timeZone;

        if (isDepoConfirmedAndNowCanceled || isDepoNowConfirmed || isDepoReverted) {
            return setStatusModal({
                open: true,
                modalContent: getModalTextContent(formStatus.status, deposition),
            });
        }
        if (isStatusCanceled) {
            const isDateInvalid = isCanceledDateInvalid(deposition.startDate);
            return isDateInvalid ? setInvalidCancelDate(true) : cancelDeposition(deposition.id);
        }
        if (invalidFile) {
            return null;
        }
        if (isRescheduled) {
            return setRescheduleModal({
                open: true,
                modalContent: getConfirmTextContent(formStatus.status, deposition),
            });
        }
        return editDeposition(deposition.id, bodyWithoutFile, file, deleteCaption);
    };

    const disabledDate = (current: dayjs.Dayjs) => {
        return dayjs(current.hour(23).minute(59)).isBefore(dayjs()) || dayjs(current).isAfter(dayjs().add(1, "y"));
    };

    const handleChangeDate = (current: dayjs.Dayjs) => {
        const currentDateAsDayJsObject = dayjs(current).tz(mapTimeZone[deposition.timeZone], true);
        setFormStatus({ ...formStatus, calendarDate: currentDateAsDayJsObject });
        if (
            current &&
            dayjs(current.hour(formStatus.startDate.hour()).minute(formStatus.startDate.minute())).isBefore(
                dayjs(new Date()).subtract(5, "m")
            )
        ) {
            return setInvalidStartTime(true);
        }
        return setInvalidStartTime(false);
    };

    const handleChangeStartTime = (current: dayjs.Dayjs) => {
        const concatenatedDate = formStatus.calendarDate.hour(current.hour()).minute(current.minute());
        setFormStatus({ ...formStatus, startDate: dayjs(concatenatedDate) });
        if (
            dayjs(concatenatedDate).isBefore(
                dayjs(new Date()).tz(mapTimeZone[deposition.timeZone], true).subtract(5, "m")
            )
        ) {
            return setInvalidStartTime(true);
        }

        if (concatenatedDate && formStatus.endDate && dayjs(concatenatedDate).isSameOrAfter(formStatus.endDate)) {
            return setInvalidEndTime(true);
        }
        setInvalidEndTime(false);
        return setInvalidStartTime(false);
    };

    const handleChangeEndTime = (current: dayjs.Dayjs) => {
        if (!current) {
            setInvalidEndTime(false);
            return setFormStatus({ ...formStatus, endDate: null });
        }
        const concatenatedDate = formStatus.calendarDate.hour(current.hour()).minute(current.minute());

        setFormStatus({ ...formStatus, endDate: dayjs(concatenatedDate) });
        const isEndTimeSameOrBeforeStartTime =
            current &&
            dayjs(formStatus.startDate.tz(mapTimeZone[formStatus.timeZone], true))
                .hour(dayjs(current).hour())
                .minute(dayjs(current).minute())
                .second(dayjs(current).second())
                .tz(mapTimeZone[formStatus.timeZone], true)
                .isSameOrBefore(dayjs(formStatus.startDate.tz(mapTimeZone[formStatus.timeZone], true)));
        if (isEndTimeSameOrBeforeStartTime) {
            return setInvalidEndTime(true);
        }
        return setInvalidEndTime(false);
    };

    const handleCloseConfirmAndResetFormStatus = () => {
        setTimeout(() => {
            setRescheduleModal({ ...openRescheduleModal, open: false });
            setFormStatus({
                calendarDate: dayjs(deposition.startDate).tz(mapTimeZone[deposition.timeZone]),
                startDate: dayjs(deposition.startDate).tz(mapTimeZone[deposition.timeZone]),
                endDate: deposition.endDate ? dayjs(deposition.endDate).tz(mapTimeZone[deposition.timeZone]) : null,
                timeZone: deposition.timeZone,
                status: formStatus.status,
                job: formStatus.job,
                caption: formStatus.caption,
                isVideoRecordingNeeded: formStatus.isVideoRecordingNeeded,
                details: formStatus.details,
                file: formStatus.file,
                deleteCaption: formStatus.deleteCaption,
            });
        }, 200);
    };

    const handleSubmitWithReschedule = () => {
        const { ...bodyWithoutFile }: { startDate: dayjs.Dayjs | string; endDate: dayjs.Dayjs | string } = formStatus;
        setRescheduleModal({ ...openRescheduleModal, open: false });
        if (invalidFile) {
            return null;
        }

        bodyWithoutFile.startDate = formatToDateWithoutTZ(calendarDate, formStatus.startDate, formStatus.timeZone);

        bodyWithoutFile.endDate = formatToDateWithoutTZ(calendarDate, formStatus.endDate, formStatus.timeZone);

        return rescheduleDeposition(deposition.id, bodyWithoutFile, file, deleteCaption);
    };

    const generalLoading = editLoading || cancelLoading || revertCancelLoading || rescheduleDepositionLoading;

    return (
        <Modal
            destroyOnClose
            visible={open}
            centered
            onlyBody
            onCancel={() => {
                if (editLoading || cancelLoading || revertCancelLoading || rescheduleDepositionLoading) {
                    return;
                }
                handleCloseModalAndResetFormStatus();
            }}
        >
            <Confirm
                positiveLoading={editLoading || cancelLoading || rescheduleDepositionLoading || revertCancelLoading}
                onNegativeClick={() => setStatusModal({ ...openStatusModal, open: false })}
                onPositiveClick={() => {
                    if (isStatusConfirmed) {
                        const {
                            ...bodyWithoutFile
                        }: { startDate: dayjs.Dayjs | string; endDate: dayjs.Dayjs | string } = formStatus;
                        bodyWithoutFile.startDate = formatToDateWithoutTZ(
                            calendarDate,
                            formStatus.startDate,
                            formStatus.timeZone
                        );

                        bodyWithoutFile.endDate = formatToDateWithoutTZ(
                            calendarDate,
                            formStatus.endDate,
                            formStatus.timeZone
                        );
                        return editDeposition(deposition.id, bodyWithoutFile, file, deleteCaption);
                    }
                    return isStatusCanceled
                        ? cancelDeposition(deposition.id)
                        : revertCancelDeposition(deposition.id, bodyWithoutFile, file, deleteCaption);
                }}
                visible={openStatusModal.open}
                title={openStatusModal.modalContent.title}
                subTitle={openStatusModal.modalContent.message}
                positiveLabel={openStatusModal.modalContent.confirmButton}
                negativeLabel={openStatusModal.modalContent.cancelButton}
            />
            <Confirm
                positiveLoading={editLoading || cancelLoading || rescheduleDepositionLoading || revertCancelLoading}
                onNegativeClick={handleCloseConfirmAndResetFormStatus}
                onPositiveClick={handleSubmitWithReschedule}
                visible={!openStatusModal.open && openRescheduleModal.open}
                title={openRescheduleModal.modalContent.title}
                subTitle={openRescheduleModal.modalContent.message}
                positiveLabel={openRescheduleModal.modalContent.confirmButton}
                negativeLabel={openRescheduleModal.modalContent.cancelButton}
            >
                <span data-testid={CONSTANTS.DEPOSITION_DETAILS_EDIT_MODAL_CONFIRM_TEST_ID} />
            </Confirm>
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
                        <Row gutter={theme.default.baseUnit}>
                            <Col span={11}>
                                <Form.Item label="Status" htmlFor="status">
                                    <InputWrapper>
                                        <Select
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_STATUS
                                            }
                                            aria-label="status"
                                            value={formStatus.status}
                                            onChange={(status) => {
                                                if (invalidCancelDate && status !== Status.canceled) {
                                                    setInvalidCancelDate(false);
                                                }
                                                return setFormStatus({ ...formStatus, status });
                                            }}
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
                                <Form.Item label={CONSTANTS.DATE_LABEL}>
                                    <InputWrapper>
                                        <DatePicker
                                            disabled={isStatusCanceled}
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DATE
                                            }
                                            ariel-label="start date"
                                            value={formStatus.calendarDate}
                                            format={CONSTANTS.FORMAT_DATE}
                                            name="date"
                                            onChange={handleChangeDate}
                                            allowClear={false}
                                            disabledDate={disabledDate}
                                        />
                                    </InputWrapper>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={theme.default.baseUnit}>
                            <Col span={9}>
                                <Form.Item label={CONSTANTS.START_LABEL}>
                                    <InputWrapper>
                                        <TimePicker
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_START_TIME_TEST_ID
                                            }
                                            name="startDate"
                                            disabled={isStatusCanceled}
                                            defaultValue={formStatus.startDate}
                                            onChange={handleChangeStartTime}
                                            placeholder={CONSTANTS.START_PLACEHOLDER}
                                            value={formStatus.startDate}
                                            invalid={invalidStartTime}
                                            {...CONSTANTS.TIME_PICKER_PROPS}
                                            onSelect={handleChangeStartTime}
                                        />
                                        {invalidStartTime && (
                                            <Text
                                                dataTestId={
                                                    CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME_TEST_ID
                                                }
                                                block
                                                height={1}
                                                size="small"
                                                state={ColorStatus.error}
                                            >
                                                {CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME}
                                            </Text>
                                        )}
                                    </InputWrapper>
                                </Form.Item>
                            </Col>
                            <Col span={9}>
                                <Form.Item label={CONSTANTS.END_LABEL}>
                                    <InputWrapper>
                                        <TimePicker
                                            disabled={isStatusCanceled}
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_END_TIME_TEST_ID
                                            }
                                            name="endDate"
                                            defaultValue={formStatus.endDate}
                                            value={formStatus.endDate}
                                            onChange={handleChangeEndTime}
                                            placeholder={CONSTANTS.END_PLACEHOLDER}
                                            onSelect={handleChangeEndTime}
                                            {...CONSTANTS.TIME_PICKER_PROPS}
                                            allowClear
                                        />
                                        {invalidEndTime && (
                                            <Text
                                                dataTestId={
                                                    CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME_TEST_ID
                                                }
                                                block
                                                height={1}
                                                size="small"
                                                state={ColorStatus.error}
                                            >
                                                {CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME}
                                            </Text>
                                        )}
                                    </InputWrapper>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label={CONSTANTS.DEPOSITION_DETAILS_EDIT_MODAL_TIMEZONE_LABEL}>
                                    <InputWrapper>
                                        <Select
                                            disabled={isStatusCanceled}
                                            data-testid={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_STATUS
                                            }
                                            aria-label="time zone"
                                            value={formStatus.timeZone}
                                            onChange={(value) => setFormStatus({ ...formStatus, timeZone: value })}
                                        >
                                            {Object.keys(TimeZones).map((item) => (
                                                <Select.Option data-testid={item} value={item} key={item}>
                                                    {item}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </InputWrapper>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={theme.default.baseUnit}>
                            <Col span={11}>
                                <Form.Item label="JOB #" htmlFor="job">
                                    <InputWrapper>
                                        <Input
                                            disabled={isStatusCanceled}
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
                            </Col>
                        </Row>
                        <Form.Item label="Caption (optional)">
                            <Upload
                                disabled={isStatusCanceled}
                                data-testid={
                                    CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID
                                }
                                customRequest={({ file: newFile }: any) => {
                                    const isInvalid = newFile.type !== "application/pdf";
                                    if (isInvalid) {
                                        setInvalidFile(true);
                                    }
                                    return setFormStatus({ ...formStatus, file: newFile });
                                }}
                                accept=".pdf"
                                showUploadList={false}
                            >
                                <ButtonUpload
                                    disabled={isStatusCanceled}
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_TEST_ID
                                    }
                                    fileName={
                                        formStatus.caption ? formStatus.caption.displayName : formStatus.file?.name
                                    }
                                    label={formStatus.caption?.displayName || formStatus.file?.name || "Upload Caption"}
                                    removeFile={(e) => {
                                        e.stopPropagation();
                                        if (formStatus.caption) {
                                            setFormStatus({
                                                ...formStatus,
                                                caption: null,
                                                deleteCaption: true,
                                            });
                                            return;
                                        }
                                        if (invalidFile) {
                                            setInvalidFile(false);
                                        }
                                        setFormStatus({ ...formStatus, file: null });
                                    }}
                                />
                            </Upload>
                            {invalidFile && !isStatusCanceled && (
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
                                        disabled={isStatusCanceled}
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
                                disabled={isStatusCanceled}
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
                                    disabled={generalLoading}
                                    onClick={handleCloseModalAndResetFormStatus}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CANCEL_BUTTON_TEXT}
                                </Button>
                                <Button
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID
                                    }
                                    disabled={generalLoading || invalidStartTime || invalidEndTime}
                                    loading={generalLoading}
                                    htmlType="submit"
                                    type="primary"
                                    onClick={handleSubmit}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEXT}
                                </Button>
                            </Space>
                        </Row>
                        {invalidCancelDate && isStatusCanceled && (
                            <Text
                                size="small"
                                dataTestId={
                                    CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_INVALID_CANCEL_DATE_MESSAGE_DATA_TEST_ID
                                }
                                state={ColorStatus.error}
                            >
                                {CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_INVALID_CANCEL_DATE_MESSAGE}
                            </Text>
                        )}
                    </Form>
                </Space.Item>
            </Space>
        </Modal>
    );
};
export default EditDepoModal;
