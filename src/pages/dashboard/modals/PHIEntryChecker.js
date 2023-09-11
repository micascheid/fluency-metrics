import {Box, Button, Modal, Stack, Typography} from "@mui/material";
import MainCard from "../../../components/MainCard";


const style = {
    position: 'absolute',
    top:'50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
    width: 400,
}

const PHIEntryChecker = ({isModalOpen, onYes, onNo}) => {

    return (
      <Modal open={isModalOpen}>
          <MainCard sx={style}>
              <Box sx={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
                  <Typography variant={"h4"} sx={{textAlign: 'center', pb: 1}}>
                      Have you entered any PHI information in the workspace name? If so please select yes and enter a different name
                  </Typography>
                  <Stack spacing={1}>
                      <Button variant={"contained"} onClick={onYes}>
                          Yes, I did enter patient PHI
                      </Button>
                      <Button variant={"contained"} onClick={onNo}
                      >
                          No, I didn't enter patient PHI
                      </Button>
                  </Stack>
              </Box>
          </MainCard>
      </Modal>
    );
};

export default PHIEntryChecker;