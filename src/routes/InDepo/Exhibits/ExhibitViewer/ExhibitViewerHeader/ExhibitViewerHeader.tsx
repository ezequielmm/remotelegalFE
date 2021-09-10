import { ReactElement, useContext, useState } from "react";
import { Tooltip } from "antd";
import Button from "prp-components-library/src/components/Button";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import styled from "styled-components";
import { StyledExhibitViewerHeader } from "../styles";
import { ReactComponent as backIcon } from "../../../../../assets/in-depo/back.svg";
import { ReactComponent as downloadIcon } from "../../../../../assets/icons/download.svg";
import { ReactComponent as stampIcon } from "../../../../../assets/icons/Stamp.svg";
import ExhibitSharingModal from "../ExhibitSharingModal";
import { ExhibitFile } from "../../../../../types/ExhibitFile";
import { useShareExhibitFile } from "../../../../../hooks/exhibits/hooks";
import ColorStatus from "../../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../../state/GlobalState";
import { StyledCloseButton } from "./styles";
import ExhibitClosingModal from "../ExhibitClosingModal";
import * as CONSTANTS from "../../../../../constants/exhibits";
import StampModal from "../../../../../components/PDFTronViewer/components/StampModal";
import downloadFile from "../../../../../helpers/downloadFile";
import Message from "../../../../../components/Message";

const StyledSpaceItem = styled(Space.Item)`
    overflow: hidden;
`;

interface Props {
    file: ExhibitFile;
    onClose?: () => void;
    onBringAllToMe?: () => void;
    onStamp?: (stampLabel: string) => void;
    onClosePending?: boolean;
    showBackButton?: boolean;
    showCloseButton?: boolean;
    showShareButton?: boolean;
    showBringAllToMeButton?: boolean;
    readOnly?: boolean;
    canDownload?: boolean;
    downloadUrl?: string | null;
    canStamp?: boolean;
}

export default function ExhibitViewerHeader({
    file,
    onClose,
    onBringAllToMe,
    onStamp,
    onClosePending = false,
    showBackButton = true,
    showCloseButton = true,
    showShareButton = false,
    showBringAllToMeButton = false,
    readOnly = false,
    canDownload = false,
    downloadUrl = null,
    canStamp = false,
}: Props): ReactElement {
    const [sharingModalOpen, setSharingModalOpen] = useState(false);
    const [closingModalOpen, setClosingModalOpen] = useState(false);
    const [openStampModal, setStampModal] = useState(false);
    const { shareExhibit, shareExhibitPending, sharedExhibit } = useShareExhibitFile();
    const { state } = useContext(GlobalStateContext);
    const { isRecording, stampLabel, timeZone } = state.room;

    const onShareOkHandler = () => {
        shareExhibit(file, readOnly);
        setSharingModalOpen(false);
    };

    const onCloseSharedExhibitHandler = () => {
        onClose();
    };

    const stampDocument = (_, stampLabel: string) => {
        onStamp(stampLabel);
    };

    const onHandlerDownloadExhibit = () => {
        if (downloadUrl) {
            downloadFile(downloadUrl);
        }
    };

    return (
        <StyledExhibitViewerHeader align="middle" data-testid="view_document_header">
            <StampModal
                open={openStampModal}
                timeZone={timeZone}
                onConfirm={stampDocument}
                handleClose={setStampModal}
            />
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
            <Space justify={showBackButton ? "flex-start" : "space-between"} fullWidth>
                {showBackButton && (
                    <Space.Item>
                        <Text state={ColorStatus.white}>
                            <Icon data-testid="view-document-back-button" icon={backIcon} size={6} onClick={onClose} />
                        </Text>
                    </Space.Item>
                )}
                <StyledSpaceItem flex="1">
                    <Tooltip title={decodeURI(file?.displayName)}>
                        <Text
                            size="large"
                            state={ColorStatus.white}
                            block
                            align={showBringAllToMeButton ? undefined : "center"}
                        >
                            {decodeURI(file?.displayName)}
                        </Text>
                    </Tooltip>
                </StyledSpaceItem>
                <Space>
                    {canDownload && (
                        <Button
                            onClick={onHandlerDownloadExhibit}
                            type="ghost"
                            size="small"
                            loading={shareExhibitPending}
                            data-testid="view_document_download"
                        >
                            <Icon icon={downloadIcon} size={8} />
                        </Button>
                    )}
                    {canStamp && (
                        <Button
                            onClick={() => {
                                return stampLabel
                                    ? Message({
                                          content: "Please delete the existing stamp and try again",
                                          type: "error",
                                          duration: 3,
                                      })
                                    : setStampModal(true);
                            }}
                            type="ghost"
                            size="small"
                            loading={shareExhibitPending}
                            data-testid="view_document_stamp"
                        >
                            <Icon icon={stampIcon} size={8} />
                        </Button>
                    )}
                    {showBringAllToMeButton && (
                        <Button
                            type="primary"
                            size="small"
                            data-testid="bring_all_to_me_button"
                            onClick={onBringAllToMe}
                        >
                            {CONSTANTS.BRING_ALL_TO_ME_BUTTON_LABEL}
                        </Button>
                    )}
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
                </Space>
            </Space>
        </StyledExhibitViewerHeader>
    );
}
