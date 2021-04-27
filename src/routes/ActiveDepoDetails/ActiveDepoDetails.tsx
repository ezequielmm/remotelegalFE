import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import CardFetchError from "../../components/CardFetchError";
import Space from "../../components/Space";
import Spinner from "../../components/Spinner";
import Title from "../../components/Typography/Title";
import { DEPOSITION_DETAILS_TITLE } from "../../constants/activeDepositionDetails";
import { useFetchDeposition } from "../../hooks/depositions/hooks";
import ActiveDepositionDetailsHeader from "./components/ActiveDepoDetailsHeader";
import ActiveDepositionDetailsTabs from "./components/ActiveDepoDetailsTabs";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import { Status } from "../../components/StatusPill/StatusPill";

export default function ActiveDepositionDetails() {
    const { fetchDeposition, loading, deposition, error } = useFetchDeposition();
    const [updatedDeposition, setUpdatedDeposition] = useState(null);
    const [activeKey, setActiveKey] = useState(CONSTANTS.DEFAULT_ACTIVE_TAB);
    const history = useHistory();

    useEffect(() => {
        fetchDeposition();
    }, [fetchDeposition]);

    useEffect(() => {
        if (deposition?.status === Status.completed) {
            history.push(`/deposition/post-depo-details/${deposition.id}`);
        }
    }, [deposition, history]);

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
