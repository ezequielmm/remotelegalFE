import { useCallback, useEffect, useState } from "react";
import { Form, Row } from "antd";
import Button from "prp-components-library/src/components/Button";
import Modal from "prp-components-library/src/components/Modal";
import { InputWrapper } from "prp-components-library/src/components/Input/styles";
import Select from "prp-components-library/src/components/Select";
import Space from "prp-components-library/src/components/Space";
import Title from "prp-components-library/src/components/Title";
import * as CONSTANTS from "../../../../constants/editParticipantRole";
import normalizedRoles, { ROLES } from "../../../../constants/roles";
import useEditParticipantRole from "../../../../hooks/useEditParticipantRole";
import removeWhiteSpace from "../../../../helpers/removeWhitespace";
import { IIdentity } from "../../../../constants/identity";

export interface IModalProps {
    visible: boolean;
    currentParticipant?: IIdentity | null;
    onClose?: (participantResult: any) => void;
    onUpdateRole?: (token: string, role?: string) => void;
    onExistingWitnessError?: (error: any) => void;
}

const EditParticipantRoleModal = ({
    visible,
    currentParticipant,
    onClose,
    onUpdateRole,
    onExistingWitnessError,
}: IModalProps) => {
    const INITIAL_STATE = {
        email: {
            value: "",
            invalid: false,
        },
        role: {
            value: "",
            invalid: false,
        },
    };

    const [formState, setFormState] = useState(INITIAL_STATE);
    const { editParticipantRole, loading } = useEditParticipantRole(onClose, onUpdateRole, onExistingWitnessError);
    const allowedRoles = [...ROLES.filter((role) => role !== "Court Reporter"), "Witness"];

    useEffect(() => {
        setFormState({
            email: {
                value: currentParticipant?.email,
                invalid: false,
            },
            role: {
                value: normalizedRoles[currentParticipant?.role] || currentParticipant?.role,
                invalid: false,
            },
        });
    }, [visible, currentParticipant]);

    const handleSubmit = useCallback(() => {
        const { role } = formState;

        if (!role?.value) {
            return setFormState({
                ...formState,
                role: { ...role, invalid: true },
            });
        }

        const email = formState.email.value?.trim();
        const body = {
            email,
            role: removeWhiteSpace(formState.role.value),
        };
        return editParticipantRole(body);
    }, [editParticipantRole, formState]);

    const handleCancel = () => {
        if (loading) {
            return;
        }
        onClose(null);
    };

    return (
        <Modal destroyOnClose visible={visible} centered onlyBody onCancel={handleCancel}>
            <Space direction="vertical" size="large" fullWidth>
                <Space.Item fullWidth>
                    <Title level={4} weight="light">
                        {CONSTANTS.EDIT_PARTICIPANT_ROLE_TITLE}
                    </Title>
                </Space.Item>
                <Space.Item fullWidth>
                    <Form layout="vertical" preserve={false}>
                        <Space direction="vertical" size="small" fullWidth>
                            <Space.Item fullWidth>
                                <Form.Item label="ROLE" htmlFor="role">
                                    <InputWrapper>
                                        <Select
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
                                            data-testid="edit-participant-role-options"
                                        >
                                            {allowedRoles.map((role) => (
                                                <Select.Option
                                                    data-testid={`participant-role-name-${role}`}
                                                    value={role}
                                                    key={role}
                                                    disabled={currentParticipant?.role === role}
                                                >
                                                    {role}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </InputWrapper>
                                </Form.Item>
                            </Space.Item>
                        </Space>
                        <Row justify="end">
                            <Space size="large">
                                <Button
                                    disabled={loading}
                                    data-testid="edit-participant-role-cancel-button"
                                    type="text"
                                    onClick={handleCancel}
                                >
                                    {CONSTANTS.EDIT_PARTICIPANT_ROLE_CANCEL_BUTTON_LABEL}
                                </Button>
                                <Button
                                    disabled={loading || formState.role.value === currentParticipant?.role}
                                    loading={loading}
                                    data-testid="edit-participant-role-save-button"
                                    onClick={handleSubmit}
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {CONSTANTS.EDIT_PARTICIPANT_ROLE_SAVE_BUTTON_LABEL}
                                </Button>
                            </Space>
                        </Row>
                    </Form>
                </Space.Item>
            </Space>
        </Modal>
    );
};
export default EditParticipantRoleModal;
