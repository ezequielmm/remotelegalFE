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
    showCloseButton = false,
    showShareButton = false,
}: Props): ReactElement {
    const [exhibitSharingModalOpen, setExhibitSharingModalOpen] = useState(false);
    const { shareExhibit, shareExhibitPending } = useShareExhibitFile();
    const { state } = useContext(GlobalStateContext);
    const { isRecording } = state.room;

    const onShareOkHandler = () => {
        shareExhibit(file);
        setExhibitSharingModalOpen(false);
    };
    const onShareCancel = () => {
        setExhibitSharingModalOpen(false);
    };
    return (
        <StyledExhibitViewerHeader align="middle" data-testid="view-document-header">
            <ExhibitSharingModal
                file={file}
                visible={exhibitSharingModalOpen}
                onShareOk={onShareOkHandler}
                onShareCancel={onShareCancel}
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
                {showShareButton && (
                    <Button
                        onClick={() => setExhibitSharingModalOpen(!exhibitSharingModalOpen)}
                        disabled={!isRecording}
                        type="primary"
                        size="small"
                        loading={shareExhibitPending}
                        data-testid="view-document-share-button"
                    >
                        Share with all
                    </Button>
                )}
            </Col>
        </StyledExhibitViewerHeader>
    );
}
