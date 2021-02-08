import React, { useContext, useEffect, useState } from "react";
import { Row, Col } from "antd";
import { useParams } from "react-router-dom";
import { useFileList, useUploadFile } from "../../../../hooks/exhibits/hooks";
import { MY_EXHIBITS_RESULT_SUBTITLE, MY_EXHIBITS_RESULT_TITLE } from "../../../../constants/exhibits";
import Space from "../../../../components/Space";
import Result from "../../../../components/Result";
import { CustomStatus } from "../../../../components/Result/Result";
import Icon from "../../../../components/Icon";
import { ReactComponent as MyExhibitsIcon } from "../../../../assets/icons/MyExhibits-empty.svg";
import Text from "../../../../components/Typography/Text";
import Badge from "../../../../components/Badge";

import { ExhibitTabPaneSpacer, ScrollTableContainer } from "../styles";
import UploadButton from "./UploadButton";
import FileListTable from "./FileListTable";
import ExhibitViewer from "../ExhibitViewer";
import { theme } from "../../../../constants/styles/theme";
import { ExhibitFile } from "../../../../types/ExhibitFile";
import ColorStatus from "../../../../types/ColorStatus";
import { GlobalStateContext } from "../../../../state/GlobalState";
import { EXHIBIT_TABS } from "../../../../constants/exhibits";

export default function MyExhibits() {
    const { depositionID } = useParams<{ depositionID: string }>();
    const { upload } = useUploadFile(depositionID);
    const { handleFetchFiles, loading, errorFetchFiles, files, refreshList } = useFileList(depositionID);
    const [selectedFile, setSelectedFile] = useState<ExhibitFile>(null);
    const { state } = useContext(GlobalStateContext);
    const { currentExhibitTabName } = state.room;
    useEffect(() => {
        if (currentExhibitTabName === EXHIBIT_TABS.myExhibits) {
            handleFetchFiles();
        }
    }, [handleFetchFiles, currentExhibitTabName]);

    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            {!selectedFile && (
                <>
                    <Space size="middle" align="center">
                        <Text size="large" state={ColorStatus.white}>
                            My Exhibits
                        </Text>
                        <Badge count={files?.length || 0} />
                    </Space>
                    <ScrollTableContainer direction="vertical" size="large">
                        <UploadButton onUpload={upload} onUploadCompleted={refreshList} />
                        {files?.length > 0 && (
                            <FileListTable
                                data-testid="file-list-table"
                                loading={loading}
                                dataSource={files}
                                pagination={false}
                                sortDirections={["descend", "ascend"]}
                                onClickViewFile={setSelectedFile}
                                onChange={handleFetchFiles}
                            />
                        )}
                        {(files?.length === 0 || errorFetchFiles) && (
                            <Row justify="center" align="middle" style={{ height: "100%" }}>
                                <Col sm={18} lg={14} xl={13} xxl={9}>
                                    <Result
                                        icon={<Icon icon={MyExhibitsIcon} size="6rem" />}
                                        title={MY_EXHIBITS_RESULT_TITLE}
                                        subTitle={MY_EXHIBITS_RESULT_SUBTITLE}
                                        status={CustomStatus.empty}
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
                />
            )}
        </ExhibitTabPaneSpacer>
    );
}
