import React from "react";
import { Form, Row, Space } from "antd";
import { useHistory } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import Button from "../../components/Button";
import Title from "../../components/Typography/Title";
import CaseSection from "./CaseSection";
import WitnessesSection from "./WitnessesSection";
import DetailsSection from "./DetailsSection";
import RequesterSection from "./RequesterSection";
import OtherParticipantsSection from "./OtherParticipantsSection";
import * as CONSTANTS from "../../constants/createDeposition";
import DepositionSchema from "../../schemas/DepositionSchema";
import { useFetchCases } from "../../hooks/cases/hooks";
import { useScheduleDepositions } from "../../hooks/depositions/hooks";
import CreateDepositionResultCard from "./CreateDepositionResultCard";
import mapDepositions from "../../helpers/mapDepositions";

const CreateDeposition = () => {
    const [createdDepositions, setCreatedDepositions] = React.useState(0);

    const { error: fetchingCasesError, data, loading: loadingCases, refreshList } = useFetchCases();
    const [scheduleDepositions, loading, error, response] = useScheduleDepositions();

    const cases = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);
    const history = useHistory();

    const methods = useForm({
        mode: "onTouched",
        resolver: yupResolver(DepositionSchema),
        defaultValues: CONSTANTS.CREATE_DEPOSITION_DEFAULT_VALUES,
    });

    React.useEffect(() => {
        if (response) setCreatedDepositions(methods.watch("depositions").length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    const handleResetForm = () => {
        setCreatedDepositions(0);
        methods.reset(CONSTANTS.CREATE_DEPOSITION_DEFAULT_VALUES);
    };

    const submitDepositions = (values) => {
        const {
            depositions,
            requesterPhone,
            requesterName,
            requesterEmail,
            caseId,
            details,
            otherParticipants,
        } = values;
        const normalizedParticipants = otherParticipants?.map((participant) => ({
            ...participant,
            role: participant?.role.replace(/\s/g, ""),
        }));

        const { files, mappedDepositions } = mapDepositions({
            depositions,
            requesterPhone,
            requesterName,
            requesterEmail,
            details,
            normalizedParticipants,
        });

        scheduleDepositions({ depositionList: mappedDepositions, files, caseId });
    };

    return createdDepositions || fetchingCasesError ? (
        <CreateDepositionResultCard
            addNewCase={handleResetForm}
            createdDepositions={createdDepositions}
            goToDepositions={() => {
                history.push("/depositions");
            }}
            refreshCasesList={refreshList}
            type={fetchingCasesError ? "error" : "success"}
        />
    ) : (
        <FormProvider {...methods}>
            <Form onFinish={methods.handleSubmit(submitDepositions)} layout="vertical">
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Title level={4} noMargin weight="light">
                        Schedule Deposition
                    </Title>
                    <CaseSection cases={cases} loadingCases={loadingCases} fetchingError={fetchingCasesError} />
                    <WitnessesSection />
                    <OtherParticipantsSection />
                    <DetailsSection />
                    <RequesterSection invalidRequester={error === 404 && "Invalid email"} />
                    <Row justify="end">
                        <Space size="large">
                            <Button
                                type="text"
                                onClick={() => {
                                    if (history.length === 2) {
                                        return history.push("/dashboard");
                                    }
                                    return history.goBack();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                data-testid="create_deposition_button"
                                loading={loading}
                                htmlType="submit"
                                onClick={methods.handleSubmit(submitDepositions)}
                                type="primary"
                            >
                                {CONSTANTS.SCHEDULE_DEPOSITION}
                            </Button>
                        </Space>
                    </Row>
                </Space>
            </Form>
        </FormProvider>
    );
};

export default CreateDeposition;
