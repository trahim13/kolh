import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SET_EDIT_TECHICS_ACTION } from '../actions/actioncreators';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import Grid from "@material-ui/core/Grid";
import { GET_ACTIVE_TECHNICS_ACTION } from '../actions/actioncreators';
import Typography from "@material-ui/core/Typography";
import {borders} from '@material-ui/system'


class UpdateTechnics extends Component {

    state = {
        disabledEditTechicsFields: true,

        updateTechData: {
            id:"",
            name:"",
            gosNumber: "",
            invNumber: "",
            shassisNumber: "",
            engineNumber: "",
            yearOfMake: "",
        },

        techData: null,
        tech: {
            farmId: this.props.kolhoz.activeFarm,
            techGroupId: "",
            techTypeId: "",
            techMarkId: "",
            technicId: "",
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

    componentDidMount() {
        const { id } = this.props;
        fetch(`http://localhost:8080/technic/${id}`)
            .then(response => response.json())
            .then(json => {
                this.setState({ techData: json })
                console.log(this.state)
            })
            .catch(err => console.log(err))
    }

    cancelUpdateTechnic = () => {
        const { setEditTechnics } = this.props;
        setEditTechnics();
    };

    switchHandleChange = name => event => {
        let state = Object.assign({}, this.state);
        state.techData.technicStatusList[0][name] = event.target.checked;
        console.log(state.techData.technicStatusList[0][name]);
        this.setState(state);
    };


    handleDateChange = name => date => {

        let state = Object.assign({}, this.state);
        state.techData.technicStatusList[0][name] = date;
        this.setState(state);


    };


    handleChangeDescriptionInput = event => {
        const { value, name } = event.target;
        let state = Object.assign({}, this.state);
        state.techData.technicStatusList[0][name] = value;
        this.setState(state);
    };

/**статус рабочее всегда должен иметь в базе данных id=1
 * так как в противном случе будет некорктно работать стейт с датой поломки*/
    statusHandleChange = (event) => {

        const { value } = event.target;
        let state = Object.assign({}, this.state);

        if (value === 1) {
            state.techData.technicStatusList[0].notWorkDate = null;
        }

        state.techData.technicStatusList[0].status.id = value;
        state.techData.technicStatusList[0].description = "";


        this.setState(state);


    };
//подготовка обыекта для сохранения данных о статусе конкретной техники
    createObjectForSendStatus() {
        let state = Object.assign({}, this.state);
        let newTech = state.tech;
        newTech.technicId = state.techData.id;
        newTech.statusId = state.techData.technicStatusList[0].status.id;
        newTech.isGarantia = state.techData.technicStatusList[0].isGarantia;
        newTech.isLizing = state.techData.technicStatusList[0].isLizing;
        newTech.notWorkDate = state.techData.technicStatusList[0].notWorkDate;
        newTech.visitedDate = state.techData.technicStatusList[0].visitedDate;
        newTech.description = state.techData.technicStatusList[0].description;
        state.tech = newTech;
        this.setState(state);

    }



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

    postUpdateTech = (e) => {
        e.preventDefault();
        this.createObjectForSendStatus();
        fetch("http://localhost:8080/status", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.tech)
        }).then((response => {
            if (response.ok) {
                this.cancelUpdateTechnic();
                this.showTechnics();
            }
        }));
    };




//копируем данные во временный стейт, на случай  если пользователь нажмет отмена обновления значений открытой еденицы техники
    enableEditTechicsFields = (e) => {
        e.preventDefault();
        let state = Object.assign({}, this.state);
        state.updateTechData.id = state.techData.id;
        state.updateTechData.name = state.techData.name;
        state.updateTechData.gosNumber = state.techData.gosNumber;
        state.updateTechData.invNumber = state.techData.invNumber;
        state.updateTechData.shassisNumber = state.techData.shassisNumber;
        state.updateTechData.engineNumber = state.techData.engineNumber;
        state.updateTechData.yearOfMake = state.techData.yearOfMake;
        state.disabledEditTechicsFields = !this.state.disabledEditTechicsFields;

        this.setState(state);

    };

