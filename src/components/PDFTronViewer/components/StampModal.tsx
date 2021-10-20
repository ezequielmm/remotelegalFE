import { useRef, useState } from "react";
import { Form } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Input from "@rl/prp-components-library/src/components/Input";
import { InputWrapper } from "@rl/prp-components-library/src/components/Input/styles";
import Modal from "@rl/prp-components-library/src/components/Modal";
import { ModalSize } from "@rl/prp-components-library/src/components/Modal/Modal";
import Space from "@rl/prp-components-library/src/components/Space";
import Title from "@rl/prp-components-library/src/components/Title";
import StampCanvas from "./StampCanvas";
import * as CONSTANTS from "../../../constants/stampModal";
import { TimeZones } from "../../../models/general";

interface IModalProps {
    open: boolean;
    handleClose: (boolean: boolean) => void;
    onConfirm: (value: string, label?: string) => void;
    timeZone: TimeZones;
}

const StampModal = ({ open, handleClose, onConfirm, timeZone }: IModalProps) => {
    const [stampTitle, setStampTitle] = useState("EXH-");
    const elementRef = useRef(null);
    let canvasRef = useRef<HTMLCanvasElement>(null);

    const handleOnConfirm = async () => {
        const stampImage = canvasRef?.current.toDataURL();
        onConfirm(stampImage, stampTitle);
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
                <Space direction="vertical" size="large" fullWidth>
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
                        style={{ width: "100%" }}
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
                        <Space size="large" justify="flex-end">
                            <Button
                                data-testid={CONSTANTS.BUTTON_TESTID}
                                disabled={!stampTitle.length}
                                htmlType="submit"
                                type="primary"
                            >
                                {CONSTANTS.BUTTON_LABEL}
                            </Button>
                        </Space>
                    </Form>
                </Space>
            </div>
        </Modal>
    );
};
export default StampModal;
