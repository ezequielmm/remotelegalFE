import React, { ReactElement } from "react";
import { IConfirmProps } from "../../../../../../components/Confirm/Confirm";
import Confirm from "../../../../../../components/Confirm";
import * as CONSTANTS from "../../../../../../constants/exhibits";
import { Col, Row, Form } from "antd";
import Text from "../../../../../../components/Typography/Text";
import { InputWrapper } from "../../../../../../components/Input/styles";
import useInput from "../../../../../../hooks/useInput";

export type ModalMode = "rename" | "delete";

interface Props extends IConfirmProps {
    mode: ModalMode;
    onRenameOk: (value: string) => void;
    onRenameCancel: () => void;
    onDeleteOk: () => void;
    onDeleteCancel: () => void;
}

export default function FileListActionModal({
    mode,
    onRenameOk,
    onDeleteOk,
    onRenameCancel,
    onDeleteCancel,
    ...props
}: Props): ReactElement {
    const { inputValue, input, invalid } = useInput();
    const exhibitNameErrorMessage = invalid && "Please enter a new exhibit name";
    const renameForm = (
        <Form layout="vertical">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Exhibit Name">
                        <InputWrapper>
                            {input}
                            <Text size="small" state="error">
                                {exhibitNameErrorMessage}
                            </Text>
                        </InputWrapper>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
    return (
        <Confirm
            {...props}
            destroyOnClose
            onPositiveClick={() => (mode === "rename" ? onRenameOk(inputValue) : onDeleteOk())}
            onNegativeClick={mode === "rename" ? onRenameCancel : onDeleteCancel}
            positiveLabel={
                mode === "rename"
                    ? CONSTANTS.MY_EXHIBITS_RENAME_OK_BUTTON_TEXT
                    : CONSTANTS.MY_EXHIBITS_DELETE_OK_BUTTON_TEXT
            }
            negativeLabel={
                mode === "rename"
                    ? CONSTANTS.MY_EXHIBITS_RENAME_CANCEL_BUTTON_TEXT
                    : CONSTANTS.MY_EXHIBITS_DELETE_CANCEL_BUTTON_TEXT
            }
            title={
                mode === "rename" ? CONSTANTS.MY_EXHIBITS_RENAME_TITLE_TEXT : CONSTANTS.MY_EXHIBITS_DELETE_TITLE_TEXT
            }
            subTitle={
                mode === "rename"
                    ? CONSTANTS.MY_EXHIBITS_RENAME_SUBTITLE_TEXT
                    : CONSTANTS.MY_EXHIBITS_DELETE_SUBTITLE_TEXT
            }
        >
            {mode === "rename" && renameForm}
        </Confirm>
    );
}
