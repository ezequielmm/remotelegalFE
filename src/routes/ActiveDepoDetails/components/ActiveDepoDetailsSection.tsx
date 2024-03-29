import { SetStateAction, useEffect, useRef, useState, Dispatch } from "react";
import { Row } from "antd";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Do from "dayjs/plugin/advancedFormat";
import Button from "@rl/prp-components-library/src/components/Button";
import Divider from "@rl/prp-components-library/src/components/Divider";
import Space from "@rl/prp-components-library/src/components/Space";
import Spinner from "@rl/prp-components-library/src/components/Spinner";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import { ReactComponent as SuccessIcon } from "../../../assets/icons/Success.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/icons/calendar.svg";
import { ReactComponent as TimeIcon } from "../../../assets/icons/time.svg";
import { ReactComponent as CourtReporterIcon } from "../../../assets/icons/Court.Reporter.svg";
import { ReactComponent as JobIcon } from "../../../assets/icons/job_detail.svg";
import { ReactComponent as CaptionIcon } from "../../../assets/icons/attach-clip.svg";
import { ReactComponent as VideoIcon } from "../../../assets/icons/video_icon.svg";
import { ReactComponent as CommentIcon } from "../../../assets/icons/comment_icon.svg";
import { ReactComponent as RequesterIcon } from "../../../assets/icons/Participant.svg";
import { ReactComponent as CompanyIcon } from "../../../assets/icons/Company.svg";
import { ReactComponent as PhoneIcon } from "../../../assets/icons/Phone.svg";
import { ReactComponent as NotesIcon } from "../../../assets/layout/Cases.svg";
import { ReactComponent as EmailIcon } from "../../../assets/layout/Messages.svg";
import { DepositionModel } from "../../../models";
import * as CONSTANTS from "../../../constants/activeDepositionDetails";
import SectionCard from "./SectionCard";
import SectionCardCol from "./SectionCardCol";
import ColorStatus from "../../../types/ColorStatus";
import { useFetchCaption } from "../../../hooks/activeDepositionDetails/hooks";
import Message from "../../../components/Message";
import downloadFile from "../../../helpers/downloadFile";
import { useFetchDeposition } from "../../../hooks/depositions/hooks";
import CardFetchError from "../../../components/CardFetchError";
import EditDepoModal from "./EditDepoModal";
import EditRequesterNotesModal from "./RequesterModal";
import { mapTimeZone } from "../../../models/general";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(Do);

