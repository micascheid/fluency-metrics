import React, {forwardRef, useContext, useEffect} from 'react';
import {Box, Typography, styled, Divider, Stack, Grid} from "@mui/material";
import {StutteredContext} from "../context/StutteredContext";
import {SPEECH_SAMPLE_OPTIONS} from "../constants";
import {TypeSpecimenOutlined} from "@mui/icons-material";
import {DataGrid} from "@mui/x-data-grid";
import MainCard from "../components/MainCard";


const StyledBox = styled(Box)({
    display: 'none',
    '@media print': {
        display: 'block'
    }

});

const dividerStyles = {
    height: '60px',
    borderColor: '#000',
}
const PrintOut = forwardRef((props, ref) => {
    const {
        workspaceName,
        speechSampleContext,
        totalSyllableCount,
        stutteredEventsCount,
        averageDuration,
        longest3Durations,
        stutteredEvents,
        customNotes,
        percentSS,

    } = useContext(StutteredContext);
    const getStutterEventTypeTotal = (type) => {
        let total = 0;
        Object.values(stutteredEvents).forEach((val) => {
            if (val.type === type) {
                total += 1;
            }
        })
        return total;
    };
    const repWholeWord = getStutterEventTypeTotal("Rep. Whole Word");
    const repSyllable = getStutterEventTypeTotal("Rep. Syllable");
    const prolongation = getStutterEventTypeTotal("Prolongation");
    const block = getStutterEventTypeTotal("Block");
    const interjection = getStutterEventTypeTotal("Interjection");


    const renderHighLevelMetrics = () => (
        <Box>
            <Stack direction={"row"} alignItems="stretch" spacing={3}>
                <Box>
                    <Typography variant={"subtitle2"}>Frequency</Typography>
                    <Typography>Total Syllables: {totalSyllableCount}</Typography>
                    <Typography>Stuttered Events: {stutteredEventsCount}</Typography>
                    <Typography>%SS: {percentSS}</Typography>
                </Box>
                <Box>
                    <Typography variant={"subtitle2"}>Duration</Typography>
                    <Typography>Average: {averageDuration}</Typography>
                    <Stack direction={"row"}>
                        <Typography>Longest Three: </Typography>
                        {Object.values(longest3Durations).map((duration, index) => {
                            if (duration !== 0) {
                                return <Typography style={{paddingLeft: "8px", textDecoration: "underline"}}
                                                   key={index}>{duration}</Typography>
                            }
                            return null;
                        })}
                    </Stack>
                </Box>
            </Stack>
            <Box>
                <Stack>
                    <Typography>Rep. Whole Word: {repWholeWord}</Typography>
                    <Typography>Rep. Syllable: {repSyllable}</Typography>
                    <Typography>Prolongation: {prolongation}</Typography>
                    <Typography>Block: {block}</Typography>
                    <Typography>Interjection: {interjection}</Typography>
                </Stack>
            </Box>
        </Box>

    );

    const renderCustomNotes = () => (
        <Typography>{customNotes}</Typography>
    )

    const renderStutteredEvents = () => {
        const columns = [
            {field: 'id', headerName: "Event #", flex: 1, valueGetter: (param) => (Number(param.id) + 1).toString()},
            {field: 'type', headerName: "Type", flex: 1},
            {field: 'syllable_count', headerName: "Syllables", flex: 1},
            {field: 'duration', headerName: "Duration", flex: 1, type: 'number', align: 'left', headerAlign: 'left'},
            {field: 'ps', headerName: "Phys Conc", flex: 1, type: 'number', align: 'left', headerAlign: 'left'},
            {field: 'text', headerName: "Text", flex: 1},
        ]
        return (
            <Box sx={{minHeight: '1px'}}>
                {Object.keys(stutteredEvents).length > 0 ? (
                    <DataGrid
                        rows={Object.values(stutteredEvents)}
                        columns={columns}
                        sx={{borderColor: '#000'}}
                    />
                ) : (
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Typography variant={"h4"}>Disfluency events will show up here</Typography>
                    </Box>
                )
                }

            </Box>
        );
    };

    return (
        <StyledBox ref={ref}>
            {/*Title Area*/}
            <Typography variant={"h4"} fontWeight={"medium"}>Workspace Name: {workspaceName}</Typography>
            <Typography variant={"h4"} fontWeight={"medium"}>Speech Sample
                Context: {SPEECH_SAMPLE_OPTIONS[speechSampleContext]}</Typography>
            <Box marginBottom={2}/>
            {/*High Level Fluency summary*/}
            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <Typography variant={"subtitle1"} fontWeight={"medium"}>High Level Summary:</Typography>
                    {renderHighLevelMetrics()}
                </Grid>
                <Grid item xs={7}>
                    <Typography variant={"subtitle1"} fontWeight={"medium"}>Custom Notes:</Typography>
                    {renderCustomNotes()}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={"subtitle1"} fontWeight={"medium"}>Stuttered Events:</Typography>
                    {renderStutteredEvents()}
                </Grid>
            </Grid>

        </StyledBox>
    );
});

export default PrintOut;