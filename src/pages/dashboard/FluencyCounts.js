import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";

const FluencyCounts = () => {
    const { totalSyllables, stutteredEventCount } = useContext(StutteredContext);



    return (
        <MainCard>
            <Typography variant={"h4"} sx={{pb: 3}}>Fluency Counts</Typography>
            <Stack direction={"column"}>
                <Typography>Total Syllables: {totalSyllables}</Typography>
                <Typography>Stuttered Events: {stutteredEventCount}</Typography>
            </Stack>
        </MainCard>

    );

};

export default FluencyCounts;