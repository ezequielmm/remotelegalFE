import { useEffect, useRef, useState } from "react";
import { Form, Row } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Confirm from "@rl/prp-components-library/src/components/Confirm";
import Input from "@rl/prp-components-library/src/components/Input";
import Modal from "@rl/prp-components-library/src/components/Modal";
import { InputWrapper } from "@rl/prp-components-library/src/components/Input/styles";
import Select from "@rl/prp-components-library/src/components/Select";
import Space from "@rl/prp-components-library/src/components/Space";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import { Status } from "@rl/prp-components-library/src/components/StatusPill/StatusPill";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { IParticipant, Roles } from "../../../models/participant";
import normalizedRoles, { ROLES } from "../../../constants/roles";
import { DepositionModel } from "../../../models";
import isInvalidEmail from "../../../helpers/isInvalidEmail";
import isPhoneInvalid from "../../../helpers/isPhoneInvalid";
import ColorStatus from "../../../types/ColorStatus";
import { useEditParticipant } from "../../../hooks/activeDepositionDetails/hooks";
import removeWhiteSpace from "../../../helpers/removeWhitespace";
import useFloatingAlertContext from "../../../hooks/useFloatingAlertContext";

export interface IModalProps {
    visible: boolean;
    isCourtReporterPresent?: boolean;
    currentParticipant: IParticipant | null;
    fetchParticipants: () => void;
    handleClose?: () => void;
    deposition: DepositionModel.IDeposition;
}

