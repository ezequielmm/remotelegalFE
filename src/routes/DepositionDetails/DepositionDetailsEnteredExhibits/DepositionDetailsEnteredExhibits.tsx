import React, { useEffect } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import Title from "../../../components/Typography/Title";
import Button from "../../../components/Button";
import {
    DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE,
    DEPOSITION_DETAILS_DOWNLOAD_TITLE,
} from "../../../constants/depositionDetails";
import { useEnteredExhibit } from "../../../hooks/useEnteredExhibits";

import EnteredExhibitsTable from "./EnteredExhibitsTable";
import { StyledEnteredContainer } from "./styles";
import Space from "../../../components/Space";

export default function DepositionDetailsEnteredExhibits() {
    const { handleFetchFiles, enteredExhibits, enteredExhibitsPending } = useEnteredExhibit();

    useEffect(() => {
        handleFetchFiles();
    }, [handleFetchFiles]);

    return (
        <StyledEnteredContainer>
            <Space mb={4} justify="space-between" align="flex-end">
                <Space.Item>
                    <Title level={5} weight="light" dataTestId="entered_exhibits_title">
                        {DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE}
                    </Title>
                </Space.Item>
                <Space.Item>
                    <Button type="default" size="small" data-testid="download_button" onClick={() => {}} disabled>
                        <DownloadOutlined />
                        {DEPOSITION_DETAILS_DOWNLOAD_TITLE}
                    </Button>
                </Space.Item>
            </Space>
            <EnteredExhibitsTable loading={enteredExhibitsPending} dataSource={enteredExhibits || []} />
        </StyledEnteredContainer>
    );
}
