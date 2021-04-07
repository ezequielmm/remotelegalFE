import React, { ReactElement } from "react";
import VideoPlayer from "../../../../components/VideoPlayer";
import { ReactComponent as TimeIcon } from "../../../../assets/icons/time.svg";
import { ReactComponent as RecordOnIcon } from "../../../../assets/in-depo/Record.on.svg";
import { ReactComponent as RecordOffIcon } from "../../../../assets/in-depo/Record.off.svg";
import { ReactComponent as VideoAlertIcon } from "../../../../assets/icons/Video-alert.svg";
import RecordingInfo from "./RecordingInfo/RecordingInfo";
import * as CONSTANTS from "../../../../constants/depositionDetails";
import IRecording, { RecordingStatus } from "../../../../models/recording";
import { secondsTohhmmss } from "../../../../helpers/secondsTohhmmss";
import Space from "../../../../components/Space";

import VideoPlaceholder from "../../../../components/VideoPlaceholder";
import Icon from "../../../../components/Icon";
import Spinner from "../../../../components/Spinner";
import { isAudioFromUrl } from "../../../../helpers/isAudioFromUrl";
interface IDepositionDetailsVideoSection {
    recordingInfo?: IRecording;
}

export default function DepositionDetailsVideoSection({ recordingInfo }: IDepositionDetailsVideoSection): ReactElement {
    return (
        <>
            <Space justify="space-between" px={9} pb={9} fullWidth>
                <Space.Item>
                    <RecordingInfo
                        title={CONSTANTS.DETAILS_SUMMARY_TOTAL_TIME_TEXT}
                        value={secondsTohhmmss(recordingInfo?.totalTime)}
                        icon={TimeIcon}
                        dataTestId="recording_info_total_time"
                    />
                </Space.Item>
                <Space.Item>
                    <RecordingInfo
                        title={CONSTANTS.DETAILS_SUMMARY_ON_THE_RECORD_TEXT}
                        value={secondsTohhmmss(recordingInfo?.onTheRecordTime)}
                        icon={RecordOnIcon}
                        dataTestId="recording_info_on_the_record_time"
                    />
                </Space.Item>
                <Space.Item>
                    <RecordingInfo
                        title={CONSTANTS.DETAILS_SUMMARY_OFF_THE_RECORD_TEXT}
                        value={secondsTohhmmss(recordingInfo?.offTheRecordTime)}
                        icon={RecordOffIcon}
                        dataTestId="recording_info_off_the_record_time"
                    />
                </Space.Item>
            </Space>
            {recordingInfo?.publicUrl && recordingInfo.status === RecordingStatus.Completed ? (
                <VideoPlayer
                    url={recordingInfo?.publicUrl}
                    fallback={
                        <VideoPlaceholder icon={<Spinner height="100%" />} title={CONSTANTS.VIDEO_PLACEHOLDER_TITLE} />
                    }
                    isOnlyAudio={isAudioFromUrl(recordingInfo?.outputFormat)}
                />
            ) : (
                <VideoPlaceholder
                    icon={<Icon icon={VideoAlertIcon} />}
                    title={CONSTANTS.VIDEO_PLACEHOLDER_TITLE}
                    subTitle={CONSTANTS.VIDEO_PLACEHOLDER_SUBTITLE}
                />
            )}
        </>
    );
}