const EditParticipantModal = ({
    visible,
    currentParticipant,
    fetchParticipants,
    handleClose,
    isCourtReporterPresent,
    deposition,
}: IModalProps) => {
    // TODO: Replace Roles with new roles constant in any place that´s using it

    const roles = isCourtReporterPresent
        ? ROLES.filter((item) => item !== "Court Reporter")
        : ROLES.filter((item) => item !== Roles.witness);

    const INITIAL_STATE = {
        email: {
            value: "",
            invalid: false,
        },
        name: {
            value: "",
            invalid: false,
        },
        phone: {
            value: "",
            invalid: false,
        },
        role: {
            value: "",
            invalid: false,
        },
    };

    const [formState, setFormState] = useState(INITIAL_STATE);
    const [showConfirm, toggleConfirm] = useState(false);
    const [editParticipant, loading, error, addedParticipant] = useEditParticipant();
    const wasEmailChangedRef = useRef(false);
    const addAlert = useFloatingAlertContext();

    useEffect(() => {
        if (addedParticipant) {
            addAlert({
                message: wasEmailChangedRef.current
                    ? CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_CONFIRMED_DEPOSITION_TOAST
                    : CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NO_CONFIRMED_DEPOSITION_TOAST,
                type: "success",
                duration: 3,
            });
            fetchParticipants();
            handleClose();
            wasEmailChangedRef.current = false;
            toggleConfirm(false);
        }
    }, [addedParticipant, handleClose, fetchParticipants, addAlert]);

    useEffect(() => {
        if (error) {
            addAlert({
                message: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [error, addAlert]);

    useEffect(() => {
        setFormState({
            email: {
                value: currentParticipant?.email,
                invalid: false,
            },
            phone: {
                value: currentParticipant?.phone || currentParticipant?.user?.phoneNumber,
                invalid: false,
            },
            name: {
                value: currentParticipant?.name,
                invalid: false,
            },
            role: {
                value: normalizedRoles[currentParticipant?.role] || currentParticipant?.role,
                invalid: false,
            },
        });
    }, [visible, currentParticipant]);

    const handleSubmitParticipant = () => {
        const body = {
            name: formState.name.value?.trim(),
            email: formState.email.value?.trim(),
            phone: formState.phone.value?.trim(),
            id: currentParticipant.id,
            role: removeWhiteSpace(formState.role.value),
        };
        return editParticipant(deposition.id, body);
    };
    const handleSubmit = () => {
        const { email, phone } = formState;
        const isEmailInvalid = email.value ? isInvalidEmail(email.value) : false;
        const isPhoneNotValid = phone.value ? isPhoneInvalid(phone.value) : false;

        if (isPhoneNotValid || isEmailInvalid) {
            return setFormState({
                ...formState,
                email: { ...email, invalid: isEmailInvalid },
                phone: { ...phone, invalid: isPhoneNotValid },
            });
        }
        if (
            currentParticipant?.email !== formState.email.value &&
            formState.email.value &&
            deposition.status === Status.confirmed
        ) {
            wasEmailChangedRef.current = true;
        }
        return wasEmailChangedRef.current ? toggleConfirm(true) : handleSubmitParticipant();
    };

    const handleCancel = () => {
        if (loading) {
            return;
        }
        wasEmailChangedRef.current = false;
        handleClose();
    };

    return (
        <Modal destroyOnClose visible={visible} centered onlyBody onCancel={handleCancel}>
            <Confirm
                positiveLoading={loading}
                visible={showConfirm}
                positiveLabel={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_CONFIRM_POSITIVE_LABEL}
                onNegativeClick={() => {
                    if (loading) {
                        return;
                    }
                    toggleConfirm(false);
                }}
                onPositiveClick={handleSubmitParticipant}
                negativeLabel={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_CONFIRM_NEGATIVE_LABEL}
                title={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_TITLE}
                subTitle={`Are you sure you want to edit ${
                    formState.name.value || CONSTANTS.DEPOSITION_DETAILS_NO_NAME_FOR_PARTICIPANT
                }? The participant will be notified by email about this invitation.`}
            />
            <Space direction="vertical" size="large" fullWidth>
                <Space.Item fullWidth>
                    <Title dataTestId={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_ID} level={4} weight="light">
                        {CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_TITLE}
                    </Title>
                </Space.Item>
                <Space.Item fullWidth>
                    <Form layout="vertical" preserve={false}>
                        <Space direction="vertical" size="small" fullWidth>
                            <Space.Item fullWidth>
                                <Form.Item label="ROLE" htmlFor="role">
                                    <InputWrapper>
                                        <Select
                                            disabled={formState.role.value === Roles.witness}
                                            value={formState.role.value}
                                            invalid={formState.role.invalid}
                                            onChange={(value) =>
                                                setFormState({
                                                    ...formState,
                                                    role: {
                                                        value,
                                                        invalid: false,
                                                    },
                                                })
                                            }
                                            data-testid={
                                                formState.role.value === Roles.witness
                                                    ? CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_ROLE_INPUT_ID_DISABLED
                                                    : CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_ROLE_INPUT_ID
                                            }
                                            placeholder={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_ROLE_PLACEHOLDER}
                                        >
                                            {roles.map((item) => (
                                                <Select.Option data-testid={item} value={item} key={item}>
                                                    {item}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item label="EMAIL ADDRESS (OPTIONAL)" htmlFor="email">
                                    <InputWrapper>
                                        <Input
                                            disabled={currentParticipant?.user?.isGuest === false}
                                            value={formState.email.value}
                                            invalid={formState.email.invalid}
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    email: {
                                                        value: e.target.value,
                                                        invalid: false,
                                                    },
                                                })
                                            }
                                            data-testid={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_EMAIL_INPUT_ID}
                                            name="email"
                                            placeholder={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_EMAIL_PLACEHOLDER
                                            }
                                        />
                                    </InputWrapper>
                                    {formState.email.invalid && (
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
                                <Form.Item label="NAME (OPTIONAL)" htmlFor="name">
                                    <InputWrapper>
                                        <Input
                                            disabled={currentParticipant?.user?.isGuest === false}
                                            maxLength={50}
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    name: {
                                                        value: e.target.value,
                                                        invalid: false,
                                                    },
                                                })
                                            }
                                            invalid={formState.name.invalid}
                                            value={formState.name.value}
                                            name="name"
                                            data-testid={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NAME_INPUT_ID}
                                            placeholder={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_NAME_PLACEHOLDER}
                                        />
                                    </InputWrapper>
                                </Form.Item>
                                <Form.Item label="PHONE NUMBER (OPTIONAL)" htmlFor="phone">
                                    <InputWrapper>
                                        <Input
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    phone: {
                                                        value: e.target.value,
                                                        invalid: false,
                                                    },
                                                })
                                            }
                                            disabled={currentParticipant?.user?.isGuest === false}
                                            invalid={formState.phone.invalid}
                                            value={formState.phone.value}
                                            data-testid={CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_PHONE_INPUT_ID}
                                            name="phone"
                                            placeholder={
                                                CONSTANTS.DEPOSITION_DETAILS_EDIT_PARTICIPANT_PHONE_PLACEHOLDER
                                            }
                                        />
                                    </InputWrapper>
                                    {formState.phone.invalid && (
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
                            </Space.Item>
                        </Space>
                        <Row justify="end">
                            <Space size="large">
                                <Button
                                    disabled={loading}
                                    data-testid={CONSTANTS.DEPOSITION_DETAILS_CANCEL_BUTTON_ID}
                                    type="text"
                                    onClick={handleCancel}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_CANCEL_BUTTON_LABEL}
                                </Button>
                                <Button
                                    disabled={loading}
                                    loading={loading}
                                    data-testid={CONSTANTS.DEPOSITION_DETAILS_SAVE_BUTTON_ID}
                                    onClick={handleSubmit}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_SAVE_BUTTON_LABEL}
                                </Button>
                            </Space>
                        </Row>
                    </Form>
                </Space.Item>
            </Space>
        </Modal>
    );
};
export default EditParticipantModal;
