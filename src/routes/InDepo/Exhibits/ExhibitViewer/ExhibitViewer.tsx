import { Col, Row } from "antd";
import React, { ReactElement, useContext } from "react";
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
    annotations?: [];
    onAnnotationChange?: (data: AnnotationPayload) => void;
}

export const ExhibitViewer = ({
    file,
    onClose,
    showBackButtonOnHeader = true,
    showCloseButtonOnHeader = false,
    showShareButtonOnHeader = false,
    annotations,
    onAnnotationChange,
}: Props): ReactElement => {
    const { state } = useContext(GlobalStateContext);
    const { exhibitTab, permissions } = state.room;
    const { pending, error, documentUrl } = useSignedUrl(file?.id, file?.preSignedUrl);

    return (
        <StyledExhibitViewerContainer>
            <ExhibitViewerHeader
                file={file}
                onClose={onClose}
                showBackButton={showBackButtonOnHeader}
                showCloseButton={showCloseButtonOnHeader}
                showShareButton={showShareButtonOnHeader}
            />
            {pending && <Spinner />}
            {documentUrl && (
                <PDFTronViewer
                    canStamp={permissions.includes(DepositionModel.DepositionPermissionsTypes.stampExhibit)}
                    showStamp={exhibitTab === LIVE_EXHIBIT_TAB}
                    document={documentUrl}
                    filename={file?.displayName}
                    annotations={annotations}
                    onAnnotationChange={onAnnotationChange}
                />
            )}
            {!!error && (
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col sm={18} lg={14} xl={13} xxl={9}>
                        <Result
                            icon={<Icon icon={MyExhibitsIcon} style={{ fontSize: "6rem" }} />}
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
