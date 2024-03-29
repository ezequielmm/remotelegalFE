import React, { ReactElement } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Row } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Confirm from "@rl/prp-components-library/src/components/Confirm";
import Modal from "@rl/prp-components-library/src/components/Modal";
import RHFInput from "@rl/prp-components-library/src/components/RHF/RHFInput";
import RHFSelect from "@rl/prp-components-library/src/components/RHF/RHFSelect";
import Select from "@rl/prp-components-library/src/components/Select";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import { useForm, useFormContext } from "react-hook-form";
import * as CONSTANTS from "../../../../constants/otherParticipants";
import { IParticipant } from "../../../../models/participant";
import OtherParticipantsSchema from "../../../../schemas/OtherParticipantsSchema";
import ColorStatus from "../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../state/GlobalState";

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
    const { state } = React.useContext(GlobalStateContext);
    const { currentUser } = state?.user;

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
        email: currentParticipant?.email,
        name: currentParticipant?.name,
        phone: currentParticipant?.phone,
        role: currentParticipant?.role,
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
            <Space direction="vertical" size="large" fullWidth data-testid="add_participants_modal_form">
                <Space.Item fullWidth>
                    <Title level={4} weight="light">
                        {CONSTANTS.OTHER_PARTICIPANTS_MODAL_TITLE}
                    </Title>
                    <Text state={ColorStatus.disabled} ellipsis={false} height={2}>
                        {CONSTANTS.OTHER_PARTICIPANTS_MODAL_SUBTITLE}
                    </Text>
                </Space.Item>
                <Space.Item fullWidth>
                    <Form name="basic" onFinish={handleSubmit(onSubmit)} layout="vertical" preserve={false}>
                        <Space direction="vertical" size="small" fullWidth>
                            <RHFInput
                                control={control}
                                defaultValue={initialValues.email || ""}
                                errorMessage={errors.email?.message}
                                name="email"
                                label={CONSTANTS.OPTIONAL_EMAIL_LABEL}
                                placeholder={CONSTANTS.EMAIL_PLACEHOLDER}
                                noMargin
                            />
                            <RHFInput
                                control={control}
                                defaultValue={initialValues.name || ""}
                                errorMessage={errors.name?.message}
                                name="name"
                                label={CONSTANTS.OPTIONAL_NAME_LABEL}
                                placeholder={CONSTANTS.NAME_PLACEHOLDER}
                                noMargin
                                maxLength={50}
                            />
                            <RHFInput
                                control={control}
                                defaultValue={initialValues.phone || ""}
                                errorMessage={errors.phone?.message}
                                name="phone"
                                label={CONSTANTS.OPTIONAL_PHONE_LABEL}
                                placeholder={CONSTANTS.PHONE_PLACEHOLDER}
                                noMargin
                            />
                            <RHFSelect
                                defaultValue={initialValues.role || null}
                                label={CONSTANTS.ROLE_LABEL}
                                placeholder={CONSTANTS.ROLE_PLACEHOLDER}
                                name="role"
                                control={control}
                                errorMessage={errors.role?.message}
                                items={
                                    isCourtReporterAlreadyAdded
                                        ? CONSTANTS.getOtherParticipantsRoles(!!currentUser?.isAdmin).filter(
                                              (participant) => participant !== CONSTANTS.COURT_REPORTER_ROLE
                                          )
                                        : CONSTANTS.getOtherParticipantsRoles(!!currentUser?.isAdmin)
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
                                <Button
                                    data-testid="add_participants_add_modal_button"
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {editMode
                                        ? CONSTANTS.OTHER_PARTICIPANTS_EDIT_BUTTON_LABEL
                                        : CONSTANTS.OTHER_PARTICIPANTS_ADD_BUTTON_LABEL}
                                </Button>
                            </Space>
                        </Row>
                    </Form>
                </Space.Item>
            </Space>
        </Modal>
    );
    return deleteMode ? deleteMessage : modalForm;
}
