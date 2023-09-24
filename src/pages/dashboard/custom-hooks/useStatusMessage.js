import {useContext} from "react";
import {StutteredContext} from "../../../context/StutteredContext";
import {UPD_WS_STATUS} from "../../../constants";

const useStatusMessage = () => {
    const {
        wsSaveStatus
    } = useContext(StutteredContext);
    switch (wsSaveStatus) {
        case UPD_WS_STATUS.SAVING:
            return "Saving...";
        case UPD_WS_STATUS.SUCCESS:
            return "Saved Successfully";
        case UPD_WS_STATUS.ERROR:
            return "Error Saving, Try Again";
        default:
            return "";
    }
};

export default useStatusMessage;