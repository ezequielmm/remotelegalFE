import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Space from "prp-components-library/src/components/Space";
import Spinner from "prp-components-library/src/components/Spinner";
import { Status } from "prp-components-library/src/components/StatusPill/StatusPill";
import Title from "prp-components-library/src/components/Title";
import CardFetchError from "../../components/CardFetchError";
import { DEPOSITION_DETAILS_TITLE } from "../../constants/activeDepositionDetails";
import { useFetchDeposition } from "../../hooks/depositions/hooks";
import ActiveDepositionDetailsHeader from "./components/ActiveDepoDetailsHeader";
import ActiveDepositionDetailsTabs from "./components/ActiveDepoDetailsTabs";
import * as CONSTANTS from "../../constants/activeDepositionDetails";

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
