import React from "react";
import Button from "@rl/prp-components-library/src/components/Button";
import CardResult from "@rl/prp-components-library/src/components/CardResult";
import Icon from "@rl/prp-components-library/src/components/Icon";
import { CustomStatus } from "@rl/prp-components-library/src/components/Result/Result";
import Space from "@rl/prp-components-library/src/components/Space";
import * as CONSTANTS from "../../../constants/createDeposition";
import CardFetchError from "../../../components/CardFetchError";
import { ReactComponent as SuccessCreateIcon } from "../../../assets/icons/success-schedule.svg";

interface CreateDepositionResultCardProps {
    addNewCase: () => void;
    createdDepositions: number;
    goToDepositions: () => void;
    refreshCasesList: () => void;
    type: "success" | "error";
}

export default function CreateDepositionResultCard({
    addNewCase,
    createdDepositions,
    goToDepositions,
    refreshCasesList,
    type,
}: CreateDepositionResultCardProps) {
    return type === "error" ? (
        <CardFetchError onClick={refreshCasesList} />
    ) : (
        <CardResult
            data-testid="deposition_created_successful"
            title={CONSTANTS.getSuccessDepositionTitle(createdDepositions)}
            subTitle={CONSTANTS.SUCCESS_DEPOSITION_SUBTITLE}
            status={CustomStatus.successCreate}
            icon={<Icon icon={SuccessCreateIcon} />}
            extra={
                <Space direction="vertical" size="small" justify="center" align="center" fullWidth>
                    <Button
                        data-testid="schedule_new_deposition_button"
                        type="primary"
                        onClick={addNewCase}
                        key="success_card_new_case_button"
                    >
                        {CONSTANTS.SCHEDULE_NEW_DEPOSITION}
                    </Button>
                    <Button
                        data-testid="go_to_deposition_button"
                        type="text"
                        onClick={goToDepositions}
                        key="success_card_go_to_deposition_button"
                    >
                        {CONSTANTS.GO_TO_DEPOSITIONS}
                    </Button>
                </Space>
            }
        />
    );
}
