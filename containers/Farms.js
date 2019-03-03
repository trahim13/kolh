import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SET_ACTIVE_FARM_ACTION, GET_ACTIVE_TECHNICS_ACTION } from '../actions/actioncreators';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from "@material-ui/core/Button";



class Farms extends Component {
    showTechnics = (id) => {
        fetch(`http://localhost:8080/farms/${id}/technics`)
            .then(responce => responce.json())
            .then(json => {
                this.props.setActiveFarm(id);
                this.props.getActiveTechnics(json);
            })
    };


    render() {
        const { farms, titleForTable } = this.props;
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Номер </TableCell>
                        <TableCell>Наименование</TableCell>
                        <TableCell>УНП</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {farms && farms.map((item, index) => (
                        <TableRow key={item.id} style={{ cursor: "pointer" }} onClick={() => this.showTechnics(item.id)}>
                            <TableCell>{index + 1} </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.unp}</TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }
}

const mapStateToProps = (state) => {
    return { kolhoz: state.kolhoz };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setActiveFarm: (id) => {
            dispatch(SET_ACTIVE_FARM_ACTION(id));
        },
        getActiveTechnics: (arr) => {
            dispatch(GET_ACTIVE_TECHNICS_ACTION(arr));
        }
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Farms);
