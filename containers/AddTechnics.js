import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from 'date-fns/locale/ru';

import { GET_ACTIVE_TECHNICS_ACTION } from '../actions/actioncreators';

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
    const top = 0;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${left}%, -${top}%)`,
        margin: "20px 0"
    };
}


class AddTechnics extends Component {
    state = {
        open: false,
        inputFindMark: "",
        techTypes: null,
        techMarks: null,
        tech: {
            farmId: this.props.kolhoz.activeFarm,
            techGroupId: "",
            techTypeId: "",
            techMarkId: "",
            name: "",
            gosNumber: "",
            invNumber: "",
            shassisNumber: "",
            engineNumber: "",
            yearOfMake: "",
            isLizing: false,
            isGarantia: false,
            statusId: "",
            visitedDate: new Date(),
            notWorkDate: null,
            description: ""
        }
    };


    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    groupsHandleChange = (e) => {
        this.setState(prevState => ({
            tech: {
                ...prevState.tech,
                techGroupId: e.target.value
            }
        }), () => {
            fetch(`http://localhost:8080/groups/${e.target.value}/types`)
                .then(response => response.json())
                .then(json => {
                    this.setState({ techTypes: json })
                })
                .catch(err => console.log(err))
        });
    };

    typesHandleChange = (e) => {
        this.setState(prevState => ({
            tech: {
                ...prevState.tech,
                techTypeId: e.target.value
            }
        }), () => {
            fetch(`http://localhost:8080/types/${e.target.value}/marks`)
                .then(response => response.json())
                .then(json => {

                    this.setState({ techMarks: json })
                })
                .catch(err => console.log(err))
        });
    };

    marksHandleChange = (e) => {

        this.setState(prevState => ({
            tech: {
                ...prevState.tech,
                techMarkId: e.target.value,
                name:e._targetInst.child.child.memoizedProps
            }
        }));
    };
