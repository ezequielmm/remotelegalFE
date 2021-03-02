import React, { SetStateAction, useEffect, useState } from "react";
import { Row, Form } from "antd";
import { InputWrapper } from "../../../components/Input/styles";
import Space from "../../../components/Space";
import Input from "../../../components/Input";
import Text from "../../../components/Typography/Text";
import Title from "../../../components/Typography/Title";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import Select from "../../../components/Select";
import ColorStatus from "../../../types/ColorStatus";
import isPhoneInvalid from "../../../helpers/isPhoneInvalid";
import isInvalidEmail from "../../../helpers/isInvalidEmail";
import { useAddParticipantToExistingDepo } from "../../../hooks/activeDepositionDetails/hooks";
import Message from "../../../components/Message";

interface IModalProps {
    open: boolean;
    handleClose: React.Dispatch<SetStateAction<boolean>>;
    fetchParticipants: () => void;
    isCourtReporterPresent: boolean;
    depoID: string;
}

const INITIAL_FORM_STATE = {
    role: { value: null, invalid: false },
    email: { value: "", invalid: false },
    name: { value: "", invalid: false },
    phone: { value: "", invalid: false },
};

const AddParticipantModal = ({ open, handleClose, fetchParticipants, isCourtReporterPresent, depoID }: IModalProps) => {
    const [formStatus, setFormStatus] = useState(INITIAL_FORM_STATE);
    const [addParticipant, loading, error, addedParticipant] = useAddParticipantToExistingDepo();

    useEffect(() => {
        if (addedParticipant) {
            Message({
                content: CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ADDED_PARTICIPANT_TOAST,
                type: "success",
                duration: 3,
            });
            fetchParticipants();
            handleClose(false);
            setFormStatus(INITIAL_FORM_STATE);
        }
    }, [addedParticipant, handleClose, fetchParticipants]);

    useEffect(() => {
        if (error) {
            Message({
                content:
                    error === 400
                        ? CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PARTICIPANT_ALREADY_EXISTS_ERROR
                        : CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [error]);

    const handleSubmit = () => {
        const { email, role, phone, name } = formStatus;
        const isEmailInvalid = email.value.length ? isInvalidEmail(email.value) : false;
        const isRoleInvalid = role.value === null || false;
        const isPhoneNotValid = phone.value.length ? isPhoneInvalid(phone.value) : false;

        if (isPhoneNotValid || isRoleInvalid || isEmailInvalid) {
            return setFormStatus({
                ...formStatus,
                role: {
                    ...role,
                    invalid: isRoleInvalid,
                },
                email: { ...email, invalid: isEmailInvalid },
                phone: { ...phone, invalid: isPhoneNotValid },
            });
        }
        const body = Object.fromEntries(
            Object.entries({
                role: role.value.replace(/\s+/g, ""),
                name: name.value,
                phone: phone.value,
                email: email.value,
            }).filter(([, value]) => value !== "")
        );

        return addParticipant(depoID, body);
    };

    const roles = isCourtReporterPresent
        ? CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLES.filter((item) => item !== "Court Reporter")
        : CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLES;

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
                handleClose(false);
            }}
        >
            <Space direction="vertical" size="large" fullWidth>
                <Space.Item fullWidth>
                    <Title
                        level={4}
                        weight="light"
                        noMargin
                        dataTestId={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_TITLE}
                    >
                        {CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_TITLE}
                    </Title>
                </Space.Item>
                <Space.Item fullWidth>
                    <Form layout="vertical">
                        <Form.Item label="Role" htmlFor="role">
                            <InputWrapper>
                                <Select
                                    placeholder={
                                        CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_PLACEHOLDER
                                    }
                                    data-testid={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_ROLE}
                                    aria-label="role"
                                    invalid={formStatus.role.invalid}
                                    value={formStatus.role.value}
                                    onChange={(value) =>
                                        setFormStatus({ ...formStatus, role: { value, invalid: false } })
                                    }
                                >
                                    {roles.map((item) => (
                                        <Select.Option data-testid={item} value={item} key={item}>
                                            {item}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </InputWrapper>
                            {formStatus.role.invalid && (
                                <Text
                                    size="small"
                                    state={ColorStatus.error}
                                    dataTestId={
                                        CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_ROLE
                                    }
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_ROLE_SELECT_INVALID_ROLE}
                                </Text>
                            )}
                        </Form.Item>
                        <Form.Item label="Email Address (optional)" htmlFor="email">
                            <InputWrapper>
                                <Input
                                    placeholder={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_EMAIL_PLACEHOLDER}
                                    data-testid={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_EMAIL}
                                    value={formStatus.email.value}
                                    onChange={(e) =>
                                        setFormStatus({
                                            ...formStatus,
                                            email: { value: e.target.value, invalid: false },
                                        })
                                    }
                                    invalid={formStatus.email.invalid}
                                    maxLength={50}
                                    name="email"
                                />
                            </InputWrapper>
                            {formStatus.email.invalid && (
                                <Text
                                    dataTestId={
                                        CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_EMAIL
                                    }
                                    size="small"
                                    state={ColorStatus.error}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_EMAIL_INVALID}
                                </Text>
                            )}
                        </Form.Item>
                        <Form.Item label="Name (optional)" htmlFor="name">
                            <InputWrapper>
                                <Input
                                    data-testid={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_NAME}
                                    value={formStatus.name.value}
                                    onChange={(e) =>
                                        setFormStatus({
                                            ...formStatus,
                                            name: { value: e.target.value, invalid: false },
                                        })
                                    }
                                    placeholder={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_NAME_PLACEHOLDER}
                                    maxLength={50}
                                    name="name"
                                />
                            </InputWrapper>
                        </Form.Item>
                        <Form.Item label="Phone number (optional)" htmlFor="phone">
                            <InputWrapper>
                                <Input
                                    data-testid={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_PHONE}
                                    invalid={formStatus.phone.invalid}
                                    value={formStatus.phone.value}
                                    onChange={(e) =>
                                        setFormStatus({
                                            ...formStatus,
                                            phone: { value: e.target.value, invalid: false },
                                        })
                                    }
                                    placeholder={CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PHONE_PLACEHOLDER}
                                    name="phone"
                                />
                            </InputWrapper>
                            {formStatus.phone.invalid && (
                                <Text
                                    dataTestId={
                                        CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_DATA_TEST_ID_INVALID_PHONE
                                    }
                                    size="small"
                                    state={ColorStatus.error}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_PHONE_INVALID}
                                </Text>
                            )}
                        </Form.Item>
                        <Row justify="end">
                            <Space size="large">
                                <Button
                                    disabled={loading}
                                    type="text"
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CANCEL_BUTTON_TEST_ID
                                    }
                                    onClick={() => handleClose(false)}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CANCEL_BUTTON_TEXT}
                                </Button>
                                <Button
                                    disabled={loading}
                                    loading={loading}
                                    onClick={handleSubmit}
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEST_ID
                                    }
                                    htmlType="submit"
                                    type="primary"
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_ADD_PARTICIPANT_MODAL_CONFIRM_BUTTON_TEXT}
                                </Button>
                            </Space>
                        </Row>
                    </Form>
                </Space.Item>
            </Space>
        </Modal>
    );
};
export default AddParticipantModal;
