import { Col, Row } from "antd";
import React, { ReactElement, useContext, useState } from "react";
import Icon from "../../../../components/Icon";
import PDFTronViewer from "../../../../components/PDFTronViewer";
import Result from "../../../../components/Result";
import Spinner from "../../../../components/Spinner";
import { useSignedUrl } from "../../../../hooks/exhibits/hooks";
import { StyledExhibitViewerContainer } from "./styles";
import ExhibitViewerHeader from "./ExhibitViewerHeader";
import { ReactComponent as MyExhibitsIcon } from "../../../../assets/icons/EnteredExhibits-empty.svg";
import { theme } from "../../../../constants/styles/theme";
import {
    EXHIBIT_FILE_ERROR_TITLE,
    EXHIBIT_FILE_ERROR_SUBTITLE,
    LIVE_EXHIBIT_TAB,
} from "../../../../constants/exhibits";
import { ExhibitFile } from "../../../../types/ExhibitFile";
import { GlobalStateContext } from "../../../../state/GlobalState";
import { AnnotationPayload, PdfTronViewerProps } from "../../../../components/PDFTronViewer/PDFTronViewer";
import { DepositionModel } from "../../../../models";

interface Props extends PdfTronViewerProps {
    file: ExhibitFile;
    onClose?: () => void;
    showBackButtonOnHeader?: boolean;
    showCloseButtonOnHeader?: boolean;
    showShareButtonOnHeader?: boolean;
    shouldGetAnnotations?: boolean;
    realTimeAnnotations?: boolean;
    onAnnotationChange?: (data: AnnotationPayload) => void;
    pdfTronDisableElements?: string[];
    readOnly?: boolean;
}

export const ExhibitViewer = ({
    file,
    onClose,
    showBackButtonOnHeader = true,
    showCloseButtonOnHeader = false,
    showShareButtonOnHeader = false,
    shouldGetAnnotations = false,
    realTimeAnnotations = false,
    onAnnotationChange,
    pdfTronDisableElements = [],
    readOnly = false,
}: Props): ReactElement => {
    const { state } = useContext(GlobalStateContext);
    const { exhibitTab, permissions } = state.room;
    const { error, documentUrl, isPublic } = useSignedUrl(file, readOnly);
    const [showSpinner, setShowSpinner] = useState(true);

    return (
        <StyledExhibitViewerContainer>
            {showSpinner && <Spinner className="spinner" height="100%" />}
            <ExhibitViewerHeader
                file={file}
                onClose={onClose}
                showBackButton={showBackButtonOnHeader}
                showCloseButton={showCloseButtonOnHeader}
                showShareButton={showShareButtonOnHeader}
                readOnly={isPublic}
            />
            {documentUrl && (
                <PDFTronViewer
                    canStamp={
                        permissions.includes(DepositionModel.DepositionPermissionsTypes.stampExhibit) && !isPublic
                    }
                    showStamp={exhibitTab === LIVE_EXHIBIT_TAB}
                    document={documentUrl}
                    filename={file?.displayName}
                    onAnnotationChange={onAnnotationChange}
                    disableElements={pdfTronDisableElements}
                    readOnly={isPublic}
                    shouldGetAnnotations={shouldGetAnnotations}
                    realTimeAnnotations={realTimeAnnotations}
                    onDocumentReadyToDisplay={() => setShowSpinner(false)}
                />
            )}
            {!!error && (
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col sm={18} lg={14} xl={13} xxl={9}>
                        <Result
                            icon={<Icon icon={MyExhibitsIcon} size="6rem" />}
                            title={EXHIBIT_FILE_ERROR_TITLE}
                            subTitle={EXHIBIT_FILE_ERROR_SUBTITLE}
                            status="error"
                            titleColor={theme.default.primaryColor}
                            subTitleColor={theme.default.whiteColor}
                        />
                    </Col>
                </Row>
            )}
        </StyledExhibitViewerContainer>
    );
};
export default ExhibitViewer;
