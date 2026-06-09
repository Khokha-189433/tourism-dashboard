import React from 'react'
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link, useNavigate } from 'react-router-dom';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalAirportRoundedIcon from '@mui/icons-material/LocalAirportRounded';
import { ColorLens } from '@mui/icons-material';
import {grey} from '@mui/material/colors'

const drawerWidth = 240;

 ////////////open && close => sidebar///////////////////
 const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(2)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(6.6)} + 1px)`,
  },
});
/////////////////////Style Drawer (Sidebar)  //////////////////////////
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);
//////////////////////////////////
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function Sidebar({open ,handleDrawerClose }) {
    const array = [{text:"Dashboard", Icon : <InboxIcon /> , path:"/dashboard" } ,
       {text:"Users", Icon : <PeopleAltIcon /> , path:"/Users" } ,
      {text:"Trip", Icon : <LocalAirportRoundedIcon /> , path:"/trip" }]
    const navgiate = useNavigate();
  const theme = useTheme();
  return (
    <>
        <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}      {/* ايقون ل فتح و اغلاق ال sidebar */}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {/* List Users */}
      <List>
          {array.map((Item) => (
            <ListItem key={Item.path} disablePadding >
              <ListItemButton onClick={()=>{
                navgiate(Item.path)
              }}
               sx={{
                justifyContent : open ?  "center" : "inherit" 
               , 
               bgcolor : 
               location.pathname === Item.path 
               ?theme.palette.mode ==="dark" ? grey[600] :grey[300] : null}}>
                <ListItemIcon sx={{color:" rgba(136, 189, 224, 0.945)"}}>
                  {Item.Icon}
                </ListItemIcon>
                <ListItemText 
                primary={Item.text}
                 sx={{color :"rgb(132, 173, 201)"  }} 
                  sx={[
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]  }
                 />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
         {/*/////////////////////////// List Trip //////////////////////////////////////*/}
            <List>
                    <Link to="/dashboard" >
                        <ListItem disablePadding sx={{ display: 'block' }}>

                            <ListItemButton >
                                <ListItemIcon>
                                    <LocalAirportRoundedIcon />       {/*  Users Icon  */}
                                </ListItemIcon>
                                <ListItemText
                                    primary={'Trip'}
                                    sx={[
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
                {/*////////////////////////////End List Trip //////////////////////////////////////*/}
                  <List>
                    <Link to="/Users" >
                        <ListItem disablePadding sx={{ display: 'block' }}>

                            <ListItemButton >
                                <ListItemIcon>
                                    <LocalAirportRoundedIcon />       {/*  Users Icon  */}
                                </ListItemIcon>
                                <ListItemText
                                    primary={'Trip'}
                                    sx={[
                                        open
                                            ? {
                                                opacity: 1,
                                            }
                                            : {
                                                opacity: 0,
                                            },
                                    ]}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                </List>
      </Drawer>
    </>
  )
}

export default Sidebar
