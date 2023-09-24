import React, {forwardRef, useContext, useEffect} from 'react';
import {
    Box,
    Typography,
    styled,
    Divider,
    Stack,
    Grid,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow,
} from "@mui/material";
import {StutteredContext} from "../context/StutteredContext";
import {SPEECH_SAMPLE_OPTIONS} from "../constants";
import logodrawer from '../assets/images/logodrawer.png';


const StyledBox = styled(Box)({
    visibility: 'hidden',
    width: 0,
    height: 0,
    overflow: 'hidden',
    '@media print': {
        visibility: 'visible',
        width: 'auto',
        height: 'auto',
        margin: '50px'
    }
});

const LocalTableCell = styled(TableCell)({
    padding: '2px 4px'
})

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
        transcriptionObj
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
    console.log("HELLO", Object.values(stutteredEvents))

    const renderHighLevelMetrics = () => (
        <Box>
            <Stack direction={"row"} alignItems="stretch" spacing={3}>
                <Box>
                    <Typography variant={"subtitle1"}>Frequency Stats</Typography>
                    <Typography>Total Syllables: {totalSyllableCount}</Typography>
                    <Typography>Stuttered Events: {stutteredEventsCount}</Typography>
                    <Typography>%SS: {percentSS}</Typography>
                </Box>
                <Box>
                    <Typography variant={"subtitle1"}>Duration Stats</Typography>
                    <Typography>Average: {averageDuration}</Typography>
                    <Stack direction={"row"}>
                        <Typography>Longest Three: </Typography>
                        {Object.values(longest3Durations).map((duration, index) => {
                            if (duration !== 0) {
                                return <Typography style={{paddingLeft: "2px", textDecoration: "underline"}}
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
        return (
            <Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <LocalTableCell>Event #</LocalTableCell>
                            <LocalTableCell>Type</LocalTableCell>
                            <LocalTableCell>Syllables</LocalTableCell>
                            <LocalTableCell>Duration</LocalTableCell>
                            <LocalTableCell>Phys Conc</LocalTableCell>
                            <LocalTableCell>Text</LocalTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(stutteredEvents).map((event, index) => (
                            <TableRow
                                key={index}
                            >
                                <LocalTableCell>{Number(event.id) + 1}</LocalTableCell>
                                <LocalTableCell>{event.type}</LocalTableCell>
                                <LocalTableCell>{event.syllable_count}</LocalTableCell>
                                <LocalTableCell>{event.duration.toFixed(2)}</LocalTableCell>
                                <LocalTableCell>{event.ps}</LocalTableCell>
                                <LocalTableCell>{event.text}</LocalTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        );
    };

    const renderTranscription = () => {
        const transcription = Object.values(transcriptionObj)
            .map((value) => value.punctuated_word)
            .join(' ');
        return (
            <Box>
                <Typography variant={"body1"}>{transcription}</Typography>
            </Box>
        );
    };


    return (

        <StyledBox ref={ref}>
            <Grid container alignItems="center" spacing={2}>
                {/* Logo and Main Title Area */}
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <img src={logodrawer} alt="Your Logo"
                                 style={{width: 50, height: 50}}/> {/* Adjust size as needed */}
                        </Grid>
                        <Grid item>
                            <Typography variant="h3">Fluency Metrics Summary</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {/*Title Area*/}
                <Grid item xs={12}>
                    <Typography variant={"h5"} fontWeight={"medium"}>Workspace Name: {workspaceName}</Typography>
                    <Typography variant={"h5"} fontWeight={"medium"}>Speech Sample
                        Context: {SPEECH_SAMPLE_OPTIONS[speechSampleContext]}</Typography>
                    <Box marginBottom={2}/>
                </Grid>

                {/*High Level Fluency summary*/}
                {/*<Grid container spacing={2}>*/}
                <Grid item xs={5}>
                    <Box sx={{justifyContent: 'center'}}>
                        <Typography variant={"subtitle1"} fontWeight={"medium"}>High Level Summary:</Typography>
                        {renderHighLevelMetrics()}
                    </Box>
                </Grid>
                <Grid item xs={7}>
                    <Typography variant={"subtitle1"} fontWeight={"medium"}>Additional Notes:</Typography>
                    {renderCustomNotes()}
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={"h5"} fontWeight={"medium"}>Transcription:</Typography>
                    {renderTranscription()}
                </Grid>
                <Grid item xs={12}>
                    {/*<Typography variant={"subtitle1"} fontWeight={"medium"}>Stuttered Events:</Typography>*/}
                    {renderStutteredEvents()}
                </Grid>
            </Grid>

        </StyledBox>

    );
});

export default PrintOut;