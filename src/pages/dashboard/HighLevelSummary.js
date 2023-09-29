import React, {useContext, useEffect, useRef, useState} from 'react';
import MainCard from "../../components/MainCard";
import Help from "./Help";
import {Box, Button, Collapse, IconButton, Stack, styled} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PrintIcon from "@mui/icons-material/Print";
import {useReactToPrint} from "react-to-print";
import PrintOut from "./PrintOut";
import {StutteredContext} from "../../context/StutteredContext";

const ExpandMore = styled((props) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(-90deg)' : 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


const HighLevelSummary = (props) => {
    const {children, expanded, help} = props;
    const {
        workspaceName,
    } = useContext(StutteredContext);
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [isPrinting, setIsPrinting] = useState(false);
    const printComponentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printComponentRef.current,
        onAfterPrint: () => setIsPrinting(false),
    });

    const handlePrintOutClick = () => {
        setIsPrinting(true);
    }

    useEffect(() => {
        setIsExpanded(expanded);
    }, [expanded]);

    useEffect(() => {
        if (isPrinting && printComponentRef.current) {
            handlePrint();
        }
    }, [isPrinting]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if either 'Ctrl' or 'Cmd' is pressed along with 'P'
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();  // Prevent the default print dialog
                handlePrintOutClick();
            }
        };

        // Add the event listener to the window object
        // document.addEventListener('keydown', handleKeyDown, true);
        window.addEventListener('keydown', handleKeyDown, true);

        // Clean up the event listener when the component is unmounted
        return () => {
            // document.removeEventListener('keydown', handleKeyDown, true);
            window.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);

    return (
        <MainCard title={
            <Stack direction={"row"}
                   sx={{
                       alignItems: 'center',
                       justifyContent: 'space-between',  // Add this line
                       width: '100%'                     // Ensure it takes full width
                   }}
                   spacing={1}>
                <Stack direction={"row"} sx={{alignItems: 'center'}}>
                    <ExpandMore
                        expand={isExpanded}
                        onClick={() => {
                            setIsExpanded(!isExpanded)
                        }}
                        aria-expanded={isExpanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon/>
                    </ExpandMore>
                    <Box flexGrow={1}>
                        <Help title={"Summary"}>
                            {help}
                        </Help>
                    </Box>
                </Stack>
                <Button
                    variant={"contained"}
                    startIcon={<PrintIcon />}
                    onClick={handlePrintOutClick}
                    disabled={workspaceName === ''}
                    sx={{fontWeight: 'bold'}}
                >
                    Summary and Transcription
                </Button>
            </Stack>
        } sx={{backgroundColor: theme.palette.success.lighter}}
        >
            {isPrinting && <PrintOut ref={printComponentRef} />}
            <Collapse in={isExpanded} timout={"auto"}>
                {children}
            </Collapse>
        </MainCard>
    );
};

export default HighLevelSummary;