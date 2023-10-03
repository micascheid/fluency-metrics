import React, {useContext} from 'react';
import MainCard from "../../components/MainCard";
import {Box, Divider, List, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import Help from "./Help";



const dividerStyles = {
    height: '60px',
    borderColor: '#000',
}
const FluencyCounts = (props) => {
    const {
        totalSyllableCount,
        stutteredEventsCount,
        averageDuration,
        longest3Durations,
        stutteredEvents,
    } = useContext(StutteredContext);
    const {help} = props;
    const percentSS = totalSyllableCount === 0 ?
        0:
        Number((stutteredEventsCount/totalSyllableCount)*100).toFixed(2);

    const getStutterEventTypeTotal = (type) => {
        let total = 0;
        Object.values(stutteredEvents).forEach((val) => {
            if (val.type === type) {
                total += 1;
            }
        });
        return total;
    }

    const repWholeWord = getStutterEventTypeTotal("Rep. Whole Word");
    const repSyllable = getStutterEventTypeTotal("Rep. Syllable");
    const prolongation = getStutterEventTypeTotal("Prolongation");
    const block = getStutterEventTypeTotal("Block");
    const interjection = getStutterEventTypeTotal("Interjection");

    return (
        <MainCard title={
            <Box flexGrow={1}>
                <Help title={"Fluency Counts"}>
                    {help}
                </Help>
            </Box>
        }>
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
                                return <Typography style={{paddingLeft: "8px"}} key={index}>{duration}</Typography>
                            }
                            return null;
                        })}
                    </Stack>
                </Box>
                <Divider orientation={"vertical"} sx={dividerStyles}></Divider>
                <Box display={"flex"} flexDirection={"column"} flexGrow={1}><Stack spacing={1}>
                    <Typography variant={"h5"}>Type Totals</Typography>
                    <Typography>Rep. Whole Word: {repWholeWord}</Typography>
                    <Typography>Rep. Syllable: {repSyllable}</Typography>
                    <Typography>Prolongation: {prolongation}</Typography>
                    <Typography>Block: {block}</Typography>
                    <Typography>Interjection: {interjection}</Typography>
                </Stack></Box>
            </Stack>

        </MainCard>

    );

};

export default FluencyCounts;