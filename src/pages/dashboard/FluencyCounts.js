import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Divider, List, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";


const dividerStyles = {
    "&::before, &::after": {
        borderColor: "#000",
    },
    pt: 1,
}
const FluencyCounts = () => {
    const { totalSyllableCount, stutteredEventsCount, percentSS, averageDuration, psList, longest3Durations } = useContext(StutteredContext);


    return (
        <MainCard title={"Fluency Counts"}>
            {/*<Typography variant={"h4"}>Fluency Counts</Typography>*/}
            <Stack direction={"column"}>
                <Divider textAlign={"left"} sx={dividerStyles}><Typography variant={"h5"}>Frequency</Typography></Divider>
                <Typography>Total Syllables: {totalSyllableCount}</Typography>
                <Typography>Stuttered Events: {stutteredEventsCount}</Typography>
                <Typography>%SS: {Number((stutteredEventsCount/totalSyllableCount)*100).toFixed(2)}</Typography>
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
            </Stack>
        </MainCard>

    );

};

export default FluencyCounts;