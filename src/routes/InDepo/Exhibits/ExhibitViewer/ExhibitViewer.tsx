import { Col, Row } from "antd";
import React, { ReactElement } from "react";
import Icon from "../../../../components/Icon";
import PDFTronViewer from "../../../../components/PDFTronViewer";
import Result from "../../../../components/Result";
import Spinner from "../../../../components/Spinner";
import { useSignedUrl } from "../../../../hooks/exhibits/hooks";
import { StyledExhibitViewerContainer } from "./styles";
import ExhibitViewerHeader from "./ExhibitViewerHeader";
import { ReactComponent as MyExhibitsIcon } from "../../../../assets/icons/EnteredExhibits-empty.svg";
import { theme } from "../../../../constants/styles/theme";
import { EXHIBIT_FILE_ERROR_TITLE, EXHIBIT_FILE_ERROR_SUBTITLE } from "../../../../constants/exhibits";
import { ExhibitFile } from "../../../../types/ExhibitFile";
import { PdfTronViewerProps } from "../../../../components/PDFTronViewer/PDFTronViewer";

interface Props extends PdfTronViewerProps {
    file: ExhibitFile;
    onClose?: () => void;
    showBackButtonOnHeader?: boolean;
    showCloseButtonOnHeader?: boolean;
    showShareButtonOnHeader?: boolean;
}

export const ExhibitViewer = ({
    file,
    onClose,
    showBackButtonOnHeader = true,
    showCloseButtonOnHeader = false,
    showShareButtonOnHeader = false,
}: Props): ReactElement => {
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
            {documentUrl && <PDFTronViewer document={documentUrl} filename={file?.displayName} />}
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
