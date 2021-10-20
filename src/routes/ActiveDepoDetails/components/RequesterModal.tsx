import React, { SetStateAction, useEffect, useState } from "react";
import { Row, Form } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Modal from "@rl/prp-components-library/src/components/Modal";
import Space from "@rl/prp-components-library/src/components/Space";
import Title from "@rl/prp-components-library/src/components/Title";
import TextArea from "@rl/prp-components-library/src/components/TextArea";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import { DepositionModel } from "../../../models";
import { useEditDeposition } from "../../../hooks/activeDepositionDetails/hooks";
import Message from "../../../components/Message";

interface IModalProps {
    open: boolean;
    handleClose: React.Dispatch<SetStateAction<boolean>>;
    deposition: DepositionModel.IDeposition;
    fetchDeposition: () => void;
}

const EditRequesterNotesModal = ({ open, handleClose, deposition, fetchDeposition }: IModalProps) => {
    const [formStatus, setFormStatus] = useState({ requesterNotes: deposition.requesterNotes });
    const [editDeposition, loading, error, editedDeposition] = useEditDeposition();

    const handleCloseModalAndResetFormStatus = () => {
        handleClose(false);
        setTimeout(
            () =>
                setFormStatus({
                    requesterNotes: deposition.requesterNotes,
                }),
            200
        );
    };

    useEffect(() => {
        if (editedDeposition) {
            Message({
                content: CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST,
                type: "success",
                duration: 3,
            });
            handleClose(false);
            setTimeout(() => fetchDeposition(), 200);
        }
    }, [editedDeposition, fetchDeposition, handleClose]);

    useEffect(() => {
        if (error) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [error]);

    const handleSubmit = () => {
        editDeposition(deposition.id, formStatus);
    };

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
                handleCloseModalAndResetFormStatus();
            }}
        >
            <Space direction="vertical" size="large" fullWidth>
                <Space.Item fullWidth>
                    <Title
                        level={4}
                        weight="light"
                        noMargin
                        dataTestId={CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_TITLE}
                    >
                        {CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_TITLE}
                    </Title>
                </Space.Item>
                <Space.Item fullWidth>
                    <Form layout="vertical">
                        <Form.Item label="Notes">
                            <TextArea
                                name="special_request"
                                data-testid={CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_DATA_TEST_ID_INPUT}
                                value={formStatus.requesterNotes}
                                maxLength={500}
                                onChange={(e) =>
                                    setFormStatus({
                                        ...formStatus,
                                        requesterNotes: e.target.value,
                                    })
                                }
                            />
                        </Form.Item>
                        <Row justify="end">
                            <Space size="large">
                                <Button
                                    disabled={loading}
                                    type="text"
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CANCEL_BUTTON_TEST_ID
                                    }
                                    onClick={handleCloseModalAndResetFormStatus}
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CANCEL_BUTTON_TEXT}
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    data-testid={
                                        CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEST_ID
                                    }
                                    disabled={loading}
                                    loading={loading}
                                    htmlType="submit"
                                    type="primary"
                                >
                                    {CONSTANTS.DEPOSITION_DETAILS_EDIT_REQUESTER_MODAL_CONFIRM_BUTTON_TEXT}
                                </Button>
                            </Space>
                        </Row>
                    </Form>
                </Space.Item>
            </Space>
        </Modal>
    );
};
export default EditRequesterNotesModal;
