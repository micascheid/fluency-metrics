import React, {forwardRef, useContext} from 'react';
import {
    Box,
    Typography,
    styled,
    Grid,
    Table,
    TableHead,
    TableCell,
    TableBody,
    TableRow, Stack,
} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import {SPEECH_SAMPLE_OPTIONS} from "../../constants";
import logodrawer from '../../assets/images/logodrawer.png';
import {useTheme} from "@mui/material/styles";

const StyledBox = styled(Box)({
    visibility: 'hidden',
    width: 0,
    height: 0,
    overflow: 'hidden',
    '@media print': {
        visibility: 'visible',
        width: 'auto',
        height: 'auto',
        margin: '25px',
        padding: '20px',
        border: '1px solid #ccc',
    }
});

const LocalTableCell = styled(TableCell)({
    padding: '2px 2px',
    border: '1px solid #e0e0e0',
});

const TitleTypography = styled(Typography)({
    marginBottom: '20px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
});

const SubtitleTypography = styled(Typography)({
    marginBottom: '10px',
    fontWeight: 'bold',
});

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
        transcriptionObj,
    } = useContext(StutteredContext);
    const theme = useTheme();

    const getStutterEventTypeTotal = (type) => {
        let total = 0;
        Object.values(stutteredEvents).forEach((val) => {
            if (val.type === type) {
                total += 1;
            }
        });
        return total;
    };
    const repWholeWord = getStutterEventTypeTotal("Rep. Whole Word");
    const repSyllable = getStutterEventTypeTotal("Rep. Syllable");
    const prolongation = getStutterEventTypeTotal("Prolongation");
    const block = getStutterEventTypeTotal("Block");
    const interjection = getStutterEventTypeTotal("Interjection");

    const renderHighLevelMetrics = () => (
        <Box>
            <Grid container spacing={3}>
                {/* Frequency and Duration Stats */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <SubtitleTypography variant={"subtitle1"}>Frequency Stats</SubtitleTypography>
                            <Typography>Total Syllables: {totalSyllableCount}</Typography>
                            <Typography>Stuttered Events: {stutteredEventsCount}</Typography>
                            <Typography>%SS: {percentSS}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <SubtitleTypography variant={"subtitle1"}>Duration Stats</SubtitleTypography>
                            <Typography>Average: {averageDuration}</Typography>
                            <Typography>
                                Longest
                                Three: {Object.values(longest3Durations).filter(duration => duration !== 0).join(', ')}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                {/* Event Statistics */}
                <Grid item xs={12}>
                    <SubtitleTypography variant={"subtitle1"}>Event Statistics</SubtitleTypography>
                    <Stack spacing={1}>
                        <Typography>Rep. Whole Word: {repWholeWord}</Typography>
                        <Typography>Rep. Syllable: {repSyllable}</Typography>
                        <Typography>Prolongation: {prolongation}</Typography>
                        <Typography>Block: {block}</Typography>
                        <Typography>Interjection: {interjection}</Typography>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );


    const renderCustomNotes = () => <Typography>{customNotes}</Typography>;

    const renderStutteredEvents = () => (
        <Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <LocalTableCell>Event #</LocalTableCell>
                        <LocalTableCell>Type</LocalTableCell>
                        <LocalTableCell>Syllables</LocalTableCell>
                        <LocalTableCell>Duration</LocalTableCell>
                        <LocalTableCell>Phys. Conc</LocalTableCell>
                        <LocalTableCell>Text</LocalTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.values(stutteredEvents).map((event, index) => (
                        <TableRow key={index}>
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

    const renderTranscription = () => {
        return (
            <Box>
                {Object.values(transcriptionObj).map((value, index) => {
                    return value.stuttered ? (
                        <span key={index} style={{backgroundColor: theme.palette.grey.A200, padding: '2px'}}>
                        {value.punctuated_word}
                    </span>
                    ) : (
                        value.punctuated_word + ' '
                    );
                })}
            </Box>
        );
    };

    return (
        <StyledBox ref={ref}>
            <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={1}>
                            <img src={logodrawer} alt="Your Logo" style={{width: 50, height: 50}}/>
                        </Grid>
                        <Grid item xs={11} style={{textAlign: 'center'}}>
                            <TitleTypography variant="h3">Fluency Metrics Summary</TitleTypography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant={"h5"} fontWeight={"medium"}>Workspace Name: {workspaceName}</Typography>
                    <Typography variant={"h5"} fontWeight={"medium"}>Speech Sample
                        Context: {SPEECH_SAMPLE_OPTIONS[speechSampleContext]}</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Box sx={{borderColor: '#000', borderStyle: 'solid', borderWidth: 1}}>
                        <Box sx={{padding: 1}}>
                            <SubtitleTypography variant={"subtitle1"}>High Level Summary:</SubtitleTypography>
                            {renderHighLevelMetrics()}
                        </Box>

                    </Box>

                </Grid>
                <Grid item xs={7}>
                    <Box sx={{borderColor: '#000', borderStyle: 'solid', borderWidth: 1}}>
                        <Box sx={{padding: 1}}>
                            <SubtitleTypography variant={"subtitle1"}>Additional Notes:</SubtitleTypography>
                            {renderCustomNotes()}
                        </Box>
                    </Box>

                </Grid>
                <Grid item xs={12}>
                    <Box sx={{borderColor: '#000', borderStyle: 'solid', borderWidth: 1}}>
                        <Box sx={{padding: 1}}>
                            <SubtitleTypography variant={"h5"}>Transcription:</SubtitleTypography>
                            {renderTranscription()}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <SubtitleTypography variant={"subtitle1"}>Stuttered Events:</SubtitleTypography>
                    {renderStutteredEvents()}
                </Grid>
            </Grid>
        </StyledBox>
    );

});

export default PrintOut;
