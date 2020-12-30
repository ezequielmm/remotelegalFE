import { Col, Row } from "antd";
import React, { ReactElement } from "react";
import Icon from "../../../../../components/Icon";
import PDFTronViewer from "../../../../../components/PDFTronViewer";
import Result from "../../../../../components/Result";
import Spinner from "../../../../../components/Spinner";
import { useSignedUrl } from "../../../../../hooks/exhibits/hooks";
import { StyledViewDocumentContainer } from "./styles";
import ViewDocumentHeader from "./ViewDocumentHeader";
import { ReactComponent as MyExhibitsIcon } from "../../../../../assets/icons/MyExhibits-empty.svg";
import { theme } from "../../../../../constants/styles/theme";
import { EXHIBIT_FILE_ERROR_TITLE, EXHIBIT_FILE_ERROR_SUBTITLE } from "../../../../../constants/exhibits";

interface Props {
    documentId: string;
    fileName: string;
    onClose?: () => void;
}

export const ViewDocument = ({ documentId, fileName, onClose }: Props): ReactElement => {
    const { pending, error, documentUrl } = useSignedUrl(documentId);
    return (
        <StyledViewDocumentContainer>
            <ViewDocumentHeader fileName={fileName} onClose={onClose} disabled />
            {!!(pending && !documentUrl && !error) && <Spinner />}
            {!!(documentUrl && !error) && <PDFTronViewer document={documentUrl} filename={fileName} />}
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
        </StyledViewDocumentContainer>
    );
};
export default ViewDocument;
