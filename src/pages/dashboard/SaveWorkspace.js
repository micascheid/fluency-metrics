import react, {useContext, useEffect, useRef, useState} from 'react';
import {Box, Button, ButtonBase, Stack, TextField, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import MainCard from "../../components/MainCard";
import {Checkbox, FormControlLabel} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {useTheme} from '@mui/material/styles';
import {UserContext} from "../../context/UserContext";
import useStatusMessage from "./custom-hooks/useStatusMessage";
import {SPEECH_SAMPLE_OPTIONS} from "../../constants";
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PrintIcon from "@mui/icons-material/Print";
import ReactToPrint, {useReactToPrint} from "react-to-print";
import PrintOut from "../PrintOut";

const SaveWorkspace = ({sx}) => {
    const {
        workspaceName,
        setWorkspaceName,
        updateWorkspace,
        audioFileName,
        speechSampleContext,
    } = useContext(StutteredContext);
    const {
        workspacesIndex,
    } = useContext(UserContext);
    const [editWorkspaceName, setEditWorkspaceName] = useState(false);
    const [localName, setLocalName] = useState(workspaceName);
    const theme = useTheme();
    const [isNameError, setIsNameError] = useState(false);
    const [nameError, setNameError] = useState("");
    const [isPrinting, setIsPrinting] = useState(false);

    const statusMessage = useStatusMessage();
    const printComponentRef = useRef();

    const handleOnClick = () => {
        if (localName.trim() === "") {
            setIsNameError(true);
            return;
        }
        setWorkspaceName(localName);
        updateWorkspace(localName);
    };

    const handlePrint = useReactToPrint({
        content: () => printComponentRef.current,
        onAfterPrint: () => setIsPrinting(false),
    });

    const handlePrintOutClick = () => {
        setIsPrinting(true);
    }

    useEffect(() => {
        if (isPrinting && printComponentRef.current) {
            handlePrint();
        }
    }, [isPrinting]);



    const handleOnChange = (event) => {
        const value = (event.target.value);
        const doesExist = Object.values(workspacesIndex).some(workspace => workspace.name === value);
        if (doesExist){
            setNameError("Name already in use");
        } else {
            setNameError('');
        }
        setLocalName(value);


    }

    const handleKeyPress = (event) => {
        event.stopPropagation();
    };

    useEffect(() => {
        setLocalName(workspaceName);
    }, [workspaceName])


    return (
        <Box sx={sx}>
            <Stack direction={"row"} sx={{alignItems: 'center'}} spacing={1}>
                <Typography variant={"h5"}>Current Workspace: </Typography>
                <TextField
                    required
                    error={isNameError}
                    helperText={isNameError ? "Name this analysis" : ""}
                    disabled={!editWorkspaceName}
                    value={localName}
                    onKeyPress={handleKeyPress}
                    onChange={handleOnChange}
                    label={"Workspace Name"}
                />
                <ButtonBase disabled={editWorkspaceName === ''} disableRipple>
                    <EditIcon sx={editWorkspaceName ? {color: theme.palette.primary.main} : {color: theme.palette.secondary.main}}
                              onClick={() => setEditWorkspaceName(!editWorkspaceName)}
                    />
                </ButtonBase>
                <ButtonBase disabled={workspaceName === ''}>
                    <PrintIcon
                        sx={workspaceName ? {color: theme.palette.primary.main} : {color: theme.palette.secondary.main}}
                        onClick={handlePrintOutClick} />
                </ButtonBase>

                {isPrinting && <PrintOut ref={printComponentRef} />}

            </Stack>
            <Button variant={"contained"} onClick={handleOnClick} disabled={workspaceName === '' || !!nameError}>
                Save Work
            </Button>
            <Typography
                variant={"body"}
                sx={{color: theme.palette.success.main}}
            >{statusMessage}</Typography>
        </Box>
    );
};
export default SaveWorkspace;