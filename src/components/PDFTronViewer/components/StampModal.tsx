import React, { useRef, useState } from "react";
import { Space, Row, Form } from "antd";
import { InputWrapper } from "../../Input/styles";
import Input from "../../Input";
import Title from "../../Typography/Title";
import Button from "../../Button";
import Modal from "../../Modal";
import StampCanvas from "./StampCanvas";
import * as CONSTANTS from "../../../constants/stampModal";
import { TimeZones } from "../../../models/general";
import { ModalSize } from "../../Modal/Modal";

interface IModalProps {
    open: boolean;
    handleClose: (boolean: boolean) => void;
    onConfirm: (value: string) => void;
    timeZone: TimeZones;
}

const StampModal = ({ open, handleClose, onConfirm, timeZone }: IModalProps) => {
    const [stampTitle, setStampTitle] = useState("EXH-");
    const elementRef = useRef(null);
    let canvasRef = useRef<HTMLCanvasElement>(null);

    const handleOnConfirm = async () => {
        const stampImage = canvasRef?.current.toDataURL();
        onConfirm(stampImage);
    };

    const handleKeyDownEvent = (e) => {
        if (e.key === "Escape") {
            handleClose(false);
        }
    };
    return (
        <Modal
            destroyOnClose
            visible={open}
            centered
            onlyBody
            onCancel={() => handleClose(false)}
            size={ModalSize.small}
        >
            <div ref={elementRef} tabIndex={-1} onKeyDown={handleKeyDownEvent}>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Title level={4} weight="light" noMargin>
                        {CONSTANTS.MODAL_TITLE}
                    </Title>
                    <StampCanvas
                        title={stampTitle}
                        timeZone={timeZone}
                        getRef={(val) => {
                            canvasRef = val;
                        }}
                    />
                    <Form
                        onFinish={() => {
                            handleClose(false);
                            handleOnConfirm();
                        }}
                        layout="vertical"
                    >
                        <Form.Item label="label" htmlFor="stamp-title">
                            <InputWrapper>
                                <Input
                                    data-testid={CONSTANTS.INPUT_DATA_TEST_ID}
                                    maxLength={15}
                                    value={stampTitle}
                                    onChange={(e) => setStampTitle(e.target.value)}
                                    placeholder={CONSTANTS.INPUT_PLACEHOLDER}
                                    name="stamp-title"
                                />
                            </InputWrapper>
                        </Form.Item>
                        <Row justify="end">
                            <Space size="large">
                                <Button
                                    data-testid={CONSTANTS.BUTTON_TESTID}
                                    disabled={!stampTitle.length}
                                    htmlType="submit"
                                    type="primary"
                                >
                                    {CONSTANTS.BUTTON_LABEL}
                                </Button>
                            </Space>
                        </Row>
                    </Form>
                </Space>
            </div>
        </Modal>
    );
};
export default StampModal;
