import react, {useContext} from 'react';
import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import {StutteredContext} from "../../context/StutteredContext";
import MainCard from "../../components/MainCard";



const LoadPreviousAudioFile = ({open, setIsLoadingModal}) => {
    const {
        setFileChosen,
        setAudioFile,
        setAudioFileName,
    } = useContext(StutteredContext);

    let file;
    let audioFile;
    let audioFileName;
    const helperText = "Please select the file associated with the workspace you have chosen";

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        display: 'flex',
        justifyContent: 'center'
    }

    const handleFileChange = (event) => {
        event.stopPropagation();

        const file = event.target.files[0];
         if (file) {
             audioFile = file;
             audioFileName = file.name;
             // setFileChosen(false);
         }
         // setAudioFile(file);
         // setAudioFileName(file.name);
         // setFileChosen(true);

    };

    const handleLoadWorkspace = () => {
        setAudioFile(audioFile);
        setAudioFileName(audioFileName);
    };

    const handleOnClose = () => {
        setIsLoadingModal(false);
    }

    return (
        <Modal open={open} onClose={handleOnClose}>
            <MainCard style={style}>
                <Stack spacing={2}>
                    <Typography>{helperText}</Typography>
                    <input
                        type={"file"}
                        onChange={handleFileChange}
                    />
                    <Button variant={"contained"} onClick={handleLoadWorkspace}>
                        Load Workspace
                    </Button>
                </Stack>

            </MainCard>
        </Modal>
    );
};

export default LoadPreviousAudioFile;