    //обработка вводимых значений для обновляемой техники
    handleChangeInputForUpdate = event => {

        const { value, name} = event.target;
        this.setState(prevState => ({
            techData: {
                ...prevState.techData,
                [name]: value
            }
        }), () => console.log(this.state));
    };


//кнопка ОТМЕНЫ редактирования техники
    cancelChangeInputForUpdate = (e) => {
        e.preventDefault();
        let state = Object.assign({}, this.state);
        state.techData.id = state.updateTechData.id;
        state.techData.name = state.updateTechData.name;
        state.techData.gosNumber = state.updateTechData.gosNumber;
        state.techData.invNumber = state.updateTechData.invNumber;
        state.techData.shassisNumber = state.updateTechData.shassisNumber;
        state.techData.engineNumber = state.updateTechData.engineNumber;
        state.techData.yearOfMake = state.updateTechData.yearOfMake;
        state.disabledEditTechicsFields = !this.state.disabledEditTechicsFields;
        //обнуление стейта резервного
        state.updateTechData.id = "";
        state.updateTechData.name = "";
        state.updateTechData.gosNumber = "";
        state.updateTechData.invNumber = "";
        state.updateTechData.shassisNumber = "";
        state.updateTechData.engineNumber = "";
        state.updateTechData.yearOfMake = "";


        this.setState(state);

    };


    //подготовка объекта для сохранения данных о  конкретной техники
    //кнопка редактировать-сохранить
    createObjectForSendTechnicUpdate() {
        let state = Object.assign({}, this.state);
        let newTech = state.tech;
        newTech.technicId = state.techData.id;
        newTech.name = state.techData.name;
        newTech.gosNumber = state.techData.gosNumber;
        newTech.invNumber =  state.techData.invNumber;
        newTech.shassisNumber = state.techData.shassisNumber;
        newTech.engineNumber = state.updateTechData.engineNumber;
        newTech.yearOfMake = state.techData.yearOfMake;
        state.tech = newTech;
        this.setState(state);

    }

    saveChangeInputForUpdate = (e) => {
        e.preventDefault();

        this.createObjectForSendTechnicUpdate();


        fetch("http://localhost:8080/technics", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.tech)
        }).then((response => {
            if (response.ok) {
                //обнулить резервный стейт
                let state = Object.assign({}, this.state);
                //закрыть поля для редактирования и сворачивание кнопок
                state.disabledEditTechicsFields = !this.state.disabledEditTechicsFields;
                state.updateTechData.id = "";
                state.updateTechData.name = "";
                state.updateTechData.gosNumber = "";
                state.updateTechData.invNumber = "";
                state.updateTechData.shassisNumber = "";
                state.updateTechData.engineNumber = "";
                state.updateTechData.yearOfMake = "";


                this.setState(state);

            }
        }));
    };


    //обработка вводимых значений для календаря даты проверки техники
    handleChangeInputForUpdateDateVisitedDate= event => {

        const { value} = event.target;

        let state = Object.assign({}, this.state);
        state.techData.technicStatusList[0].visitedDate = value;
        this.setState(state);

    };

