import react, {useContext, useEffect, useState} from 'react';
import {Box, Button, ButtonBase, Stack, TextField, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import MainCard from "../../components/MainCard";
import {Checkbox, FormControlLabel} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {useTheme} from '@mui/material/styles';

const SaveWorkspace = ({sx, name}) => {
    const {
        workspaceName,
        setWorkspaceName,
    } = useContext(StutteredContext);
    const [editWorkspaceName, setEditWorkspaceName] = useState(false);
    const [localName, setLocalName] = useState(workspaceName);
    const theme = useTheme();
    const [isNameError, setIsNameError] = useState(false);

    const handleOnClick = () => {
        if (localName.trim() === "") {
            setIsNameError(true);
            return;
        }

        if (localName !== workspaceName){
            setWorkspaceName(localName);
        }
    };

    const handleOnChange = (event) => {
        setLocalName(event.target.value);
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
                <Button variant={"contained"} onClick={handleOnClick} disabled={workspaceName === ''}>
                    Save Work
                </Button>
                <Typography variant={"h4"} fontWeight={"lighter"}>Current Analysis: </Typography>
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
            </Stack>

        </Box>
    );
};
export default SaveWorkspace;