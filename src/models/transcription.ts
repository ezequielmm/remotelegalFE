import { DateLike } from "./general";

export interface Transcription {
    id: string;
    text: string;
    userEmail?: string;
    userName?: string;
    transcriptDateTime?: DateLike;
    prevEndTime?: number;
    transcriptionVideoTime?: number;
    duration?: number;
    confidence?: number;
}
export interface TranscriptionPause {
    from: DateLike;
    to: DateLike;
}
