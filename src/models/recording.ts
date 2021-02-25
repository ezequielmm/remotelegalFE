export enum RecordingStatus {
    Queued = "Queued",
    Started = "Started",
    Progress = "Progress",
    Available = "Available",
    Failed = "Failed",
    Uploading = "Uploading",
    Stored = "Stored",
    Deleted = "Deleted",
    UploadFailed = "UploadFailed",
    Completed = "Completed",
    EditionFailed = "EditionFailed",
}

export type RecordingStatusType =
    | RecordingStatus.Queued
    | RecordingStatus.Started
    | RecordingStatus.Progress
    | RecordingStatus.Available
    | RecordingStatus.Failed
    | RecordingStatus.Uploading
    | RecordingStatus.Stored
    | RecordingStatus.Deleted
    | RecordingStatus.UploadFailed
    | RecordingStatus.Completed
    | RecordingStatus.EditionFailed;

export default interface IRecording {
    totalTime: number | 0;
    onTheRecordTime: number | 0;
    offTheRecordTime: number | 0;
    publicUrl: string | "";
    status: RecordingStatus;
}
