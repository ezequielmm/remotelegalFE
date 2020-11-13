import React from "react";
import { Button, Card } from "antd";
import Result from "../Result";
import Icon from "../Icon";
import { ReactComponent as WarningImage } from "../../assets/icons/warning.svg";

import { FETCH_ERROR_MODAL_TITLE, FETCH_ERROR_MODAL_BODY, FETCH_ERROR_MODAL_BUTTON } from "./constants";

interface FetchingErrorCardProps {
    refreshPage: () => void;
}

export default function FetchingErrorCard({ refreshPage }: FetchingErrorCardProps) {
    return (
        <Card>
            <Result
                title={FETCH_ERROR_MODAL_TITLE}
                subTitle={FETCH_ERROR_MODAL_BODY}
                icon={<Icon icon={WarningImage} />}
                extra={
                    <Button type="primary" key="console" onClick={() => refreshPage()}>
                        {FETCH_ERROR_MODAL_BUTTON}
                    </Button>
                }
            />
        </Card>
    );
}