const DepositionDetailsSection = ({
    deposition,
    activeKey,
    setUpdatedDeposition,
}: {
    deposition: DepositionModel.IDeposition;
    activeKey: string;
    setUpdatedDeposition: Dispatch<SetStateAction<DepositionModel.IDeposition>>;
}) => {
    const { fetchDeposition, loading, deposition: updatedDeposition, error } = useFetchDeposition();
    const {
        participants,
        status,
        startDate,
        endDate,
        timeZone,
        job,
        caption,
        isVideoRecordingNeeded,
        details,
        creationDate,
        requester,
        requesterNotes,
    } = deposition || {};
    const { lastName, firstName, phoneNumber, emailAddress, companyName } = requester || {};
    const courtReporter = participants?.find((participant) => participant.role === "CourtReporter");
    const [fetchCaption, captionLoading, captionError, captionUrl] = useFetchCaption();
    const [openEditDepositionModal, setOpenEditDepositionModal] = useState(false);
    const [openEditRequesterNotesModal, setOpenEditRequesterNotesModal] = useState(false);
    const firstRender = useRef(true);

    useEffect(() => {
        if (activeKey === CONSTANTS.DEFAULT_ACTIVE_TAB) {
            if (firstRender.current) {
                firstRender.current = false;
                return;
            }

            fetchDeposition();
        }
    }, [fetchDeposition, activeKey]);

    useEffect(() => {
        if (updatedDeposition) {
            setUpdatedDeposition(updatedDeposition);
        }
    }, [updatedDeposition, setUpdatedDeposition]);

    useEffect(() => {
        if (captionError) {
            Message({
                content: CONSTANTS.CAPTION_NETWORK_ERROR,
                type: "error",
                duration: 3,
            });
        }
    }, [captionError]);

    useEffect(() => {
        if (captionUrl) {
            downloadFile(captionUrl.preSignedUrl);
        }
    }, [captionUrl]);

    const getFormattedDay = () => {
        const month = dayjs(creationDate).format("MMMM");
        const day = dayjs(creationDate).format("Do");
        const year = dayjs(creationDate).format("YYYY");
        return `${month} ${day}, ${year}`;
    };

    const getCaptionText = () => {
        return caption?.displayName.length > 25 ? `${caption.displayName.slice(0, 25)}...` : caption.displayName;
    };

    const getTimeText = () => {
        const startTimeZone = endDate ? "" : timeZone;
        return `${dayjs(startDate).tz(mapTimeZone[timeZone])?.format("hh:mm A")} ${startTimeZone} ${
            endDate ? ` to ${dayjs(endDate).tz(mapTimeZone[timeZone])?.format("hh:mm A")} ${timeZone}` : ""
        }`;
    };

    if (loading) {
        return <Spinner height="50vh" width="100%" />;
    }

    if (error) {
        return <CardFetchError width="100%" onClick={fetchDeposition} />;
    }

    return (
        <>
            {deposition && (
                <EditDepoModal
                    fetchDeposition={fetchDeposition}
                    open={openEditDepositionModal}
                    handleClose={setOpenEditDepositionModal}
                    deposition={updatedDeposition || deposition}
                />
            )}
            {deposition && (
                <EditRequesterNotesModal
                    fetchDeposition={fetchDeposition}
                    open={openEditRequesterNotesModal}
                    handleClose={setOpenEditRequesterNotesModal}
                    deposition={updatedDeposition || deposition}
                />
            )}
            <Space pt={4} pb={3} fullWidth>
                <Title
                    level={5}
                    noMargin
                    weight="regular"
                    dataTestId={CONSTANTS.DEPOSITION_ADDITIONAL_INFORMATION_TEXT}
                >
                    {CONSTANTS.DEPOSITION_ADDITIONAL_INFORMATION_TEXT}
                </Title>
            </Space>
            <SectionCard
                title={CONSTANTS.DEPOSITION_CARD_DETAILS_TITLE}
                actionTrigger={() => setOpenEditDepositionModal(true)}
            >
                <Space size={9} direction="vertical" fullWidth>
                    <Row style={{ width: "100%" }}>
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={CalendarIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_SUMMARY_SECTION_DATE_TITLE}
                            text={dayjs(startDate)
                                .tz(mapTimeZone[timeZone])
                                ?.format(CONSTANTS.DEPOSITION_DETAILS_SUMMARY_SECTION_DATE_FORMAT)}
                        />
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={TimeIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_SUMMARY_SECTION_TIME_TITLE}
                            text={getTimeText()}
                        />
                        <SectionCardCol
                            colProps={{ xl: 6 }}
                            icon={SuccessIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_STATUS_TITLE}
                            text={status}
                        />
                    </Row>
                    <Row style={{ width: "100%" }}>
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={CourtReporterIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_COURT_REPORTER_TITLE}
                            text={courtReporter?.name || CONSTANTS.DEPOSITION_NO_PARTICIPANT_TEXT}
                        />
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={JobIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_JOB_TITLE}
                            text={job || CONSTANTS.DEPOSITION_NO_JOB_TEXT}
                        />
                        <SectionCardCol
                            colProps={{ xl: 6 }}
                            icon={CaptionIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_CAPTION_TITLE}
                            text={!caption ? CONSTANTS.DEPOSITION_NO_TEXT : null}
                        >
                            {caption ? (
                                <Button
                                    disabled={captionLoading}
                                    color={ColorStatus.inDepo}
                                    onClick={() => fetchCaption(deposition.id)}
                                    type="link"
                                >
                                    {getCaptionText()}
                                </Button>
                            ) : null}
                        </SectionCardCol>
                    </Row>
                    <Row style={{ width: "100%" }}>
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={VideoIcon}
                            title={CONSTANTS.DEPOSITION_VIDEO_RECORDING_TITLE}
                            text={
                                isVideoRecordingNeeded
                                    ? CONSTANTS.DEPOSITION_VIDEO_RECORDING_TRUE_TEXT
                                    : CONSTANTS.DEPOSITION_VIDEO_RECORDING_FALSE_TEXT
                            }
                        />
                        <SectionCardCol
                            testId="deposition_details_notes"
                            colProps={{ xl: 6 }}
                            icon={CommentIcon}
                            title={CONSTANTS.DEPOSITION_SPECIAL_REQUEST_TITLE}
                            text={details || CONSTANTS.DEPOSITION_NO_TEXT}
                        />
                    </Row>
                </Space>
                <Space mt={6} mb={4} fullHeight>
                    <Divider fitContent hasMargin={false} />
                </Space>
                <Text state={ColorStatus.disabled} block dataTestId={CONSTANTS.DEPOSITION_CREATED_TEXT_DATA_TEST_ID}>
                    {`Requested by ${firstName} ${lastName} - ${companyName} on ${getFormattedDay()}`}
                </Text>
            </SectionCard>
            <SectionCard
                title={CONSTANTS.DEPOSITION_REQUESTER_TITLE}
                actionTrigger={() => setOpenEditRequesterNotesModal(true)}
            >
                <Space size={9} direction="vertical" fullWidth>
                    <Row style={{ width: "100%" }}>
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={RequesterIcon}
                            title={CONSTANTS.DEPOSITION_REQUESTER_USER_TITLE}
                            text={`${firstName} ${lastName}`}
                        />
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={EmailIcon}
                            title={CONSTANTS.DEPOSITION_REQUESTER_MAIL}
                            text={emailAddress}
                        />
                        <SectionCardCol
                            colProps={{ xl: 6 }}
                            icon={CompanyIcon}
                            title={CONSTANTS.DEPOSITION_REQUESTER_COMPANY}
                            text={companyName}
                        />
                    </Row>
                    <Row style={{ width: "100%" }}>
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={PhoneIcon}
                            title={CONSTANTS.DEPOSITION_REQUESTER_PHONE}
                            text={phoneNumber}
                        />
                        <SectionCardCol
                            testId="deposition_details_requester_notes"
                            colProps={{ xl: 9 }}
                            icon={NotesIcon}
                            title={CONSTANTS.DEPOSITION_REQUESTER_NOTES}
                            text={requesterNotes || CONSTANTS.DEPOSITION_NO_TEXT}
                        />
                    </Row>
                </Space>
            </SectionCard>
        </>
    );
};

export default DepositionDetailsSection;
