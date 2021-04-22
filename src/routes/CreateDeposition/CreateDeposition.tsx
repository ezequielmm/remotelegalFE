import React, { useState } from "react";
import { Form } from "antd";
import { useHistory } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import Space from "../../components/Space";
import Button from "../../components/Button";
import Title from "../../components/Typography/Title";
import CaseSection from "./CaseSection";
import WitnessesSection from "./WitnessesSection";
import DetailsSection from "./DetailsSection";
import RequesterSection from "./RequesterSection";
import OtherParticipantsSection from "./OtherParticipantsSection";
import * as CONSTANTS from "../../constants/createDeposition";
import getDepositionSchema from "../../schemas/DepositionSchema";
import { useFetchCases } from "../../hooks/cases/hooks";
import { useScheduleDepositions } from "../../hooks/depositions/hooks";
import CreateDepositionResultCard from "./CreateDepositionResultCard";
import mapDepositions from "../../helpers/mapDepositions";
import { useUserIsAdmin } from "../../hooks/users/hooks";

const CreateDeposition = () => {
    const [createdDepositions, setCreatedDepositions] = React.useState(0);
    const [checkIfUserIsAdmin, loadingUserIsAdmin, errorUserIsAdmin, userIsAdmin] = useUserIsAdmin();
    const { error: fetchingCasesError, data, loading: loadingCases, refreshList } = useFetchCases();
    const [scheduleDepositions, loading, error, response] = useScheduleDepositions();
    const [selectedCaseId, setSelectedCaseId] = useState("");
    const [invalidCase, setInvalidCase] = useState(false);
    const cases = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);
    const history = useHistory();

    const methods = useForm({
        mode: "onTouched",
        resolver: yupResolver(getDepositionSchema(userIsAdmin)),
        defaultValues: CONSTANTS.CREATE_DEPOSITION_DEFAULT_VALUES,
    });

    React.useEffect(() => {
        if (response) setCreatedDepositions(methods.watch("depositions").length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response]);

    React.useEffect(() => {
        checkIfUserIsAdmin();
    }, [checkIfUserIsAdmin]);

    const handleResetForm = () => {
        setCreatedDepositions(0);
        methods.reset(CONSTANTS.CREATE_DEPOSITION_DEFAULT_VALUES);
    };

    const submitDepositions = (values) => {
        if (!selectedCaseId) {
            return;
        }
        const { depositions, requesterPhone, requesterName, requesterEmail, details, otherParticipants } = values;
        const normalizedParticipants = otherParticipants?.map((participant) => ({
            ...participant,
            email: participant.email === "" ? null : participant.email,
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

        scheduleDepositions({
            depositionList: mappedDepositions,
            files,
            caseId: selectedCaseId,
        });
    };

    return createdDepositions || fetchingCasesError || errorUserIsAdmin ? (
        <CreateDepositionResultCard
            addNewCase={handleResetForm}
            createdDepositions={createdDepositions}
            goToDepositions={() => {
                history.push("/depositions");
            }}
            type={fetchingCasesError || errorUserIsAdmin ? "error" : "success"}
            refreshCasesList={() => {
                if (errorUserIsAdmin) {
                    checkIfUserIsAdmin();
                }
                if (fetchingCasesError) {
                    refreshList();
                }
            }}
        />
    ) : (
        <FormProvider {...methods}>
            <Form onFinish={methods.handleSubmit(submitDepositions)} layout="vertical">
                <Space direction="vertical" size="large">
                    <Space.Item>
                        <Title dataTestId="schedule_deposition_title" level={4} noMargin weight="light">
                            Schedule Deposition
                        </Title>
                    </Space.Item>
                    <CaseSection
                        invalidCase={invalidCase}
                        setInvalidCase={setInvalidCase}
                        selectedCaseId={selectedCaseId}
                        setSelectedCaseId={setSelectedCaseId}
                        fetchCases={refreshList}
                        cases={cases}
                        loadingCases={loadingCases}
                        fetchingError={fetchingCasesError}
                    />
                    <WitnessesSection />
                    <OtherParticipantsSection />
                    <DetailsSection />
                    {userIsAdmin && <RequesterSection invalidRequester={error === 404 && "Invalid email"} />}
                    <Space size="large" justify="flex-end" fullWidth>
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
                            loading={loading || loadingUserIsAdmin}
                            htmlType="submit"
                            onClick={() => {
                                if (!selectedCaseId) {
                                    setInvalidCase(true);
                                }
                            }}
                            type="primary"
                        >
                            {CONSTANTS.SCHEDULE_DEPOSITION}
                        </Button>
                    </Space>
                </Space>
            </Form>
        </FormProvider>
    );
};

export default CreateDeposition;
