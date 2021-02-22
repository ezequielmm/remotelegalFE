import React, { useEffect } from "react";
import { Row } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import Title from "../../../components/Typography/Title";
import Button from "../../../components/Button";
import {
    DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE,
    DEPOSITION_DETAILS_DOWNLOAD_TITLE,
} from "../../../constants/depositionDetails";
import { useEnteredExhibit } from "../../../hooks/exhibits/hooks";

import EnteredExhibitsTable from "./EnteredExhibitsTable";
import { StyledSpace } from "./styles";

export default function DepositionDetailsEnteredExhibits() {
    const { handleFetchFiles, enteredExhibits, enteredExhibitsPending } = useEnteredExhibit();

    useEffect(() => {
        handleFetchFiles();
    }, [handleFetchFiles]);

    return (
        <StyledSpace direction="vertical" size="large">
            <Row justify="space-between" align="bottom">
                <Title level={5} weight="light" dataTestId="entered_exhibits_title">
                    {DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE}
                </Title>
                <Button type="default" size="middle" data-testid="download_button" onClick={() => {}} disabled>
                    <DownloadOutlined />
                    {DEPOSITION_DETAILS_DOWNLOAD_TITLE}
                </Button>
            </Row>
            <EnteredExhibitsTable loading={enteredExhibitsPending} dataSource={enteredExhibits || []} />
        </StyledSpace>
    );
}
