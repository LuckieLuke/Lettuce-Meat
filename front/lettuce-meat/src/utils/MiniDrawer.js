import React from 'react';
import clsx from 'clsx';
import '../index.css'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import sha512 from 'js-sha512'


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    logoName: {
        fontFamily: 'Balsamiq Sans',
        fontSize: 27,
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

const handleLogIn = () => {
    window.location = '/login'
}

const handleLogOut = () => {
    window.localStorage.removeItem('login');
    window.location = '/';
}

export default function MiniDrawer(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography className={clsx(classes.logoName)} variant="h6" noWrap>
                        Lettuce 🥬 Meat 🥩
          </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key={'Home'} onClick={() => window.location = '/'}>
                        <ListItemIcon><HomeIcon /></ListItemIcon>
                        <ListItemText primary='Home Page' />
                    </ListItem>
                    <ListItem button key={'Recipies'}>
                        <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
                        <ListItemText primary='Recipies' />
                    </ListItem>
                    <ListItem button key={'AddRecipe'}>
                        <ListItemIcon><AddIcon /></ListItemIcon>
                        <ListItemText primary='Add Recipe' />
                    </ListItem>
                </List>
                <Divider />
                {window.localStorage.getItem('login') && sha512((new Date().toISOString().slice(0, 10)).toString()) === window.localStorage.getItem('au_co') ?
                    <>
                        <List>
                            <ListItem button key={'Favorite'}>
                                <ListItemIcon><FavoriteIcon /></ListItemIcon>
                                <ListItemText primary='Favorites' />
                            </ListItem>
                            <ListItem button key={'Menus'}>
                                <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
                                <ListItemText primary='My Menus' />
                            </ListItem>
                            <ListItem button key={'AddMenu'}>
                                <ListItemIcon><AddIcon /></ListItemIcon>
                                <ListItemText primary='Add Menu' />
                            </ListItem>
                            <ListItem button key={'CreateMenu'}>
                                <ListItemIcon><CreateIcon /></ListItemIcon>
                                <ListItemText primary='Create Menu' />
                            </ListItem>
                        </List>
                        <Divider />
                    </>
                    : null}
                <List>
                    {!window.localStorage.getItem('login') ?
                        <>
                            <ListItem button key={'SignIn'} onClick={handleLogIn}>
                                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                                <ListItemText primary='Sign In' />
                            </ListItem>
                            <ListItem button key={'SignUp'} onClick={() => window.location = '/signup'}>
                                <ListItemIcon><AssignmentTurnedInIcon /></ListItemIcon>
                                <ListItemText primary='Sign Up' />
                            </ListItem>
                        </>
                        :
                        <ListItem button key={'SignOut'} onClick={handleLogOut}>
                            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary='Sign Out' />
                        </ListItem>
                    }
                </List>
            </Drawer>
            <main className={classes.content}>
                {props.content}
            </main>
        </div>
    );
}
