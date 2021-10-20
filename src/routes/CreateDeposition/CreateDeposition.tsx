import React, { useRef, useState } from "react";
import { Form } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import Space from "@rl/prp-components-library/src/components/Space";
import Title from "@rl/prp-components-library/src/components/Title";
import { useHistory } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import StyledAlert from "@rl/prp-components-library/src/components/Alert/styles";
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
import { GlobalStateContext } from "../../state/GlobalState";
import useCurrentUser from "../../hooks/useCurrentUser";

const CreateDeposition = () => {
    const [createdDepositions, setCreatedDepositions] = React.useState(0);
    const { state } = React.useContext(GlobalStateContext);
    const { currentUser } = state?.user;
    const [getCurrentUser] = useCurrentUser();
    const { error: fetchingCasesError, data, loading: loadingCases, refreshList } = useFetchCases();
    const [scheduleDepositions, loading, error, response] = useScheduleDepositions();
    const [selectedCaseId, setSelectedCaseId] = useState("");
    const [invalidCase, setInvalidCase] = useState(false);
    const cases = React.useMemo(() => (Array.isArray(data) ? data : []), [data]);
    const history = useHistory();

    const methods = useForm({
        mode: "onTouched",
        resolver: yupResolver(getDepositionSchema(!!currentUser?.isAdmin)),
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

    const formRef = useRef(null);

    const handleSubmitClick = () => {
        if (!selectedCaseId) {
            setInvalidCase(true);
        }
        setTimeout(() => {
            const formErrors = formRef.current.querySelectorAll("[data-invalid='true']");
            if (formErrors.length > 0) {
                formErrors[0].closest(".ant-card").scrollIntoView({
                    behavior: "smooth",
                });
            }
        }, 0);
    };

    return createdDepositions || fetchingCasesError || !currentUser ? (
        <CreateDepositionResultCard
            addNewCase={handleResetForm}
            createdDepositions={createdDepositions}
            goToDepositions={() => {
                history.push("/depositions");
            }}
            type={fetchingCasesError || !currentUser ? "error" : "success"}
            refreshCasesList={() => {
                if (fetchingCasesError) {
                    refreshList();
                } else if (!currentUser) {
                    getCurrentUser();
                }
            }}
        />
    ) : (
        <FormProvider {...methods}>
            <div ref={formRef}>
                <Form onFinish={methods.handleSubmit(submitDepositions)} layout="vertical">
                    <Space direction="vertical" size="large">
                        <Space.Item>
                            <Title dataTestId="schedule_deposition_title" level={4} noMargin weight="light">
                                Schedule Deposition
                            </Title>
                        </Space.Item>
                        {!currentUser.isAdmin && (
                            <StyledAlert
                                data-testid={CONSTANTS.SCHEDULED_DEPO_WARNING_TEST_ID}
                                type="warning"
                                closable={false}
                                message={CONSTANTS.SCHEDULED_DEPO_WARNING}
                                showIcon
                            />
                        )}
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
                        <WitnessesSection
                            addWitnessIsEnabled={!!currentUser?.isAdmin}
                            shouldValidateDepoDate={!currentUser?.isAdmin}
                        />
                        <OtherParticipantsSection />
                        <DetailsSection />
                        {!!currentUser?.isAdmin && (
                            <RequesterSection invalidRequester={error === 404 && "Invalid email"} />
                        )}
                        <Space size="large" justify="flex-end" fullWidth>
                            <Button
                                type="text"
                                onClick={() => {
                                    if (history.length === 2) {
                                        return history.push("/depositions");
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
                                onClick={handleSubmitClick}
                                type="primary"
                            >
                                {CONSTANTS.SCHEDULE_DEPOSITION}
                            </Button>
                        </Space>
                    </Space>
                </Form>
            </div>
        </FormProvider>
    );
};

export default CreateDeposition;
