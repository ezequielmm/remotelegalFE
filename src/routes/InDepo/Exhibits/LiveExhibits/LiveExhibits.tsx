import React from "react";
import { Row, Col } from "antd";
import Result from "../../../../components/Result";
import Icon from "../../../../components/Icon";
import { CustomStatus } from "../../../../components/Result/Result";
import { LIVE_EXHIBITS_SUBTITLE, LIVE_EXHIBITS_TITLE } from "../../../../constants/exhibits";
import { ReactComponent as LiveExhibitsIcon } from "../../../../assets/icons/LiveExhibits-empty.svg";
import { ExhibitTabPaneSpacer } from "../styles";
import { theme } from "../../../../constants/styles/theme";
import ExhibitViewer from "../ExhibitViewer";
import { useExhibitSendAnnotation, useShareExhibitFile } from "../../../../hooks/exhibits/hooks";
import { TOOLBAR_GROUP_ANNOTATE, TOOLBAR_GROUP_VIEW } from "../../../../constants/PDFTronViewer";

export default function LiveExhibits() {
    const { sharedExhibit, closeSharedExhibit } = useShareExhibitFile();
    const { sendAnnotation } = useExhibitSendAnnotation();

    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large" className="live-exhibit">
            {sharedExhibit && (
                <ExhibitViewer
                    showShareButtonOnHeader={!sharedExhibit}
                    showBackButtonOnHeader={false}
                    showCloseButtonOnHeader={sharedExhibit?.close}
                    file={sharedExhibit}
                    onClose={closeSharedExhibit}
                    onAnnotationChange={sendAnnotation}
                    pdfTronDisableElements={sharedExhibit?.isPublic ? [TOOLBAR_GROUP_ANNOTATE, TOOLBAR_GROUP_VIEW] : []}
                    readOnly={sharedExhibit?.isPublic}
                    shouldGetAnnotations
                    realTimeAnnotations
                />
            )}
            {!sharedExhibit && (
                <Row justify="center" align="middle" style={{ height: "100%" }}>
                    <Col sm={18} lg={14} xl={13} xxl={9}>
                        <Result
                            icon={<Icon icon={LiveExhibitsIcon} size="6rem" />}
                            title={LIVE_EXHIBITS_TITLE}
                            subTitle={LIVE_EXHIBITS_SUBTITLE}
                            status={CustomStatus.successCreate}
                            titleColor={theme.default.primaryColor}
                            subTitleColor={theme.default.whiteColor}
                        />
                    </Col>
                </Row>
            )}
        </ExhibitTabPaneSpacer>
    );
}
