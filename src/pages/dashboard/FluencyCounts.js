import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";

const FluencyCounts = () => {
    const { totalSyllableCount, stutteredEventCount, ss } = useContext(StutteredContext);



    return (
        <MainCard>
            <Typography variant={"h4"} sx={{pb: 3}}>Fluency Counts</Typography>
            <Stack direction={"column"}>
                <Typography>Total Syllables: {totalSyllableCount}</Typography>
                <Typography>Stuttered Events: {stutteredEventCount}</Typography>
                <Typography>%SS: {ss}</Typography>
            </Stack>
        </MainCard>

    );

};

export default FluencyCounts;