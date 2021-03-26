import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import Space from "../../../../components/Space";
import Result from "../../../../components/Result";
import Icon from "../../../../components/Icon";
import Badge from "../../../../components/Badge";
import { CustomStatus } from "../../../../components/Result/Result";
import Text from "../../../../components/Typography/Text";
import {
    ENTERED_EXHIBITS_EMPTY_STATE_SUBTITLE,
    ENTERED_EXHIBITS_EMPTY_STATE_TITLE,
    ENTERED_EXHIBITS_TITLE,
} from "../../../../constants/exhibits";
import { ReactComponent as EnteredExhibitsIcon } from "../../../../assets/icons/EnteredExhibits-empty.svg";
import { ExhibitTabPaneSpacer, ScrollTableContainer } from "../styles";
import { theme } from "../../../../constants/styles/theme";
import ColorStatus from "../../../../types/ColorStatus";
import EnteredExhibitsTable from "./EnteredExhibitsTable";
import { ExhibitFile } from "../../../../types/ExhibitFile";
import ExhibitViewer from "../ExhibitViewer";
import { useEnteredExhibit } from "../../../../hooks/useEnteredExhibits";
import { TOOLBAR_GROUP_ANNOTATE, TOOLBAR_GROUP_VIEW } from "../../../../constants/PDFTronViewer";

export default function EnteredExhibits() {
    const {
        handleFetchFiles,
        enteredExhibits = [],
        enteredExhibitsPending,
        enteredExhibitsError,
    } = useEnteredExhibit();
    const [selectedFile, setSelectedFile] = useState<ExhibitFile>(null);
    useEffect(() => {
        handleFetchFiles();
    }, [handleFetchFiles]);
    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            {!selectedFile && (
                <>
                    <Space size="middle">
                        <Text size="large" state={ColorStatus.white}>
                            {ENTERED_EXHIBITS_TITLE}
                        </Text>
                        <Badge count={enteredExhibits?.length || 0} />
                    </Space>
                    <ScrollTableContainer direction="vertical" size="large">
                        {enteredExhibits?.length > 0 && (
                            <EnteredExhibitsTable
                                data-testid="entered_exhibits_table"
                                loading={enteredExhibitsPending}
                                dataSource={enteredExhibits}
                                pagination={false}
                                sortDirections={["descend", "ascend"]}
                                onClickViewFile={setSelectedFile}
                                onChange={handleFetchFiles}
                            />
                        )}
                        {(enteredExhibits?.length === 0 || enteredExhibitsError) && (
                            <Row justify="center" align="middle" style={{ height: "100%" }}>
                                <Col sm={18} lg={14} xl={13} xxl={9}>
                                    <Result
                                        icon={<Icon icon={EnteredExhibitsIcon} style={{ fontSize: "6.1rem" }} />}
                                        title={ENTERED_EXHIBITS_EMPTY_STATE_TITLE}
                                        subTitle={ENTERED_EXHIBITS_EMPTY_STATE_SUBTITLE}
                                        status={CustomStatus.errorFetch}
                                        titleColor={theme.default.primaryColor}
                                        subTitleColor={theme.default.whiteColor}
                                    />
                                </Col>
                            </Row>
                        )}
                    </ScrollTableContainer>
                </>
            )}
            {selectedFile && (
                <ExhibitViewer
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                    showShareButtonOnHeader={true}
                    pdfTronDisableElements={[TOOLBAR_GROUP_ANNOTATE, TOOLBAR_GROUP_VIEW]}
                    readOnly
                />
            )}
        </ExhibitTabPaneSpacer>
    );
}
