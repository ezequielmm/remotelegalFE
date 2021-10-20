import React from "react";
import Button from "@rl/prp-components-library/src/components/Button";
import CardResult from "@rl/prp-components-library/src/components/CardResult";
import { CustomStatus } from "@rl/prp-components-library/src/components/Result/Result";
import * as ERRORS_CONSTANTS from "../../constants/errors";

export default function CardError({ onClick, width }: { onClick: (ev: React.MouseEvent) => void; width?: string }) {
    return (
        <CardResult
            width={width}
            title={ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE}
            subTitle={ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BODY}
            status={CustomStatus.errorFetch}
            extra={[
                <Button type="primary" onClick={onClick} key="console" data-testid="error_modal_button">
                    {ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BUTTON}
                </Button>,
            ]}
        />
    );
}
