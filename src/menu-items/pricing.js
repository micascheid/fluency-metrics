// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';
import {AttachMoney, SupportAgent} from '@mui/icons-material';
import {Modal} from "@mui/material";
// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined,
    SupportAgent,
    AttachMoney,
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const pricing = {
    id: 'pricing',
    title: 'Pricing',
    type: 'group',
    children: [
        {
            id: 'pricing',
            title: 'Pricing',
            type: 'item',
            url: '/pricing',
            icon: icons.AttachMoney
        },
    ]
};

export default pricing;
