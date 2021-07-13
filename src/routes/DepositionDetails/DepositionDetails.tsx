import { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import Space from "prp-components-library/src/components/Space";
import Spinner from "prp-components-library/src/components/Spinner";
import { Status } from "prp-components-library/src/components/StatusPill/StatusPill";
import Title from "prp-components-library/src/components/Title";
import Icon from "prp-components-library/src/components/Icon";
import CardFetchError from "../../components/CardFetchError";
import { ReactComponent as BackIcon } from "../../assets/general/Back.svg";
import { DEPOSITION_BACK_TO_DEPOSITIONS, DEPOSITION_DETAILS_TITLE } from "../../constants/depositionDetails";
import { useFetchDeposition } from "../../hooks/depositions/hooks";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/PostDepo/PostDepoActions";
import DepositionDetailsHeader from "./DepositionDetailsHeader";
import DepositionDetailsTabs from "./DepositionDetailsTabs";
import { StyledLink } from "./styles";

export default function DepositionDetails() {
    const { dispatch } = useContext(GlobalStateContext);
    const history = useHistory();
    const { fetchDeposition, loading, deposition, error } = useFetchDeposition();

    useEffect(() => {
        fetchDeposition();
    }, [fetchDeposition]);

    useEffect(() => {
        if (deposition && deposition.status && deposition.status !== Status.completed) history.push("/depositions");
        if (deposition) {
            dispatch(actions.setDeposition(deposition));
        }
    }, [history, deposition, dispatch]);

    if (loading) {
        return <Spinner height="100%" />;
    }

    if (error) {
        return <CardFetchError onClick={fetchDeposition} />;
    }

    return (
        <>
            <Space direction="vertical" size="large">
                <Space.Item style={{ margin: 0 }}>
                    <StyledLink
                        icon={<Icon data-testid="depo_detail_back_button" icon={BackIcon} />}
                        type="link"
                        onClick={() => history.push("/depositions")}
                        size="small"
                    >
                        {DEPOSITION_BACK_TO_DEPOSITIONS}
                    </StyledLink>
                </Space.Item>
                <Space.Item>
                    <Title level={4} noMargin weight="light">
                        {DEPOSITION_DETAILS_TITLE}
                    </Title>
                </Space.Item>
                <DepositionDetailsHeader deposition={deposition} />
            </Space>
            <DepositionDetailsTabs deposition={deposition} />
        </>
    );
}
