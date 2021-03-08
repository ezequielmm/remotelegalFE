import React, { useEffect, useState } from "react";
import CardFetchError from "../../../components/CardFetchError";
import Space from "../../../components/Space";
import Table from "../../../components/Table";
import Title from "../../../components/Typography/Title";
import {
    DEPOSITION_DETAILS_ATTENDEES_TITLE,
    DEPOSITION_DETAILS_ATTENDEES_COLUMNS,
    DEPOSITION_DETAILS_TABS,
    DEPOSITION_DETAILS_ATTENDEES_TEST_ID,
} from "../../../constants/depositionDetails";
import { useFetchParticipants } from "../../../hooks/activeDepositionDetails/hooks";
import { useUserIsAdmin } from "../../../hooks/users/hooks";
import { IParticipant, Roles } from "../../../models/participant";

export default function DepositionDetailsAttendees({
    depositionID,
    activeKey,
}: {
    depositionID: string;
    activeKey: string;
}) {
    const [fetchAttendees, loading, error, attendees] = useFetchParticipants();
    const [mappedParticipants, setMappedAttendees] = useState([]);
    const [checkIfUserIsAdmin, loadingUserIsAdmin, errorUserIsAdmin, userIsAdmin] = useUserIsAdmin();

    React.useEffect(() => {
        checkIfUserIsAdmin();
    }, [checkIfUserIsAdmin]);

    useEffect(() => {
        if (fetchAttendees && depositionID && activeKey === DEPOSITION_DETAILS_TABS.attendees)
            fetchAttendees(depositionID);
    }, [activeKey, fetchAttendees, depositionID]);

    useEffect(() => {
        if (attendees && userIsAdmin !== undefined) {
            const attendeesArray = attendees.map((participant: IParticipant) => {
                const { email, id, name, phone, role, user } = participant;
                const isCourtReporter = role === Roles.courtReporter;
                return {
                    id,
                    name: user ? `${user.firstName} ${user.lastName}` : name,
                    user,
                    email: !userIsAdmin && role === "Witness" ? "" : email,
                    phone: !userIsAdmin && role === "Witness" ? "" : phone,
                    role: isCourtReporter ? "Court Reporter" : role,
                };
            });
            setMappedAttendees(attendeesArray);
        }
    }, [attendees, userIsAdmin]);

    if (error || errorUserIsAdmin) {
        // TODO: Improve error handling
        return <CardFetchError width="100%" onClick={() => fetchAttendees(depositionID)} />;
    }

    return (
        <Space direction="vertical" size="middle" pt={6} fullWidth>
            <Space justify="space-between" fullWidth>
                <Title level={5} noMargin weight="regular" dataTestId={DEPOSITION_DETAILS_ATTENDEES_TEST_ID}>
                    {DEPOSITION_DETAILS_ATTENDEES_TITLE}
                </Title>
            </Space>
            <Table
                data-testid="entered_exhibits_table"
                columns={DEPOSITION_DETAILS_ATTENDEES_COLUMNS}
                rowKey="id"
                pagination={false}
                style={{ height: "100%" }}
                loading={loading || loadingUserIsAdmin}
                dataSource={mappedParticipants || []}
            />
        </Space>
    );
}
