import React, { Component } from "react";
import { connect } from 'react-redux';
import { Table, Container, Row, Col } from "react-bootstrap";


import RequestItem from './RequestItem';
import equipmentInRequestsSaga from "../../redux/sagas/DR_EquipmentInRequest.saga";

class RentalRequests extends Component {
  state = {
    requestStatus: "",
  };

  componentDidMount() {
    this.getRequests();
    this.getEquipmentInRequests();
  };

  getRequests = () => {
    this.props.dispatch({
      type: 'FETCH_REQUESTS',
    });
  };

  getEquipmentInRequests = () => {
    this.props.dispatch({
      type: 'FETCH_EQUIPMENT_IN_REQUESTS',
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {

    //console.log(this.props.requests);

    return (
      <Container>
        <Row>
          <Col className="text-center">
            <h1 id="form-header">Dental Rental Requests</h1>
          </Col>
        </Row>
        <br />
        <Table id="table-container" bordered hover>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Company</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Equipment</th>
              <th>Purpose</th>
              <th>Applied Date</th>
              <th>Requested Dates</th>
              <th>Application Status</th>
            </tr>
          </thead>

          <tbody>

            {this.props.requests !== undefined && this.props.requests.map((request) => {
              return (
                <RequestItem request={request} key={request.id} />
              )
            })}

          </tbody>
        </Table>
      </Container>
    );
  }
}

const mapStoreToProps = (reduxState) => {

  let requests = reduxState.rentalRequestsReducer;

  //console.log(reduxState.equipmentReducer);
  //need to get all equipment_items, transform the data into a string of equipment items
  if (reduxState.equipmentReducer && reduxState.rentalRequestsReducer) {
    const allRequestsObj = reduxState.equipmentReducer[0];
    //console.log(allRequestsObj);
    for (let key in allRequestsObj) {
      let arrEquipmentItems = allRequestsObj[key];
      let tempArr = [];

      //loop and grab every equipment item and put into an arr
      for (let item of arrEquipmentItems) {
        //console.log(item);
        tempArr.push(item.equipment_item);
      }

      let strListOfEquipmentItemsPerRequest = tempArr.join(', ');

      for (let requestObj of requests) {
        //console.log(requestObj.id, key);
        if (String(requestObj.id) === key) {
          //console.log('in here!')
          requestObj["equipment_in_request"] = strListOfEquipmentItemsPerRequest;
        }
      }
      //console.log(requests);
    }

  }

  return { requests }
};

export default connect(mapStoreToProps)(RentalRequests);