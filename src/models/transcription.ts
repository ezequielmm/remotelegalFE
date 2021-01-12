import { DateLike } from "./general";

export interface Transcription {
    text: string;
    userEmail?: string;
    userName?: string;
    transcriptDateTime?: DateLike;
}
