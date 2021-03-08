import React, { ReactElement, useEffect } from "react";
import { Col, Row, Form } from "antd";
import { IConfirmProps } from "../../../../../../components/Confirm/Confirm";
import Confirm from "../../../../../../components/Confirm";
import * as CONSTANTS from "../../../../../../constants/exhibits";
import Text from "../../../../../../components/Typography/Text";
import { InputWrapper } from "../../../../../../components/Input/styles";
import useInput from "../../../../../../hooks/useInput";
import ColorStatus from "../../../../../../types/ColorStatus";
import { ExhibitFile } from "../../../../../../types/ExhibitFile";
import { useDeleteExhibit } from "../../../../../../hooks/useDeleteExhibit";

export type ModalMode = "rename" | "delete";

interface Props extends IConfirmProps {
    mode: ModalMode;
    file?: ExhibitFile;
    onError?: () => void;
    onRenameOk: (value: string) => void;
    onRenameCancel: () => void;
    onDeleteOk: () => void;
    onDeleteCancel: () => void;
}

export default function FileListActionModal({
    mode,
    onError,
    onRenameOk,
    onDeleteOk,
    onRenameCancel,
    onDeleteCancel,
    file,
    ...props
}: Props): ReactElement {
    const { inputValue, input, invalid } = useInput();
    const { deleteExhibit, pendingDelete, errorDelete } = useDeleteExhibit();
    const exhibitNameErrorMessage = invalid && "Please enter a new exhibit name";

    useEffect(() => {
        if (errorDelete) {
            onError();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorDelete]);
    const renameForm = (
        <Form layout="vertical">
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="Exhibit Name">
                        <InputWrapper>
                            {input}
                            <Text size="small" state={ColorStatus.error}>
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
            positiveLoading={pendingDelete}
            onPositiveClick={async () => {
                if (mode === "rename") {
                    onRenameOk(inputValue);
                } else {
                    await deleteExhibit(file?.id);
                    onDeleteOk();
                }
            }}
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
