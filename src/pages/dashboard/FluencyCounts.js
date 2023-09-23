import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Box, Divider, List, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";



const dividerStyles = {
    height: '60px',
    borderColor: '#000',
}
const FluencyCounts = () => {
    const {
        totalSyllableCount,
        stutteredEventsCount,
        averageDuration,
        longest3Durations
    } = useContext(StutteredContext);

    const percentSS = totalSyllableCount === 0 ?
        0:
        Number((stutteredEventsCount/totalSyllableCount)*100).toFixed(2);

    return (
        <MainCard title={"Fluency Counts"}>
            <Stack direction={"row"} alignItems="stretch" spacing={3}>
                <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
                    <Typography variant={"h5"}>Frequency</Typography>
                    <Typography>Total Syllables: {totalSyllableCount}</Typography>
                    <Typography>Stuttered Events: {stutteredEventsCount}</Typography>
                    <Typography>%SS: {percentSS}</Typography>
                </Box>

                <Divider orientation={"vertical"} sx={dividerStyles}></Divider>

                <Box display={"flex"} flexDirection={"column"} flexGrow={1}>
                    <Typography variant={"h5"}>Duration</Typography>
                    <Typography>Average: {averageDuration}</Typography>
                    <Stack direction={"row"}>
                        <Typography>Longest Three: </Typography>
                        {Object.values(longest3Durations).map((duration, index) => {
                            if (duration !== 0) {
                                return <Typography style={{paddingLeft: "8px", textDecoration: "underline"}} key={index}>{duration}</Typography>
                            }
                            return null;
                        })}
                    </Stack>
                </Box>
            </Stack>

        </MainCard>

    );

};

export default FluencyCounts;