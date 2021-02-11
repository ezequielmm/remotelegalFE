import React, { ReactElement, useContext, useState } from "react";
import { Col, Tooltip } from "antd";
import { StyledExhibitViewerHeader } from "../styles";
import Text from "../../../../../components/Typography/Text";
import Button from "../../../../../components/Button";
import Icon from "../../../../../components/Icon";
import { ReactComponent as backIcon } from "../../../../../assets/in-depo/back.svg";
import ExhibitSharingModal from "../ExhibitSharingModal";
import { ExhibitFile } from "../../../../../types/ExhibitFile";
import { useShareExhibitFile } from "../../../../../hooks/exhibits/hooks";
import ColorStatus from "../../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../../state/GlobalState";
import { StyledCloseButton } from "./styles";
import ExhibitClosingModal from "../ExhibitClosingModal";
import * as CONSTANTS from "../../../../../constants/exhibits";

interface Props {
    file: ExhibitFile;
    onClose?: () => void;
    showBackButton?: boolean;
    showCloseButton?: boolean;
    showShareButton?: boolean;
}

export default function ExhibitViewerHeader({
    file,
    onClose,
    showBackButton = true,
    showCloseButton = true,
    showShareButton = false,
}: Props): ReactElement {
    const [sharingModalOpen, setSharingModalOpen] = useState(false);
    const [closingModalOpen, setClosingModalOpen] = useState(false);
    const {
        shareExhibit,
        shareExhibitPending,
        sharedExhibit,
        closeSharedExhibit,
        pendingCloseSharedExhibit,
    } = useShareExhibitFile();
    const { state } = useContext(GlobalStateContext);
    const { isRecording, stampLabel } = state.room;

    const onShareOkHandler = () => {
        shareExhibit(file);
        setSharingModalOpen(false);
    };

    const onCloseSharedExhibitHandler = () => {
        closeSharedExhibit();
    };

    return (
        <StyledExhibitViewerHeader align="middle" data-testid="view-document-header">
            <ExhibitSharingModal
                destroyOnClose
                loading={shareExhibitPending}
                file={sharedExhibit}
                visible={sharingModalOpen}
                onShareOk={onShareOkHandler}
                onShareCancel={() => setSharingModalOpen(false)}
            />
            <ExhibitClosingModal
                file={file}
                isStamped={!!stampLabel}
                visible={closingModalOpen}
                loading={pendingCloseSharedExhibit}
                onKeepSharedExhibit={() => setClosingModalOpen(false)}
                onCloseSharedExhibit={onCloseSharedExhibitHandler}
            />
            <Col md={6} xxl={4}>
                {showBackButton && (
                    <Text state={ColorStatus.white}>
                        <Icon data-testid="view-document-back-button" icon={backIcon} size={6} onClick={onClose} />
                    </Text>
                )}
            </Col>
            <Col md={12} xxl={16}>
                <Tooltip title={file?.displayName}>
                    <Text size="large" state={ColorStatus.white} block align="center">
                        {file?.displayName}
                    </Text>
                </Tooltip>
            </Col>
            <Col md={6} xxl={4} style={{ textAlign: "right" }}>
                {showCloseButton && (
                    <StyledCloseButton
                        onClick={() => setClosingModalOpen(true)}
                        type="primary"
                        size="small"
                        data-testid="close_document_button"
                    >
                        {CONSTANTS.CLOSE_SHARED_EXHIBIT_BUTTON_LABEL}
                    </StyledCloseButton>
                )}
                {showShareButton && (
                    <Button
                        onClick={() => setSharingModalOpen(!sharingModalOpen)}
                        disabled={!isRecording}
                        type="primary"
                        size="small"
                        loading={shareExhibitPending}
                        data-testid="view_document_share_button"
                    >
                        {CONSTANTS.SHARE_EXHIBIT_BUTTON_LABEL}
                    </Button>
                )}
            </Col>
        </StyledExhibitViewerHeader>
    );
}
