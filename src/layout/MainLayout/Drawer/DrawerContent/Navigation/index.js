// material-ui
import {Box, Stack, Typography} from '@mui/material';
import { SupportAgent, MailOutline } from '@mui/icons-material';
// project stuff
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //
const Navigation = () => {
    const navGroups = menuItem.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item}/>;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Fix - Navigation Group
                    </Typography>
                );
        }
    });

    const renderSupportBox = () => (
        <Stack sx={{pl: 3}} spacing={1}>
            <Typography variant={"subtitle2"} color={"textSecondary"}>Support</Typography>
            <Stack direction={"row"} spacing={1}>
                <SupportAgent fontSize={"small"} />
                <Typography variant={"h6"}>1-907-942-2446(call/text)</Typography>
            </Stack>
            <Stack direction={"row"} spacing={1}>
                <MailOutline fontSize={"small"} />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant={"h6"}>micalinscheid</Typography>
                    <Typography variant={"h6"}>@fluencymetrics.com</Typography>
                </Box>
            </Stack>
        </Stack>
    );


    return (
        <Box sx={{pt: 2}}>
            {navGroups}
            {/*{renderSupportBox()}*/}
        </Box>
    );
};


export default Navigation;