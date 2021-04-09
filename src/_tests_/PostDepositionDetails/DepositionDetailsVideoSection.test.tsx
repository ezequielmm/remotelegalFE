import React from "react";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/depositionDetails";
import DepositionDetailsVideoSection from "../../routes/DepositionDetails/DepositionDetailsSummary/DepositionDetailsVideoSection";
import { RecordingStatus } from "../../models/recording";

const customDeps = getMockDeps();

describe("DepositionDetailsVideoSection", () => {
    it("shows a total time control component with the text `00:00:00` when the totalTime's record info data is 0 seconds", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 0,
            publicUrl: "url",
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.DETAILS_SUMMARY_TOTAL_TIME_TEXT)).toBeInTheDocument();
        expect(queryByTestId("recording_info_total_time_value")).toHaveTextContent("00:00:00");
    });
    it("shows a total time control component with the text `00:01:00` when the totalTime's record info data is 60 seconds", () => {
        const recordInfoData = {
            totalTime: 60,
            onTheRecordTime: 0,
            offTheRecordTime: 0,
            publicUrl: "url",
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.DETAILS_SUMMARY_TOTAL_TIME_TEXT)).toBeInTheDocument();
        expect(queryByTestId("recording_info_total_time_value")).toHaveTextContent("00:01:00");
    });
    it("shows a on the record time control component with the text `00:00:00` when the onTheRecordTime's record info data is 0 seconds", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 0,
            publicUrl: "url",
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.DETAILS_SUMMARY_ON_THE_RECORD_TEXT)).toBeInTheDocument();
        expect(queryByTestId("recording_info_on_the_record_time")).toHaveTextContent("00:00:00");
    });
    it("shows a on the record time control component with the text `00:02:00` when the onTheRecordTime's record info data is 120 seconds", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 120,
            offTheRecordTime: 0,
            publicUrl: "url",
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.DETAILS_SUMMARY_ON_THE_RECORD_TEXT)).toBeInTheDocument();
        expect(queryByTestId("recording_info_on_the_record_time")).toHaveTextContent("00:02:00");
    });
    it("shows a off the record time control component with the text `00:00:00` when the offTheRecordTime's record info data is 0 seconds", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 0,
            publicUrl: "url",
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.DETAILS_SUMMARY_ON_THE_RECORD_TEXT)).toBeInTheDocument();
        expect(queryByTestId("recording_info_on_the_record_time")).toHaveTextContent("00:00:00");
    });
    it("shows a off the record time control component with the text `00:02:00` when the offTheRecordTime's record info data is 120 seconds", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "url",
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.DETAILS_SUMMARY_ON_THE_RECORD_TEXT)).toBeInTheDocument();
        expect(queryByTestId("recording_info_off_the_record_time")).toHaveTextContent("00:02:00");
    });
    it("shows a video placeholder when has not recording publicUrl data", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "",
            status: RecordingStatus.Completed,
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.VIDEO_PLACEHOLDER_TITLE)).toBeInTheDocument();
        expect(queryByTestId("video_player")).not.toBeInTheDocument();
    });

    it("shows a video placeholder when the recording status info data is different to completed", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "",
            status: RecordingStatus.EditionFailed,
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText(CONSTANTS.VIDEO_PLACEHOLDER_TITLE)).toBeInTheDocument();
        expect(queryByTestId("video_player")).not.toBeInTheDocument();
    });

    it("shows a video player when has recording info data", () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "url",
            status: RecordingStatus.Completed,
        };
        const { queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByTestId("video_player")).toBeInTheDocument();
    });

    it("not show an image for video files", async () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "url.mp4",
            outputFormat: "mp4",
            status: RecordingStatus.Completed,
        };
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByTestId("only_audio_image")).not.toBeInTheDocument();
    });

    it("shows an image for non video files", async () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "url.mp3",
            outputFormat: "mp3",
            status: RecordingStatus.Completed,
        };
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByTestId("only_audio_image")).toBeInTheDocument();
    });

    it("shows an audio image when has not public url and the output format is mp3", async () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "",
            outputFormat: "mp3",
            status: RecordingStatus.Completed,
        };
        const { queryByText } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText("Audio-alert.svg")).toBeInTheDocument();
    });
    
    it("shows an video image when has not public url and the output format is mp4", async () => {
        const recordInfoData = {
            totalTime: 0,
            onTheRecordTime: 0,
            offTheRecordTime: 120,
            publicUrl: "",
            outputFormat: "mp4",
            status: RecordingStatus.Completed,
        };
        const { queryByText } = renderWithGlobalContext(
            <DepositionDetailsVideoSection recordingInfo={recordInfoData} />,
            customDeps
        );
        expect(queryByText("Video-alert.svg")).toBeInTheDocument();
    });
});
