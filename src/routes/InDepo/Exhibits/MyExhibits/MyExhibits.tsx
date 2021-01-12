import React, { useState } from "react";
import { Space, Row, Col } from "antd";
import { useParams } from "react-router-dom";
import { useFileList, useUploadFile } from "../../../../hooks/exhibits/hooks";
import { MY_EXHIBITS_RESULT_SUBTITLE, MY_EXHIBITS_RESULT_TITLE } from "../../../../constants/exhibits";
import Result from "../../../../components/Result";
import { CustomStatus } from "../../../../components/Result/Result";
import Icon from "../../../../components/Icon";
import { ReactComponent as MyExhibitsIcon } from "../../../../assets/icons/MyExhibits-empty.svg";
import Text from "../../../../components/Typography/Text";
import Badge from "../../../../components/Badge";

import { ExhibitTabPaneSpacer, ScrollTableContainer } from "../styles";
import UploadButton from "./UploadButton";
import FileListTable from "./FileListTable";
import ViewDocument from "./ViewDocument";
import { theme } from "../../../../constants/styles/theme";
import { ExhibitFile } from "../../../../types/ExhibitFile";
import ColorStatus from "../../../../types/ColorStatus";

export default function MyExhibits() {
    const { depositionID } = useParams<{ depositionID: string }>();
    const { upload } = useUploadFile(depositionID);
    const { handleFetchFiles, loading, errorFetchFiles, files, refreshList } = useFileList(depositionID);
    const [selectedFile, setSelectedFile] = useState<ExhibitFile>(null);

    return (
        <ExhibitTabPaneSpacer direction="vertical" size="large">
            {!selectedFile && (
                <>
                    <Space size="middle">
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
                                        icon={<Icon icon={MyExhibitsIcon} style={{ fontSize: "6rem" }} />}
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
                <ViewDocument
                    documentId={selectedFile.id}
                    fileName={selectedFile?.displayName}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </ExhibitTabPaneSpacer>
    );
}
