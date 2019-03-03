import React from 'react';
import { connect } from 'react-redux';
import Farms from "./containers/Farms";
import AddFarm from "./containers/AddFarm";
import TechnicsList from "./containers/TechnicsList";
import { SET_ACTIVE_FARM_ACTION, SET_EDIT_TECHICS_ACTION, GET_ACTIVE_DISTRICT_ID_ACTION, GET_TECH_GROUP_ACTION, GET_DISTRICTS_FARMS_ACTION, GET_TECH_STATUS_ACTION } from './actions/actioncreators';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UpdateTechnics from './containers/UpdateTechnics'

class App extends React.Component {
    state = {
        open: false,
        regions: null,
        expanded: null,
        districtId: null,
        farms: null, //подумать над переносос в редакс стэйт
        titleForTable: null
    };

    componentDidMount() {
        fetch("http://localhost:8080/regions")
            .then(response => response.json())
            .then(json => {
                this.setState({ regions: json });
            })
            .catch(err => console.log(err))

        fetch("http://localhost:8080/groups")
            .then(response => response.json())
            .then(json => {
                this.props.getTechGroups(json);
            })
            .catch(err => console.log(err))

        fetch("http://localhost:8080/status")
            .then(response => response.json())
            .then(json => {
                this.props.getTechStatus(json);
            })
            .catch(err => console.log(err))
    }

    handleDrawerOpen = () => {

        this.setState({open: true});
    };

    handleDrawerClose = () => {

        this.setState({ open: false });
    };


    getDistrictsFarms = (id, name) => {

        this.handleDrawerClose();
        const {setEditTechnics} = this.props;
        setEditTechnics();
        this.props.setActiveFarm();
        fetch(`http://localhost:8080/districts/${id}/farms`)
            .then(response => response.json())
            .then(json => {
                this.props.getDistrictsFarms(json);
                this.props.getActiveDistrict(id);
                this.setState({titleForTable: name + " район", districtId: id})
            });

    };

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };

    render() {
        const { getDistricts, classes } = this.props;
        const { activeRegion, activeFarm, editTechicsId } = this.props.kolhoz;
        const { open, expanded, regions, districtId, farms, titleForTable } = this.state;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                >
                    <Toolbar disableGutters={!open}>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            АИС Колхоз
            </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    {regions && regions.map(item => (
                        <ExpansionPanel key={item.id} expanded={expanded === item.id} onChange={this.handleChange(item.id)} >
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography >{item.name + " область"}</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <List>
                                    {item.districts.map(item => (
                                        <ListItem key={item.id} onClick={() => this.getDistrictsFarms(item.id, item.name)}>{item.name + " район"}</ListItem>
                                    ))}
                                </List>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))}

                </Drawer>
                <main
                    className={classNames(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader} />
                    {!activeFarm && <AddFarm titleForTable={titleForTable} districtId={districtId}></AddFarm>}
                    {!activeFarm && < Farms farms={this.props.kolhoz.districtsFarms} titleForTable={titleForTable}></Farms>}
                    {activeFarm && !editTechicsId && <TechnicsList titleForTable={this.state.titleForTable} />}
                    {activeFarm && editTechicsId && <UpdateTechnics id={editTechicsId} />}
                </main>
            </div >);
    }
}


const drawerWidth = 300;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
});



const mapStateToProps = (state) => {
    return { kolhoz: state.kolhoz };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveFarm: (id) => {
            dispatch(SET_ACTIVE_FARM_ACTION(id));
        },
        getDistrictsFarms: (arr) => {
            dispatch(GET_DISTRICTS_FARMS_ACTION(arr));
        },
        getTechGroups: (arr) => {
            dispatch(GET_TECH_GROUP_ACTION(arr));
        },
        getTechStatus: (arr) => {
            dispatch(GET_TECH_STATUS_ACTION(arr));
        },
        getActiveDistrict: (id) => {
            dispatch(GET_ACTIVE_DISTRICT_ID_ACTION(id));
        },
        setEditTechnics: () => {
            dispatch(SET_EDIT_TECHICS_ACTION());
        }
    }
};

App = connect(mapStateToProps, mapDispatchToProps)(App);


export default withStyles(styles, { withTheme: true })(App);




