import React from "react";
import { ThemeProvider } from "styled-components";
import Icon from "prp-components-library/src/components/Icon";
import Modal from "prp-components-library/src/components/Modal";
import Result from "prp-components-library/src/components/Result";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import Drawer from "prp-components-library/src/components/Drawer";
import { ReactComponent as HelpIcon } from "../../../assets/layout/Help.svg";
import * as CONSTANTS from "../../../constants/help";
import { theme } from "../../../constants/styles/theme";
import ColorStatus from "../../../types/ColorStatus";
import useWindowSize from "../../../hooks/useWindowSize";
import { ThemeMode } from "../../../types/ThemeType";

export interface IModalProps {
    visible?: boolean;
    closeModal?: () => void;
    jobNumber?: string;
}

const HelpResult = ({ jobNumber }: IModalProps) => {
    return (
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
                        <Text dataTestId="job_number" size="extralarge" state={ColorStatus.disabled} ellipsis={false}>
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
    );
};

const HelpModal = ({ visible, closeModal, jobNumber }: IModalProps) => {
    const [windowWidth] = useWindowSize();
    const widthMorethanLg = windowWidth >= parseInt(theme.default.breakpoints.lg, 10);
    const renderModal = widthMorethanLg ? (
        <Modal destroyOnClose visible={visible} centered onlyBody onCancel={closeModal}>
            <HelpResult jobNumber={jobNumber} />
        </Modal>
    ) : (
        <ThemeProvider theme={{ ...theme, mode: ThemeMode.default }}>
            <Drawer zIndex={3000} placement="bottom" height="100%" visible={visible} onClose={closeModal}>
                <Space direction="vertical" fullHeight align="center" justify="center">
                    <HelpResult jobNumber={jobNumber} />
                </Space>
            </Drawer>
        </ThemeProvider>
    );
    return renderModal;
};
export default HelpModal;
