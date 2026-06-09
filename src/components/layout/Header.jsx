import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

/////////////////Icon//////////////////////
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import LocalAirportRoundedIcon from '@mui/icons-material/LocalAirportRounded';
import { DarkModeOutlined, LightModeOutlined, Person2Outlined } from '@mui/icons-material';

/////////////////////Dark mode //////////////////////////
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { ThemeProvider, createTheme, useColorScheme } from '@mui/material/styles';




//////////////////components /////////////////////////

import Sidebar from "./Sidebar"
import { Outlet } from 'react-router-dom';
const drawerWidth = 240;
/////////////////////////////////////////

//////////////////////////////////////////
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));
/////////////////////Style AppBar  (Header)//////////////////////////
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
 
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
    
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));
///////////////////// End Style AppBar //////////////////////////
/////////////Dark mode/////////////////
function MyApp() {
  const theme = useTheme()
  const { mode, setMode } = useColorScheme();
  if (!mode) {
    return null;
  }
  return (
    <Box

    >
      <FormControl>

        <RadioGroup
          aria-labelledby="demo-theme-toggle"
          name="theme-toggle"
          row
          value={mode}
          onChange={(event) => setMode(event.target.value)}
        >
          {theme.palette.mode === "light" ?
            (<FormControlLabel value="system" control={<Radio />} label="Dark" />) : (<FormControlLabel value="light" control={<Radio />} label="Light" />)}
        </RadioGroup>
      </FormControl>
    </Box>
  );
}



export default function Header() {

  const [open, setOpen] = React.useState(false);
  // const theme = useTheme()
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const themes = createTheme({
    colorSchemes: {
      dark: true,

    },
  });
  // /////////////////////////////

  return (
    <>
      <ThemeProvider theme={themes}>  {/* dark mode  */}
        <Box sx={{ display: 'flex' }}>

          <CssBaseline />
          {/* //////////////////Header/////////////////// */}
          <AppBar position="fixed" open={open}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                  {
                    marginRight: 5,
                  },
                  open && { display: 'none' },
                ]}
              >
                <MenuIcon />
              </IconButton>

              <Typography variant="h6" noWrap component="div">
                Welcome  to dashboard
              </Typography>

              <Box sx={{ flexGrow: '1' }} />    {/* for design */}
              <Stack direction={"row"} >

                <MyApp />
                <IconButton color='inherit'  >
                  <Person2Outlined />
                </IconButton>
              </Stack>

            </Toolbar>
          </AppBar>
          {/* //////////////////End Header/////////////////// */}

          {/* ///////////component Sidebar//////////// */}
          <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
          {/* end sidebar */}
 
          <Box component="main" >
            <DrawerHeader />
            <Outlet />
          </Box>
        </Box>


      </ThemeProvider>
    </>


  );
}