//обработка вводимых значений для календаря даты неисправности техники техники
    handleChangeInputForUpdateDateNotWorkDate= event => {

        const { value} = event.target;

        let state = Object.assign({}, this.state);
        state.techData.technicStatusList[0].notWorkDate = value;
        this.setState(state);

    };






    render() {
        const { techStatus } = this.props.kolhoz;
        const { techData, disabledEditTechicsFields } = this.state;
        return (
            <div>
                {techData && <form onSubmit={this.postUpdateTech}>
                    <div style={{ display: "flex" }}>

                        <div style={{
                            minWidth: 400,
                            paddingRight: 50,
                            display: "flex",
                            flexDirection: "column",
                            borderWidth: 0.5,
                            borderColor: "darkslateblue",
                            borderStyle: "solid",
                            marginRight: 12,
                            paddingLeft: 10,
                            paddingBottom: 10,
                            marginTop: 10
                             }}>
                            <Typography variant="h5" color="inherit">Сведения о технике</Typography>
                            <TextField
                                label="Группа"
                                value={techData.techGroup.name}
                                margin="normal"
                                name="tech-group"
                                disabled
                            />
                            <br />
                            <TextField
                                label="Тип"
                                value={techData.techType.name}
                                margin="normal"
                                name="tech-type"
                                disabled
                            />
                            <br />
                            <TextField
                                label="Марка"
                                value={techData.techMark.name}
                                margin="normal"
                                name="tech-mark"
                                disabled
                            />
                            <br />
                            <TextField
                                label="Наименование"
                                value={techData.name || ""} // пример
                                margin="normal"
                                name="name"
                                disabled={disabledEditTechicsFields}
                                onChange={this.handleChangeInputForUpdate}
                            />
                            <br />

                            <TextField
                                label="Гос. номер"
                                value={techData.gosNumber|| ""}
                                margin="normal"
                                name="gosNumber"
                                disabled={disabledEditTechicsFields}
                                onChange={this.handleChangeInputForUpdate}
                            />
                            <br />
                            <TextField
                                label="Инв. номер"
                                value={techData.invNumber|| ""}
                                margin="normal"
                                name="invNumber"
                                disabled={disabledEditTechicsFields}
                                onChange={this.handleChangeInputForUpdate}
                            />
                            <br />
                            <TextField
                                label="Номер шасси"
                                value={techData.shassisNumber|| ""}
                                margin="normal"
                                name="shassisNumber"
                                disabled={disabledEditTechicsFields}
                                onChange={this.handleChangeInputForUpdate}
                            />
                            <br />
                            <TextField
                                label="Номер двигателя"
                                value={techData.engineNumber|| ""}
                                margin="normal"
                                name="engineNumber"
                                disabled={disabledEditTechicsFields}
                                onChange={this.handleChangeInputForUpdate}
                            />
                            <br />
                            <TextField
                                label="Год производства"
                                value={techData.yearOfMake|| ""}
                                margin="normal"
                                name="yearOfMake"
                                disabled={disabledEditTechicsFields}
                                onChange={this.handleChangeInputForUpdate}
                            />
                            <br />
                            {this.state.disabledEditTechicsFields ? <Button variant="contained" color="primary"


                                onClick={this.enableEditTechicsFields}>Редактировать сведения о технике</Button> : <div style={{
                                    display: "flex", justifyContent: "space-between"
                                }}>
                                <Button variant="contained" color="primary" onClick={this.saveChangeInputForUpdate}> Сохранить </Button>
                                <Button variant="contained" color="primary" onClick={this.cancelChangeInputForUpdate}> Отмена </Button></div>}
                        </div>



                        <div style={{
                            minWidth: 400,
                            paddingRight: 50,
                            display: "flex",
                            flexDirection: "column" ,

                            borderWidth: 0.5,
                            borderColor: "crimson",
                            borderStyle: "solid",
                            marginRight: 12,
                            paddingLeft: 10,
                            paddingBottom: 10,
                            marginTop: 10
                        }}>


                            <Typography variant="h5" color="inherit">Статус техники</Typography>

                            <div style={{
                                marginTop:16,
                                marginBottom: 8
                            }}>



                                < TextField
                                    id="date"
                                    label="Дата проверки"
                                    type="date"
                                    defaultValue={techData.technicStatusList[0].visitedDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={this.handleChangeInputForUpdateDateVisitedDate}
                                />
                            </div>

                            <br />

                            <FormControl>
                                <InputLabel htmlFor="tech-status">Статус</InputLabel>
                                <Select
                                    value={techData.technicStatusList[0].status.id}
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
                            <br />



                            <TextField
                                id="date"
                                label="Дата поломки"
                                type="date"
                                defaultValue={techData.technicStatusList[0].notWorkDate}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                disabled={techData.technicStatusList[0].status.id===1}
                                onChange={this.handleChangeInputForUpdateDateNotWorkDate}
                            />

                            <br />
                            <TextField
                                label="Описание"
                                value={techData.technicStatusList[0].description|| ""}
                                onChange={this.handleChangeDescriptionInput}
                                margin="normal"
                                name="description"
                                multiline
                                rows="4"
                            />
                            <br />



                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={techData.technicStatusList[0].isLizing}
                                        value="isLizing"
                                        onChange={this.switchHandleChange("isLizing")}
                                    />
                                }
                                label="Лизинг"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={techData.technicStatusList[0].isGarantia}
                                        value="isGarantia"
                                        onChange={this.switchHandleChange("isGarantia")}
                                    />
                                }
                                label="Гарантия"
                            />
                            <br />




                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Button type="submit" variant="contained" color="secondary">Сохранить</Button>
                                <Button variant="contained" color="secondary"
                                    onClick={() => this.cancelUpdateTechnic()}>Отмена / Закрыть</Button>
                            </div>

                        </div>
                    </div>


                </form>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { kolhoz: state.kolhoz };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setEditTechnics: () => {
            dispatch(SET_EDIT_TECHICS_ACTION());
        },
        getActiveTechnics: (arr) => {
            dispatch(GET_ACTIVE_TECHNICS_ACTION(arr));
        }
    }
};

UpdateTechnics = connect(mapStateToProps, mapDispatchToProps)(UpdateTechnics);

export default UpdateTechnics;