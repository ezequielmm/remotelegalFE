import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import CardFetchError from "../../components/CardFetchError";
import Space from "../../components/Space";
import Spinner from "../../components/Spinner";
import { Status } from "../../components/StatusPill/StatusPill";
import Title from "../../components/Typography/Title";
import { DEPOSITON_DETAILS_TITLE } from "../../constants/depositionDetails";
import { useFetchDeposition } from "../../hooks/depositions/hooks";
import { GlobalStateContext } from "../../state/GlobalState";
import actions from "../../state/PostDepo/PostDepoActions";
import DepositionDetailsHeader from "./DepositionDetailsHeader";
import DepositionDetailsTabs from "./DepositionDetailsTabs";

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
                <Space.Item>
                    <Title level={4} noMargin weight="light">
                        {DEPOSITON_DETAILS_TITLE}
                    </Title>
                </Space.Item>
                <DepositionDetailsHeader deposition={deposition} />
            </Space>
            <DepositionDetailsTabs />
        </>
    );
}
