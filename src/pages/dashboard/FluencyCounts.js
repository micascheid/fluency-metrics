import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Divider, List, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import {styled} from "@mui/material/styles";

const dividerStyles = {
    "&::before, &::after": {
        borderColor: "lightgray",
    },
    pt: 3,
}
const FluencyCounts = () => {
    const { totalSyllableCount, stutteredEventCount, ss, averageDuration, psList, longest3Durations } = useContext(StutteredContext);


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
                <Stack direction={"row"}>
                    <Typography>Longest Three: </Typography>
                    {Object.values(longest3Durations).map((duration, index) => {
                            if (duration !== 0) {
                                return <Typography style={{paddingLeft: "8px", textDecoration: "underline"}} key={index}>{duration}</Typography>
                            }
                            return null;
                        }
                    )}
                </Stack>
                <Divider textAlign={"left"} sx={dividerStyles}><Typography variant={"h5"}>Physical Concomitants</Typography></Divider>
                <Typography>{psList}</Typography>
            </Stack>
        </MainCard>

    );

};

export default FluencyCounts;