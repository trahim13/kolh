import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

import { GET_DISTRICTS_FARMS_ACTION } from '../actions/actioncreators';

import { withStyles } from '@material-ui/core/styles';



const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}


class AddFarm extends Component {
    state = {
        open: false,
        name: "",
        unp: "",
    };

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false, name: "", unp: "" });

    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // handleChangeInput = (name) => event => {
    //     this.setState({[name]: event.target.checked});
    // };

    handleChangeInputFarm = (name) => event => {
        this.setState({ [name]: event.target.value });
    };

    getDistrictsFarms = () => {
        const {activeDistrictId} = this.props.kolhoz;
        fetch(`http://localhost:8080/districts/${activeDistrictId}/farms`)
            .then(response => response.json())
            .then(json => {
                this.props.getDistrictsFarms(json);
            })
    };

    addFarmByPost = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/farms", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: this.state.name, unp: this.state.unp, districtId: this.props.districtId })
        })
            .then((response => {
                if (response.ok) {
                    this.getDistrictsFarms();
                    this.handleClose();
                }

            }));

    };

    render() {
        const { titleForTable, classes } = this.props;
        return (
            <div className="add-farm-container">
                <Typography variant="h5" color="inherit">{titleForTable}</Typography>
                <Button variant="contained" color="primary" onClick={this.handleOpen}>Добавить хозяйство</Button>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Typography variant="h6" id="modal-title">
                            Добавить хозяйство
                        </Typography>
                        <form onSubmit={this.addFarmByPost} className="modal-form-flex" noValidate autoComplete="off">
                            <TextField
                                label="Наименование"
                                className={classes.textField}
                                value={this.state.name}
                                onChange={this.handleChangeInputFarm("name")}
                                margin="normal"
                            />
                            <TextField
                                label="УНП"
                                className={classes.textField}
                                value={this.state.unp}
                                onChange={this.handleChangeInputFarm("unp")}
                                margin="normal"
                            />
                            <TextField
                                label="Район"
                                className={classes.textField}
                                value={titleForTable || ""}
                                margin="normal"
                                disabled
                            />
                            <br />
                            <div className="modal-button-container">
                                <Button variant="contained" color="primary" type="submit" >Добавить</Button>
                                <Button variant="contained" color="secondary" onClick={this.handleClose}>Отмена</Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return { kolhoz: state.kolhoz };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDistrictsFarms: (arr) => {
            dispatch(GET_DISTRICTS_FARMS_ACTION(arr));
        },
    }
};

AddFarm = connect(mapStateToProps, mapDispatchToProps)(AddFarm);

AddFarm = withStyles(styles)(AddFarm);

export default AddFarm;
