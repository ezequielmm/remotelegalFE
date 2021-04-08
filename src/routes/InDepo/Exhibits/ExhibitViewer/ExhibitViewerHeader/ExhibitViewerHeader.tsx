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
    onBringAllToMe?: () => void;
    onClosePending?: boolean;
    showBackButton?: boolean;
    showCloseButton?: boolean;
    showShareButton?: boolean;
    showBringAllToMeButton?: boolean;
    readOnly?: boolean;
}

export default function ExhibitViewerHeader({
    file,
    onClose,
    onBringAllToMe,
    onClosePending = false,
    showBackButton = true,
    showCloseButton = true,
    showShareButton = false,
    showBringAllToMeButton = false,
    readOnly = false,
}: Props): ReactElement {
    const [sharingModalOpen, setSharingModalOpen] = useState(false);
    const [closingModalOpen, setClosingModalOpen] = useState(false);
    const { shareExhibit, shareExhibitPending, sharedExhibit } = useShareExhibitFile();
    const { state } = useContext(GlobalStateContext);
    const { isRecording, stampLabel } = state.room;

    const onShareOkHandler = () => {
        shareExhibit(file, readOnly);
        setSharingModalOpen(false);
    };

    const onCloseSharedExhibitHandler = () => {
        onClose();
    };

    return (
        <StyledExhibitViewerHeader align="middle" data-testid="view_document_header">
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
                loading={onClosePending}
                onKeepSharedExhibit={() => setClosingModalOpen(false)}
                onCloseSharedExhibit={onCloseSharedExhibitHandler}
            />
            {showBackButton && (
                <Col md={6} xxl={4}>
                    <Text state={ColorStatus.white}>
                        <Icon data-testid="view-document-back-button" icon={backIcon} size={6} onClick={onClose} />
                    </Text>
                </Col>
            )}
            <Col md={showBringAllToMeButton ? 14 : showBackButton ? 12 : 24} xxl={16}>
                <Tooltip title={file?.displayName}>
                    <Text
                        size="large"
                        state={ColorStatus.white}
                        block
                        align={showBringAllToMeButton ? undefined : "center"}
                    >
                        {file?.displayName}
                    </Text>
                </Tooltip>
            </Col>
            {showBringAllToMeButton && (
                <Col md={5} xxl={4}>
                    <StyledCloseButton
                        type="primary"
                        size="small"
                        data-testid="bring_all_to_me_button"
                        onClick={onBringAllToMe}
                    >
                        {CONSTANTS.BRING_ALL_TO_ME_BUTTON_LABEL}
                    </StyledCloseButton>
                </Col>
            )}
            <Col md={showBringAllToMeButton ? 5 : 6} xxl={4} style={{ textAlign: "right" }}>
                {showCloseButton && (
                    <StyledCloseButton
                        onClick={() => {
                            if (readOnly) {
                                onClose();
                            } else {
                                setClosingModalOpen(true);
                            }
                        }}
                        loading={onClosePending}
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