//**статус рабочее всегда должен иметь в базе данных id=1
//  * так как в противном случе будет некорктно работать стейт с датой поломки*/
    statusHandleChange = (e) => {

        if (e.target.value === 1) {
              this.setState(prevState => ({
                tech: {
                    ...prevState.tech,
                    notWorkDate: null
                }
            }));
        }

        this.setState(prevState => ({
            tech: {
                ...prevState.tech,
                statusId: e.target.value
            }
        }));
    };

    handleChangeInput = event => {
        const { value, name } = event.target;
        this.setState(prevState => ({
            tech: {
                ...prevState.tech,
                [name]: value
            }
        }));
    };

    switchHandleChange = name => event => {
        let state = Object.assign({}, this.state);
        state.tech[name] = event.target.checked;
        this.setState({ state });
    };

    handleDateChange = date => {
        this.setState(prevState => ({
            tech: {
                ...prevState.tech,
                visitedDate: date
            }
        }));
    };

    handleDateChangeNotWork = date => {
        this.setState(prevState => ({
            tech: {
                ...prevState.tech,
                notWorkDate: date
            }
        }));
    };


    inputFindMarkChange = (event) => {
        event.preventDefault();
        const { techTypeId } = this.state.tech;
        const { value, name } = event.target;
        this.setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        //как по синтексу проверить на equals ""
        if (this.state.inputFindMark.length === 0) {

            fetch(`http://localhost:8080/types/${event.target.value}/marks`)
                .then(response => response.json())
                .then(json => {

                    this.setState({ techMarks: json })
                })
                .catch(err => console.log(err))

        } else {
            fetch(`http://localhost:8080/types/${techTypeId}/search`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
                //как не отправлять весь стейт а только JSON inputFindMark: value
            })
                .then(response => response.json())
                .then(json => {

                    this.setState({ techMarks: json })

                })
                .catch(err => console.log(err));
        }

    };

    showTechnics = () => {
        console.log(this.props);
        const { activeFarm } = this.props.kolhoz;
        fetch(`http://localhost:8080/farms/${activeFarm}/technics`)
            .then(responce => responce.json())
            .then(json => {
                this.props.getActiveTechnics(json);
            })
            .catch(err => console.lof(err))
    };

    postTech = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/technics", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.tech)
        })
            .then((response => {
                if (response.ok) {
                    this.handleClose();
                    this.showTechnics();
                }
            }));
    };

    render() {
        const { techTypes, techMarks } = this.state;
        const { classes } = this.props;
        const { techGroups, techStatus } = this.props.kolhoz;
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleOpen}>Добавить технику</Button>
                <Modal
                    style={{ overflow: "auto" }}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                        <Typography variant="h6" id="modal-title">
                            Добавить технику
                        </Typography>
                        <form onSubmit={this.postTech} className="modal-form-flex" noValidate autoComplete="off">
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="tech-groups">Группа</InputLabel>
                                <Select
                                    value={this.state.tech.techGroupId}
                                    onChange={this.groupsHandleChange}
                                    inputProps={{
                                        name: 'tech-groups',
                                        id: 'tech-groups',
                                    }}
                                >

                                    {techGroups && techGroups.map(item => (
                                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                    )
                                    )}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="tech-types">Тип</InputLabel>
                                <Select
                                    disabled={techTypes === null ? true : false}
                                    value={this.state.tech.techTypeId}
                                    onChange={this.typesHandleChange}
                                    inputProps={{
                                        name: 'tech-types',
                                        id: 'tech-types',
                                    }}
                                >
                                    {
                                        techTypes && techTypes.map(item => (
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>

                            <TextField
                                label="Поиск марки"
                                disabled={techMarks === null}
                                value={this.state.inputFindMark}
                                onChange={this.inputFindMarkChange}
                                margin="normal"
                                name="inputFindMark"

                            />

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="tech-marks">Марка</InputLabel>
                                <Select
                                    disabled={techMarks === null ? true : false}
                                    value={this.state.tech.techMarkId}
                                    onChange={this.marksHandleChange}
                                    inputProps={{
                                        name: 'tech-marks',
                                        id: 'tech-marks',

                                    }}
                                >
                                    {
                                        techMarks && techMarks.map(item => (
                                            <MenuItem
                                                key={item.id}
                                                value={item.id}
                                                data-name={item.name}>{item.name}
                                            </MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                            <TextField
                                label="Наименование"
                                value={this.state.tech.name}
                                onChange={this.handleChangeInput}
                                margin="normal"
                                name="name"
                                required
                            />
                            <TextField
                                label="Гос. номер"
                                value={this.state.tech.gosNumber}
                                onChange={this.handleChangeInput}
                                margin="normal"
                                name="gosNumber"
                                required
                            />
                            <TextField
                                label="Инв. номер"
                                value={this.state.tech.invNumber}
                                onChange={this.handleChangeInput}
                                margin="normal"
                                name="invNumber"
                                required
                            />
                            <TextField
                                label="Номер шасси"
                                value={this.state.tech.shassisNumber}
                                onChange={this.handleChangeInput}
                                margin="normal"
                                name="shassisNumber"
                                required
                            />
                            <TextField
                                label="Номер двигателя"
                                value={this.state.tech.engineNumber}
                                onChange={this.handleChangeInput}
                                margin="normal"
                                name="engineNumber"
                                required
                            />
                            <TextField
                                label="Год производства"
                                value={this.state.tech.yearOfMake}
                                onChange={this.handleChangeInput}
                                margin="normal"
                                name="yearOfMake"
                                required
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.tech.isLizing}
                                        onChange={this.switchHandleChange("isLizing")}
                                        value="isLizing"
                                    />
                                }
                                label="Лизинг"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={this.state.tech.isGarantia}
                                        onChange={this.switchHandleChange("isGarantia")}
                                        value="isGarantia"
                                    />
                                }
                                label="Гарантия"
                            />

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="tech-status">Статус</InputLabel>
                                <Select

                                    value={this.state.tech.statusId}
                                    onChange={this.statusHandleChange}
                                    inputProps={{
                                        name: 'statusId',
                                        id: 'tech-status',
                                    }}

                                >
                                    {
                                        techStatus && techStatus.map(item => (
                                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>

                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                <Grid container className={classes.grid} justify="space-around">
                                    <DatePicker
                                        margin="normal"
                                        label="Дата проверки"
                                        value={this.state.tech.visitedDate}
                                        onChange={this.handleDateChange}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>

                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                                <Grid container className={classes.grid} justify="space-around">
                                    <DatePicker
                                        margin="normal"
                                        label="Дата поломки"
                                        value={this.state.tech.notWorkDate}
                                        onChange={this.handleDateChangeNotWork}
                                        /**статус рабочее всегда должен иметь в базе данных id=1
 * так как в противном случе будет некорктно работать стейт с датой поломки*/
                                        disabled={this.state.tech.statusId===1}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>

                            <TextField
                                label="Описание"
                                value={this.state.tech.description}
                                onChange={this.handleChangeInput}
                                margin="normal"
                                name="description"
                                multiline
                                rows="4"
                            />
                            <br />
                            <div className="modal-button-container">
                                <Button variant="contained" color="primary" type="submit">Добавить</Button>
                                <Button variant="contained" color="secondary" onClick={this.handleClose}>Отмена</Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return { kolhoz: state.kolhoz };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getActiveTechnics: (arr) => {
            dispatch(GET_ACTIVE_TECHNICS_ACTION(arr));
        }
    }
};


AddTechnics = connect(mapStateToProps, mapDispatchToProps)(AddTechnics);

AddTechnics = withStyles(styles)(AddTechnics);

export default AddTechnics;