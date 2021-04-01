import React, { useEffect, useState } from "react";
import CardFetchError from "../../components/CardFetchError";
import Space from "../../components/Space";
import Spinner from "../../components/Spinner";
import Title from "../../components/Typography/Title";
import { DEPOSITION_DETAILS_TITLE } from "../../constants/activeDepositionDetails";
import { useFetchDeposition } from "../../hooks/depositions/hooks";
import ActiveDepositionDetailsHeader from "./components/ActiveDepoDetailsHeader";
import ActiveDepositionDetailsTabs from "./components/ActiveDepoDetailsTabs";
import * as CONSTANTS from "../../constants/activeDepositionDetails";

export default function ActiveDepositionDetails() {
    const { fetchDeposition, loading, deposition, error } = useFetchDeposition();
    const [updatedDeposition, setUpdatedDeposition] = useState(null);
    const [activeKey, setActiveKey] = useState(CONSTANTS.DEFAULT_ACTIVE_TAB);

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
                <Space.Item>
                    <Title level={4} noMargin weight="light">
                        {DEPOSITION_DETAILS_TITLE}
                    </Title>
                </Space.Item>
                <ActiveDepositionDetailsHeader deposition={updatedDeposition || deposition} />
            </Space>
            <ActiveDepositionDetailsTabs
                activeKey={activeKey}
                setActiveKey={setActiveKey}
                deposition={updatedDeposition || deposition}
                setUpdatedDeposition={setUpdatedDeposition}
            />
        </>
    );
}
