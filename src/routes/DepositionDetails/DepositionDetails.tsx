import React, { useEffect } from "react";
import { useHistory } from "react-router";
import CardFetchError from "../../components/CardFetchError";
import Space from "../../components/Space";
import Spinner from "../../components/Spinner";
import { Status } from "../../components/StatusPill/StatusPill";
import Title from "../../components/Typography/Title";
import { DEPOSITON_DETAILS_TITLE } from "../../constants/depositionDetails";
import { useFetchDeposition } from "../../hooks/depositions/hooks";
import DepositionDetailsHeader from "./DepositionDetailsHeader";
import DepositionDetailsTabs from "./DepositionDetailsTabs";

export default function DepositionDetails() {
    const history = useHistory();
    const { fetchDeposition, loading, deposition, error } = useFetchDeposition();

    useEffect(() => {
        fetchDeposition();
    }, [fetchDeposition]);

    useEffect(() => {
        if (deposition && deposition.status && deposition.status !== Status.completed) history.push("/depositions");
    }, [history, deposition]);

    if (loading) {
        return <Spinner height="100%" />;
    }

    if (error) {
        return <CardFetchError onClick={fetchDeposition} />;
    }

    return (
        <>
            <Space direction="vertical" size="large">
                <Title level={4} noMargin weight="light">
                    {DEPOSITON_DETAILS_TITLE}
                </Title>
                <DepositionDetailsHeader deposition={deposition} />
            </Space>
            <DepositionDetailsTabs />
        </>
    );
}
