import React, { ReactElement } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Space, Form, Row } from "antd";
import { useForm, useFormContext } from "react-hook-form";
import Modal from "../../../../components/Modal";
import Confirm from "../../../../components/Confirm";
import Button from "../../../../components/Button";
import Title from "../../../../components/Typography/Title";
import Text from "../../../../components/Typography/Text";
import * as CONSTANTS from "../../../../constants/otherParticipants";
import RHFInput from "../../../../components/RHFInput";
import RHFSelect from "../../../../components/RHFSelect";
import { IParticipant } from "../../../../models/participant";
import OtherParticipantsSchema from "../../../../schemas/OtherParticipantsSchema";
import Select from "../../../../components/Select";
import ColorStatus from "../../../../types/ColorStatus";

export interface IModalProps {
    open: boolean;
    currentParticipant?: IParticipant | any;
    editMode: boolean;
    deleteMode: boolean;
    handleRemoveParticipant?: () => void;
    handleSubmitParticipants?: (data: any, editMode: boolean) => void;
    handleClose?: () => void;
}

export default function OtherParticipantsModal({
    open,
    currentParticipant = {},
    editMode = false,
    deleteMode = false,
    handleSubmitParticipants,
    handleRemoveParticipant,
    handleClose,
}: IModalProps): ReactElement {
    const handleCloseModal = () => {
        handleClose();
    };
    const onSubmit = (data) => {
        handleSubmitParticipants(data, editMode);
        handleClose();
    };

    const onHandleRemoveParticipant = () => {
        handleRemoveParticipant();
        handleClose();
    };

    const initialValues = {
        email: currentParticipant?.email || "",
        name: currentParticipant?.name || "",
        phone: currentParticipant?.phone || "",
        role: currentParticipant?.role || null,
    };

    const { handleSubmit, control, errors } = useForm({
        resolver: yupResolver(OtherParticipantsSchema),
        mode: "onBlur",
        defaultValues: initialValues,
    });
    const { getValues } = useFormContext();
    const isCourtReporterAlreadyAdded = getValues().otherParticipants?.some(
        (participant) => participant?.role === CONSTANTS.COURT_REPORTER_ROLE
    );
    const deleteMessage = (
        <Confirm
            visible={open}
            onNegativeClick={handleCloseModal}
            onPositiveClick={onHandleRemoveParticipant}
            positiveLabel={CONSTANTS.OTHER_PARTICIPANTS_MODAL_DELETE_LABEL}
            negativeLabel={CONSTANTS.OTHER_PARTICIPANTS_MODAL_CLOSE_LABEL}
            title={CONSTANTS.OTHER_PARTICIPANTS_MODAL_DELETE_TITLE}
            subTitle={CONSTANTS.OTHER_PARTICIPANTS_MODAL_DELETE_SUBTITLE}
        />
    );

    const modalForm = (
        <Modal destroyOnClose visible={open} centered onlyBody onCancel={handleCloseModal}>
            <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
                data-testid="add_participants_modal_form"
            >
                <div>
                    <Title level={4} weight="light">
                        {CONSTANTS.OTHER_PARTICIPANTS_MODAL_TITLE}
                    </Title>
                    <Text state={ColorStatus.disabled} ellipsis={false} height={2}>
                        {CONSTANTS.OTHER_PARTICIPANTS_MODAL_SUBTITLE}
                    </Text>
                </div>
                <Form name="basic" onFinish={handleSubmit(onSubmit)} layout="vertical" preserve={false}>
                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        <RHFInput
                            control={control}
                            defaultValue={currentParticipant?.email}
                            errorMessage={errors.email?.message}
                            name="email"
                            label={CONSTANTS.OPTIONAL_EMAIL_LABEL}
                            placeholder={CONSTANTS.EMAIL_PLACEHOLDER}
                            noMargin
                        />
                        <RHFInput
                            control={control}
                            defaultValue={currentParticipant?.name}
                            errorMessage={errors.name?.message}
                            name="name"
                            label={CONSTANTS.OPTIONAL_NAME_LABEL}
                            placeholder={CONSTANTS.NAME_PLACEHOLDER}
                            noMargin
                        />
                        <RHFInput
                            control={control}
                            defaultValue={currentParticipant?.phone}
                            errorMessage={errors.phone?.message}
                            name="phone"
                            label={CONSTANTS.OPTIONAL_PHONE_LABEL}
                            placeholder={CONSTANTS.PHONE_PLACEHOLDER}
                            noMargin
                        />
                        <RHFSelect
                            defaultValue={currentParticipant?.role}
                            label={CONSTANTS.ROLE_LABEL}
                            placeholder={CONSTANTS.ROLE_PLACEHOLDER}
                            name="role"
                            control={control}
                            errorMessage={errors.role?.message}
                            items={
                                isCourtReporterAlreadyAdded
                                    ? CONSTANTS.OTHER_PARTICIPANTS_ROLES.filter(
                                          (participant) => participant !== CONSTANTS.COURT_REPORTER_ROLE
                                      )
                                    : CONSTANTS.OTHER_PARTICIPANTS_ROLES
                            }
                            renderItem={(item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            )}
                        />
                    </Space>
                    <Row justify="end">
                        <Space size="large">
                            <Button
                                data-testid="add_participants_close_modal_button"
                                type="text"
                                onClick={handleCloseModal}
                            >
                                {CONSTANTS.OTHER_PARTICIPANTS_CANCEL_BUTTON_LABEL}
                            </Button>
                            <Button data-testid="add_participants_add_modal_button" type="primary" htmlType="submit">
                                {editMode
                                    ? CONSTANTS.OTHER_PARTICIPANTS_EDIT_BUTTON_LABEL
                                    : CONSTANTS.OTHER_PARTICIPANTS_ADD_BUTTON_LABEL}
                            </Button>
                        </Space>
                    </Row>
                </Form>
            </Space>
        </Modal>
    );
    return deleteMode ? deleteMessage : modalForm;
}
