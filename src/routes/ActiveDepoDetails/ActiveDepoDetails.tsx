import React, { useEffect } from "react";
import CardFetchError from "../../components/CardFetchError";
import Space from "../../components/Space";
import Spinner from "../../components/Spinner";
import Title from "../../components/Typography/Title";
import { DEPOSITION_DETAILS_TITLE } from "../../constants/activeDepositionDetails";
import { useFetchDeposition } from "../../hooks/depositions/hooks";
import ActiveDepositionDetailsHeader from "./components/ActiveDepoDetailsHeader";
import ActiveDepositionDetailsTabs from "./components/ActiveDepoDetailsTabs";

export default function ActiveDepositionDetails() {
    const { fetchDeposition, loading, deposition, error } = useFetchDeposition();

    useEffect(() => {
        fetchDeposition();
    }, [fetchDeposition]);

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
                    {DEPOSITION_DETAILS_TITLE}
                </Title>
                <ActiveDepositionDetailsHeader deposition={deposition} />
            </Space>
            <ActiveDepositionDetailsTabs deposition={deposition} />
        </>
    );
}
