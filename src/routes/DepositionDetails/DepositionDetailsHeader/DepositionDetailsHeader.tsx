import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import { ThemeProvider } from "styled-components";
import { Col, Row, Tooltip } from "antd";
import Card from "../../../components/Card";
import Space from "../../../components/Space";
import Icon from "../../../components/Icon";
import Title from "../../../components/Typography/Title";
import Text from "../../../components/Typography/Text";
import { ReactComponent as CasesIcon } from "../../../assets/layout/Cases.svg";
import { ReactComponent as DepositionsIcon } from "../../../assets/layout/Depositions.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/icons/calendar.svg";
import { ReactComponent as JobIcon } from "../../../assets/icons/job_detail.svg";
import ColorStatus from "../../../types/ColorStatus";
import StatusPill from "../../../components/StatusPill";
import { theme } from "../../../constants/styles/theme";
import { ThemeMode } from "../../../types/ThemeType";
import { DepositionModel } from "../../../models";
import * as CONSTANTS from "../../../constants/depositionDetails";
import { CustomGridSpace, TitleWrapper } from "../styles";
import { mapTimeZone } from "../../../models/general";

const DepositionDetailsHeader = ({ deposition }: { deposition: DepositionModel.IDeposition }) => {
    const [formattedDates, setFormattedDates] = useState<string[]>([]);
    const { caseName, caseNumber, witness, completeDate, startDate, status, timeZone, job } = deposition || {};

    useEffect(() => {
        if (!startDate || !completeDate) return;
        const formattedStartDate =
            startDate && moment(startDate).tz(mapTimeZone[timeZone]).format(CONSTANTS.FORMAT_TIME).split(" ");
        const formattedCompleteDate =
            completeDate && moment(completeDate).tz(mapTimeZone[timeZone]).format(CONSTANTS.FORMAT_TIME);
        setFormattedDates([
            (formattedCompleteDate.split(" ")[1] === formattedStartDate[1]
                ? formattedStartDate[0]
                : formattedStartDate.join(" ")
            ).toLowerCase(),
            formattedCompleteDate.toLowerCase(),
        ]);
    }, [startDate, completeDate, timeZone]);

    return (
        <Card bg={theme.colors.neutrals[0]} hasPadding={false} fullWidth>
            <Space px={9} py={6} fullWidth>
                <Row style={{ width: "100%" }} gutter={theme.default.baseUnit}>
                    <Col xl={7}>
                        <Space>
                            <Icon icon={CasesIcon} size={8} color={ColorStatus.primary} />
                            <CustomGridSpace>
                                <Text size="small" uppercase state={ColorStatus.white} lineHeight={1.25}>
                                    {CONSTANTS.DEPOSITION_DETAILS_HEADER_CASE}
                                </Text>
                                <Tooltip title={caseName}>
                                    <TitleWrapper>
                                        <Title
                                            dataTestId="deposition_details_header_case_name"
                                            level={6}
                                            weight="light"
                                            color={ColorStatus.white}
                                            noMargin
                                        >
                                            {caseName}
                                        </Title>
                                    </TitleWrapper>
                                </Tooltip>
                                <Text
                                    dataTestId="deposition_details_header_case_number"
                                    size="small"
                                    uppercase
                                    state={ColorStatus.disabled}
                                    lineHeight={1.25}
                                >
                                    {caseNumber}
                                </Text>
                            </CustomGridSpace>
                        </Space>
                    </Col>
                    <Col xl={5}>
                        <Space>
                            <Icon icon={DepositionsIcon} size={8} color={ColorStatus.primary} />
                            <CustomGridSpace>
                                <Text size="small" uppercase state={ColorStatus.white} lineHeight={1.25}>
                                    {CONSTANTS.DEPOSITION_DETAILS_HEADER_WITNESS}
                                </Text>
                                <Tooltip title={witness?.name}>
                                    <TitleWrapper>
                                        <Title
                                            dataTestId="deposition_details_header_witness_name"
                                            level={6}
                                            weight="light"
                                            color={ColorStatus.white}
                                            noMargin
                                        >
                                            {witness?.name}
                                        </Title>
                                    </TitleWrapper>
                                </Tooltip>
                            </CustomGridSpace>
                        </Space>
                    </Col>
                    <Col xl={5}>
                        <Space>
                            <Icon icon={CalendarIcon} size={8} color={ColorStatus.primary} />
                            <CustomGridSpace>
                                <Text size="small" uppercase state={ColorStatus.white} lineHeight={1.25}>
                                    {CONSTANTS.DEPOSITION_DETAILS_HEADER_DATE}
                                </Text>
                                <Tooltip title={startDate && moment(startDate).format("MMM D, YYYY")}>
                                    <TitleWrapper>
                                        <Title
                                            dataTestId="deposition_details_header_date"
                                            level={6}
                                            weight="light"
                                            color={ColorStatus.white}
                                            noMargin
                                        >
                                            {startDate && moment(startDate).format("MMM D, YYYY")}
                                        </Title>
                                    </TitleWrapper>
                                </Tooltip>
                                <Text
                                    dataTestId="deposition_details_header_time"
                                    size="small"
                                    uppercase
                                    state={ColorStatus.disabled}
                                    lineHeight={1.25}
                                >
                                    {`${formattedDates[0]} ${
                                        formattedDates[1] ? `to ${formattedDates[1]}` : ""
                                    } ${timeZone}`}
                                </Text>
                            </CustomGridSpace>
                        </Space>
                    </Col>
                    <Col xl={3}>
                        <Space>
                            <Icon icon={JobIcon} size={8} color={ColorStatus.primary} />
                            <CustomGridSpace>
                                <Text size="small" uppercase state={ColorStatus.white} lineHeight={1.25}>
                                    {CONSTANTS.DEPOSITION_DETAILS_HEADER_JOB}
                                </Text>
                                <Tooltip title={job}>
                                    <TitleWrapper>
                                        <Title
                                            dataTestId="deposition_details_header_job"
                                            level={6}
                                            weight="light"
                                            color={ColorStatus.white}
                                            noMargin
                                        >
                                            {job}
                                        </Title>
                                    </TitleWrapper>
                                </Tooltip>
                            </CustomGridSpace>
                        </Space>
                    </Col>
                    <Col xl={4}>
                        <Space justify="flex-end">
                            <ThemeProvider theme={{ ...theme, mode: ThemeMode.inDepo }}>
                                <StatusPill status={status} />
                            </ThemeProvider>
                        </Space>
                    </Col>
                </Row>
            </Space>
        </Card>
    );
};

export default DepositionDetailsHeader;
