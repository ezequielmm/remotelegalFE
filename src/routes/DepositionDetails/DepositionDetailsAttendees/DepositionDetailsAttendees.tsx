import { useEffect, useState, useContext } from "react";
import Space from "prp-components-library/src/components/Space";
import Table from "prp-components-library/src/components/Table";
import Title from "prp-components-library/src/components/Title";
import CardFetchError from "../../../components/CardFetchError";
import {
    DEPOSITION_DETAILS_ATTENDEES_TITLE,
    DEPOSITION_DETAILS_ATTENDEES_COLUMNS,
    DEPOSITION_DETAILS_TABS,
    DEPOSITION_DETAILS_ATTENDEES_TEST_ID,
} from "../../../constants/depositionDetails";
import normalizedRoles from "../../../constants/roles";
import { useFetchParticipants } from "../../../hooks/activeDepositionDetails/hooks";
import { IParticipant } from "../../../models/participant";
import { GlobalStateContext } from "../../../state/GlobalState";

export default function DepositionDetailsAttendees({
    depositionID,
    activeKey,
}: {
    depositionID: string;
    activeKey: string;
}) {
    const [fetchAttendees, loading, error, attendees] = useFetchParticipants();
    const [mappedParticipants, setMappedAttendees] = useState([]);
    const { state } = useContext(GlobalStateContext);
    const { currentUser } = state?.user;

    useEffect(() => {
        if (fetchAttendees && depositionID && activeKey === DEPOSITION_DETAILS_TABS.attendees)
            fetchAttendees(depositionID);
    }, [activeKey, fetchAttendees, depositionID]);

    useEffect(() => {
        if (attendees && !!currentUser?.isAdmin !== undefined) {
            const attendeesArray = attendees.map((participant: IParticipant) => {
                const { email, id, name, phone, role, user } = participant;
                return {
                    id,
                    name: user ? `${user.firstName} ${user.lastName}` : name,
                    user,
                    email: !currentUser?.isAdmin && role === "Witness" ? "" : email,
                    phone: !currentUser?.isAdmin && role === "Witness" ? "" : phone || user?.phoneNumber,
                    role: normalizedRoles[role] || role,
                };
            });
            setMappedAttendees(attendeesArray);
        }
    }, [attendees, currentUser]);

    if (error) {
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
                loading={loading}
                dataSource={mappedParticipants || []}
            />
        </Space>
    );
}
