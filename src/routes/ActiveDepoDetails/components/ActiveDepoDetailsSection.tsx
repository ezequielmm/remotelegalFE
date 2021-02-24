import React, { useEffect } from "react";
import { Row } from "antd";
import moment from "moment";
import Space from "../../../components/Space";
import Title from "../../../components/Typography/Title";
import { ReactComponent as SuccessIcon } from "../../../assets/icons/Success.svg";
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
import Text from "../../../components/Typography/Text";
import ColorStatus from "../../../types/ColorStatus";
import Divider from "../../../components/Divider";
import Button from "../../../components/Button";
import useFetchCaption from "../../../hooks/activeDepositionDetails/hooks";
import Message from "../../../components/Message";
import downloadFile from "../../../helpers/downloadFile";

const DepositionDetailsSection = ({ deposition }: { deposition: DepositionModel.IDeposition }) => {
    const {
        participants,
        status,
        job,
        caption,
        isVideoRecordingNeeded,
        details,
        creationDate,
        addedBy,
        requester,
        requesterNotes,
    } = deposition || {};
    const { lastName, firstName, phoneNumber, emailAddress, companyName } = requester || {};
    const courtReporter = participants?.find((participant) => participant.role === "CourtReporter");
    const [fetchCaption, captionLoading, captionError, captionUrl] = useFetchCaption();

    useEffect(() => {
        if (captionError) {
            Message({
                content: CONSTANTS.NETWORK_ERROR,
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

    const getCreatedByText = () => {
        const { firstName: creatorFirstName, lastName: creatorLastName } = addedBy || {};
        const month = moment(creationDate).format("MMMM");
        const day = moment(creationDate).format("Do");
        return `Created by ${creatorFirstName} ${creatorLastName} on ${month} ${day}`;
    };

    const getCaptionText = () => {
        return caption?.displayName.length > 25 ? `${caption.displayName.slice(0, 25)}...` : caption.displayName;
    };

    if (!deposition) {
        return null;
    }

    return (
        <>
            <Space py={6} fullWidth>
                <Title
                    level={5}
                    noMargin
                    weight="regular"
                    dataTestId={CONSTANTS.DEPOSITION_ADDITIONAL_INFORMATION_TEXT}
                >
                    {CONSTANTS.DEPOSITION_ADDITIONAL_INFORMATION_TEXT}
                </Title>
            </Space>
            <SectionCard title={CONSTANTS.DEPOSITION_CARD_DETAILS_TITLE}>
                <Space size={12} direction="vertical" fullWidth>
                    <Row style={{ width: "100%" }}>
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={CourtReporterIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_COURT_REPORTER_TITLE}
                            text={courtReporter?.name || CONSTANTS.DEPOSITION_NO_PARTICIPANT_TEXT}
                        />
                        <SectionCardCol
                            colProps={{ xl: 9 }}
                            icon={SuccessIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_STATUS_TITLE}
                            text={status}
                        />
                        <SectionCardCol
                            colProps={{ xl: 6 }}
                            icon={JobIcon}
                            title={CONSTANTS.DEPOSITION_DETAILS_JOB_TITLE}
                            text={job || CONSTANTS.DEPOSITION_NO_JOB_TEXT}
                        />
                    </Row>
                    <Row style={{ width: "100%" }}>
                        <SectionCardCol
                            colProps={{ xl: 9 }}
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
                            colProps={{ xl: 6 }}
                            icon={CommentIcon}
                            title={CONSTANTS.DEPOSITION_SPECIAL_REQUEST_TITLE}
                            text={details || CONSTANTS.DEPOSITION_NO_TEXT}
                        />
                    </Row>
                </Space>
                <Space mt={9} mb={6} fullHeight>
                    <Divider fitContent hasMargin={false} />
                </Space>
                <Text state={ColorStatus.disabled} block dataTestId={CONSTANTS.DEPOSITION_CREATED_TEXT_DATA_TEST_ID}>
                    {getCreatedByText()}
                </Text>
                <Text
                    state={ColorStatus.disabled}
                    block
                    dataTestId={CONSTANTS.DEPOSITION_REQUESTED_TEXT_DATA_TEST_ID}
                >{`Requested by ${firstName} ${lastName} | ${companyName}`}</Text>
            </SectionCard>
            <SectionCard title={CONSTANTS.DEPOSITION_REQUESTER_TITLE}>
                <Space size={12} direction="vertical" fullWidth>
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
