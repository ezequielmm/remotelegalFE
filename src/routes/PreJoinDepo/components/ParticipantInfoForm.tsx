import { Form } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import Text from "../../../components/Typography/Text";
import Button from "../../../components/Button";
import Wizard from "../../../components/Wizard";
import { InputWrapper } from "../../../components/Input/styles";
import isInputEmpty from "../../../helpers/isInputEmpty";
import ColorStatus from "../../../types/ColorStatus";
import * as CONSTANTS from "../../../constants/preJoinDepo";

interface IParticipantForm {
    nameInput: boolean;
    roleInput: boolean;
    email?: string;
    backButton?: boolean;
    loading?: boolean;
    returnFunc?: () => void;
    joinDeposition?: (name?: string, role?: string) => void;
}

const StyledEmailContainer = styled.div`
    margin-bottom: 24px;
`;

const ParticipantInfoForm = ({
    nameInput,
    roleInput,
    email,
    backButton,
    loading,
    returnFunc,
    joinDeposition,
}: IParticipantForm) => {
    const [name, setName] = useState("");
    const [nameInvalid, setNameInvalid] = useState(false);
    const [roleInvalid, setRoleInvalid] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    const handleRoleChange = (value: string) => {
        if (roleInvalid) {
            setRoleInvalid(false);
        }
        setRole(value);
    };

    const handleSubmit = () => {
        // TODO: Modify this function to handle different scenarios
        const nameInputInvalid = nameInput && isInputEmpty(name);
        const roleInputInvalid = roleInput && role === null;

        if (nameInputInvalid) {
            setNameInvalid(true);
        }
        if (roleInputInvalid) {
            setRoleInvalid(true);
        }
        if (!nameInputInvalid && !roleInputInvalid) {
            return joinDeposition(name, role);
        }
        return null;
    };
    return (
        <Form layout="vertical" onFinish={handleSubmit}>
            {email && (
                <StyledEmailContainer>
                    <Text uppercase state={ColorStatus.disabled} size="small" block>
                        {CONSTANTS.EMAIL_TEXT}
                    </Text>
                    <Text block>{email}</Text>
                </StyledEmailContainer>
            )}
            {nameInput && (
                <Form.Item label="Full Name" htmlFor="name">
                    <InputWrapper>
                        <Input
                            onChange={(e) => {
                                if (nameInvalid) {
                                    setNameInvalid(false);
                                }
                                setName(e.target.value);
                            }}
                            invalid={nameInvalid}
                            maxLength={50}
                            value={name}
                            name="name"
                            placeholder={CONSTANTS.NAME_PLACEHOLDER}
                            data-testid={CONSTANTS.NAME_INPUT_ID}
                        />
                    </InputWrapper>
                    {nameInvalid && (
                        <Text size="small" state={ColorStatus.error}>
                            {CONSTANTS.INVALID_NAME_MESSAGE}
                        </Text>
                    )}
                </Form.Item>
            )}
            {roleInput && (
                <Form.Item label="Role" htmlFor="role">
                    <InputWrapper>
                        <Select
                            aria-label="role"
                            invalid={roleInvalid}
                            data-testid="role-select"
                            value={role}
                            placeholder={CONSTANTS.ROLE_INPUT}
                            onChange={handleRoleChange}
                        >
                            {CONSTANTS.ROLES.map((item) => (
                                <Select.Option data-testid={item} value={item} key={item}>
                                    {item}
                                </Select.Option>
                            ))}
                        </Select>
                    </InputWrapper>
                    {roleInvalid && (
                        <Text size="small" state={ColorStatus.error}>
                            {CONSTANTS.INVALID_ROLE_MESSAGE}
                        </Text>
                    )}
                </Form.Item>
            )}
            <Wizard.Actions>
                {backButton && (
                    <Button
                        style={{ textTransform: "uppercase" }}
                        data-testid={CONSTANTS.BACK_BUTTON_ID}
                        onClick={returnFunc}
                        disabled={loading}
                        type="link"
                        htmlType="submit"
                    >
                        {CONSTANTS.PREVIOUS_BUTTON}
                    </Button>
                )}
                <Button
                    loading={loading}
                    data-testid={CONSTANTS.STEP_2_BUTTON_ID}
                    disabled={loading}
                    onClick={handleSubmit}
                    type="primary"
                    htmlType="submit"
                >
                    {CONSTANTS.JOIN_DEPOSITION_BUTTON}
                </Button>
            </Wizard.Actions>
        </Form>
    );
};
export default ParticipantInfoForm;
