import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Divider, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import {styled} from "@mui/material/styles";

const dividerStyles = {
    "&::before, &::after": {
        borderColor: "lightgray",
    },
    pt: 3,
}
const FluencyCounts = () => {
    const { totalSyllableCount, stutteredEventCount, ss, averageDuration, psList } = useContext(StutteredContext);


    return (
        <MainCard>
            <Typography variant={"h4"}>Fluency Counts</Typography>
            <Stack direction={"column"}>
                <Divider textAlign={"left"} sx={dividerStyles}><Typography variant={"h5"}>Frequency</Typography></Divider>
                <Typography>Total Syllables: {totalSyllableCount}</Typography>
                <Typography>Stuttered Events: {stutteredEventCount}</Typography>
                <Typography>%SS: {ss}</Typography>
                <Divider textAlign={"left"} sx={dividerStyles}><Typography variant={"h5"}>Duration</Typography></Divider>
                <Typography>Average: {averageDuration}</Typography>
                <Divider textAlign={"left"} sx={dividerStyles}><Typography variant={"h5"}>Physical Concomitants</Typography></Divider>
                <Typography>{psList}</Typography>
            </Stack>
        </MainCard>

    );

};

export default FluencyCounts;