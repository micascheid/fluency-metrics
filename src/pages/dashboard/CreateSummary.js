import react, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Button, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";


const CreateSummary = () => {
    const {
        totalSyllableCount,
        sutteredEventsCount,
        averageDuration,
        longest3Durations,
        customNotes,
        stutteredEvents,
    } = useContext(StutteredContext);
    const handleCreateSummary = () => {

    }

    return (
        <MainCard title={"Create Summary"}>
            <Button variant={"contained"} onClick={handleCreateSummary}>Create Summary</Button>
        </MainCard>
    );
};

export default CreateSummary;