import React, { Component } from 'react';
import { GET_ACTIVE_TECHNICS_ACTION, SET_EDIT_TECHICS_ACTION } from '../actions/actioncreators';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddTechnics from './AddTechnics';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class TechnicsList extends Component {

    setTechicsId = (id) => {
        this.props.setEditTechnics(id)
    };



    state = {
        name:"",
        group: "",
        type:"",
        mark:"",
        gosNumber:"",
        invNumber:"",
        status:"",
        date: "",
        techTest: this.props.kolhoz.activeTechnics
    };

    componentDidMount() {
        const {activeTechnics} = this.props.kolhoz;
        this.setState(prevState => ({
            techData: {
                ...prevState,
                techTest: activeTechnics
            }
        }));


    }



    onGroupChange = (e) => {

        const {activeTechnics} = this.props.kolhoz;

        this.setState({group: e.target.value});

        let techTest = activeTechnics.filter((item) => {
            return item.techGroup.name.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1;
        });

        this.setState({techTest});


        console.log(e.target.value);
        console.log(activeTechnics);
        console.log(techTest);


    };



    render() {
        const { activeTechnics } = this.props.kolhoz;
        console.log(this.props.kolhoz);
        return (
            <div>
                <Typography variant="h5" color="inherit">{this.props.titleForTable}</Typography>
                <Typography variant="h5" color="inherit"></Typography>
                <AddTechnics></AddTechnics>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер</TableCell>
                            <TableCell>Группа</TableCell>
                            <TableCell>Тип</TableCell>
                            <TableCell>Марка</TableCell>
                            <TableCell>Гос. номер</TableCell>
                            <TableCell>Инвентарный номер</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Дата проверки</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>

                            </TableCell>

                            <TableCell>
                                <TextField
                                    id="outlined-dense"
                                    label=""
                                    margin="dense"
                                    variant="outlined"
                                    onChange={this.onGroupChange}
                                />
                            </TableCell>

                            <TableCell>
                                <TextField
                                    id="outlined-dense"
                                    label=""
                                    margin="dense"
                                    variant="outlined"

                                />
                            </TableCell>

                            <TableCell>
                                <TextField
                                    id="outlined-dense"
                                    label=""
                                    margin="dense"
                                    variant="outlined"
                                />
                            </TableCell>

                            <TableCell>
                                <TextField
                                    id="outlined-dense"
                                    label=""
                                    margin="dense"
                                    variant="outlined"
                                />
                            </TableCell>

                            <TableCell>
                                <TextField
                                    id="outlined-dense"
                                    label=""
                                    margin="dense"
                                    variant="outlined"
                                />
                            </TableCell>

                            <TableCell>
                                <TextField
                                    id="outlined-dense"
                                    label=""
                                    margin="dense"
                                    variant="outlined"
                                />
                            </TableCell>

                            <TableCell>
                                <TextField
                                    id="outlined-dense"
                                    label=""
                                    margin="dense"
                                    variant="outlined"
                                />
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.techTest && this.state.techTest.map((item, index) => {
                            return (
                                <TableRow key={item.id} onDoubleClick={() => this.setTechicsId(item.id)}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.techGroup.name}</TableCell>
                                    <TableCell>{item.techType.name}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.gosNumber}</TableCell>
                                    <TableCell>{item.invNumber}</TableCell>
                                    <TableCell>{item.technicStatusList[0].status.name}</TableCell>
                                    <TableCell>{item.technicStatusList[0].visitedDate}</TableCell>
                                </TableRow>
                            )
                        })}


                    </TableBody>
                </Table>
            </div>
        );
    }
}
//какие данные из общего state вам нужны в данном компоненте
const mapStateToProps = (state) => {
    return { kolhoz: state.kolhoz };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setEditTechnics: (id) => {
            dispatch(SET_EDIT_TECHICS_ACTION(id));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(TechnicsList);


