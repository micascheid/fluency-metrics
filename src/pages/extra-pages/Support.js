// material-ui
import {Divider, Stack, Typography} from '@mui/material';

// project import
import MainCard from '../../components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Support = () => (
    <MainCard title="Support">
        <Stack direction={"row"} spacing={2}>
            <Typography variant="h6">
                Email:
            </Typography>
            <Typography variant="h6">
                micalinscheid@fluencymetrics.com
            </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
            <Typography variant="h6">
                Phone:
            </Typography>
            <Typography variant="h6">
                1-907-942-2446
            </Typography>
        </Stack>
        <Divider sx={{width: '100%'}}/>
    </MainCard>
);

export default Support;
