import {db} from "../FirebaseConfig";
import {doc} from "firebase/firestore";

export const AUTO = 'auto';
export const MANUAL = 'manual';
//local
export const BASE_URL = 'http://127.0.0.1:5001';
//production
// export const BASE_URL = 'https://fluencymetrics-backend-uroarqqgxa-uc.a.run.app';



export const CUSTOMER_PORTAL = 'customer_portal';
export const repWholeWord = "Rep. Whole Word";
export const repSyllable = "Rep. Syllable";
export const prolongation = "Prolongation";
export const block = "Block";
export const interjection = "Interjection";
export const UPD_WS_STATUS = Object.freeze({
    IDLE: "idle",
    SAVING: "saving",
    SUCCESS: "success",
    ERROR: "error",
});

export const SPEECH_SAMPLE_OPTIONS = {
    ReadingPassage: 'Reading Passage',
    DescribingTask: 'Describing Task',
    Conversation: 'Conversation',
    Other: 'Other...'
}

export const MAINTENANCE_CHECK = doc(db, 'health', 'maintenance');

export const SUBSCRIPTION_STATUS = {
    TRIAL: 'trail',
    ACTIVE: 'active',
    INACTIVE: 'inactive'
}
