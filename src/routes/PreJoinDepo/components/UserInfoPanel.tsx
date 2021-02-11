import React, { Dispatch, SetStateAction } from "react";
import { Form } from "antd";
import { InputWrapper } from "../../../components/Input/styles";
import Text from "../../../components/Typography/Text";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import * as CONSTANTS from "../../../constants/preJoinDepo";
import ColorStatus from "../../../types/ColorStatus";
import { InputState } from "../../../types/PreJoinDepo";

interface IUserInfoPanelProps {
    nameInput: boolean;
    passwordInput?: boolean;
    setName: Dispatch<SetStateAction<InputState>>;
    roleInput: boolean;
    role: InputState;
    password?: InputState;
    name: InputState;
    disableRoleSelect?: boolean;
    setPassword?: Dispatch<SetStateAction<InputState>>;
    setRole: Dispatch<SetStateAction<InputState>>;
}

const UserInfoPanel = ({
    nameInput,
    roleInput,
    role,
    disableRoleSelect,
    setName,
    name,
    setRole,
    passwordInput,
    password,
    setPassword,
}: IUserInfoPanelProps) => (
    <>
        {passwordInput && (
            <Form.Item label="Password" htmlFor="password">
                <InputWrapper>
                    <Input
                        onChange={(e) => {
                            setPassword({ ...password, value: e.target.value, invalid: false });
                        }}
                        type="password"
                        invalid={password.invalid}
                        maxLength={50}
                        value={password.value}
                        name="password"
                        placeholder={CONSTANTS.PASSWORD_PLACEHOLDER}
                        data-testid={CONSTANTS.PASSWORD_INPUT_ID}
                    />
                </InputWrapper>
                {password.invalid && (
                    <Text size="small" state={ColorStatus.error}>
                        {CONSTANTS.INVALID_PASSWORD_MESSAGE}
                    </Text>
                )}
            </Form.Item>
        )}
        {nameInput && (
            <Form.Item label="Full Name" htmlFor="name">
                <InputWrapper>
                    <Input
                        onChange={(e) => {
                            setName({ ...name, value: e.target.value, invalid: false });
                        }}
                        invalid={name.invalid}
                        maxLength={50}
                        value={name.value}
                        name="name"
                        placeholder={CONSTANTS.NAME_PLACEHOLDER}
                        data-testid={CONSTANTS.NAME_INPUT_ID}
                    />
                </InputWrapper>
                {name.invalid && (
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
                        invalid={role.invalid}
                        data-testid={
                            disableRoleSelect ? CONSTANTS.DISABLED_ROLE_INPUT_ID : CONSTANTS.ENABLED_ROLE_INPUT_ID
                        }
                        value={role.value}
                        placeholder={CONSTANTS.ROLE_INPUT}
                        onChange={(value) => setRole({ ...role, value, invalid: false })}
                        disabled={disableRoleSelect}
                    >
                        {CONSTANTS.ROLES.map((item) => (
                            <Select.Option data-testid={item} value={item} key={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </Select>
                </InputWrapper>
                {role.invalid && (
                    <Text size="small" state={ColorStatus.error}>
                        {CONSTANTS.INVALID_ROLE_MESSAGE}
                    </Text>
                )}
            </Form.Item>
        )}
    </>
);
export default UserInfoPanel;
