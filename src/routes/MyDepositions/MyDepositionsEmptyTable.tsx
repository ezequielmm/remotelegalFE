import Button from "prp-components-library/src/components/Button";
import { useHistory } from "react-router";
import Icon from "prp-components-library/src/components/Icon";
import Space from "prp-components-library/src/components/Space";
import Text from "prp-components-library/src/components/Text";
import { ReactComponent as DepositionIcon } from "../../assets/icons/deposition.svg";
import * as CONSTANTS from "../../constants/depositions";
import ColorStatus from "../../types/ColorStatus";
import { FilterCriteria } from "../../types/DepositionFilterCriteriaType";

interface MyDepositionsEmptyProps {
    type?: string;
}

const MyDepositionsEmptyTable = ({ type }: MyDepositionsEmptyProps) => {
    const history = useHistory();
    return (
        <>
            <Space direction="vertical" align="center" data-testid="empty_depo_table_section">
                <Icon color={ColorStatus.disabled} size="3rem" icon={DepositionIcon} />
                <Text size="extralarge" weight="light" ellipsis={false} state={ColorStatus.disabled} font="header">
                    {type === FilterCriteria.UPCOMING
                        ? CONSTANTS.EMPTY_UPCOMING_DEPOSITIONS_TITLE
                        : CONSTANTS.EMPTY_PAST_DEPOSITIONS_TITLE}
                </Text>
            </Space>
            {type === FilterCriteria.UPCOMING && (
                <Space justify="center" pt={9}>
                    <Button type="primary" onClick={() => history.push("/deposition/new")}>
                        {CONSTANTS.EMPTY_STATE_BUTTON}
                    </Button>
                </Space>
            )}
        </>
    );
};

export default MyDepositionsEmptyTable;
