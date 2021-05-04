import React from "react";
import Modal from "../../Modal";
import Result from "../../Result";
import Text from "../../Typography/Text";
import Space from "../../Space";
import Icon from "../../Icon";
import { ReactComponent as HelpIcon } from "../../../assets/layout/Help.svg";
import * as CONSTANTS from "../../../constants/help";
import { theme } from "../../../constants/styles/theme";
import ColorStatus from "../../../types/ColorStatus";

interface IModalProps {
    visible: boolean;
    closeModal: () => void;
    jobNumber?: string;
}

const HelpModal = ({ visible, closeModal, jobNumber }: IModalProps) => {
    return (
        <Modal destroyOnClose visible={visible} centered onlyBody onCancel={closeModal}>
            <Result
                title={CONSTANTS.HELP_TITLE}
                subTitle={
                    <Space direction="vertical" align="center">
                        <Text state={ColorStatus.disabled} ellipsis={false}>
                            <>
                                {CONSTANTS.HELP_MODAL_CONTENT1}
                                <Text size="large" state={ColorStatus.disabled} weight="bold" ellipsis={false}>
                                    {CONSTANTS.HELP_CONTENT2}
                                </Text>{" "}
                                {CONSTANTS.HELP_CONTENT3}
                                <Text size="large" state={ColorStatus.disabled} weight="bold" ellipsis={false}>
                                    {CONSTANTS.HELP_CONTENT4}
                                </Text>
                                .
                            </>
                        </Text>
                        {jobNumber && (
                            <Text
                                dataTestId="job_number"
                                size="extralarge"
                                state={ColorStatus.disabled}
                                ellipsis={false}
                            >
                                <>
                                    Job #<strong>{jobNumber}</strong>
                                </>
                            </Text>
                        )}
                    </Space>
                }
                status="info"
                icon={<Icon icon={HelpIcon} />}
                titleColor={theme.default.textColor}
            />
        </Modal>
    );
};
export default HelpModal;
