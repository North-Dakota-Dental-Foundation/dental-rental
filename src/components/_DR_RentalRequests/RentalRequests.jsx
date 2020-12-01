import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Container, Row, Col } from "react-bootstrap";

import RequestItem from "./RequestItem";
import equipmentInRequestsSaga from "../../redux/sagas/DR_EquipmentInRequest.saga"; //TODO: REMOVE!
import ThreeDots from "../_DR_ThreeDots/ThreeDots";

class RentalRequests extends Component {
  state = {
    requestFilterStatus: 'NONE',
  }

  componentDidMount() {
    this.props.dispatch({ type: "LOADING" });
    this.getRequests();
    this.getEquipmentInRequests();
  }

  getRequests = () => {

    if (this.state.requestFilterStatus === 'NONE') { // If filter = NONE, run "FETCH_REQUESTS"
      this.props.dispatch({
        type: 'FETCH_REQUESTS',
      });
    };

    if (this.state.requestFilterStatus !== 'NONE') { // If filter != NONE, run "FETCH FILTERED_REQUESTS"
      this.props.dispatch({
        type: 'FETCH_FILTERED_REQUESTS',
        payload: this.state.requestFilterStatus,
      });
    };
  };

  getEquipmentInRequests = () => {
    this.props.dispatch({
      type: "FETCH_EQUIPMENT_IN_REQUESTS",
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFilterChange = (event) => { // For specifically handling the filter dropdown 
    this.setState({
      requestFilterStatus: event.target.value,
    }, () => { this.getRequests() });
  };

  render() {
    //console.log(this.props.requests);

    return (
      <>


        <select onChange={this.handleFilterChange} name="filterStatus">
          <option value={'NONE'}>NO FILTER</option>
          <option value={'PENDING'}>PENDING</option>
          <option value={'APPROVED'}>APPROVED</option>
          <option value={'REJECTED'}>REJECTED</option>
        </select>
        <br />

        <Container id="table-col-increase-padding" fluid>
          <Row>
            <Col className="text-center">
              <h1 id="form-header">Dental Rental Requests</h1>
            </Col>
          </Row>
          <br />

          {this.props.isLoading ? (

            <>
              <br />
              <br />
              <Row>
                <Col className="text-center">
                  <ThreeDots />
                </Col>
              </Row>
            </>
          ) : (
            <Table id="table-container" bordered hover responsive>
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Practice/Company</th>
                  <th style={{ width: "15%" }}>Address</th>
                  <th>Phone Number</th>
                  <th>Equipment</th>
                  <th style={{ width: "5%" }}>Purpose</th>
                  <th style={{ width: "5%" }}>Applied Date</th>
                  <th style={{ width: "5%" }}>Requested Dates</th>
                  <th>Application Status</th>
                </tr>
              </thead>

              <tbody>
                {this.props.requests !== undefined && this.props.requests.map((request) => {
                  return (
                    <RequestItem request={request} key={request.id} getRequests={this.getRequests} getEquipmentInRequests={this.getEquipmentInRequests} />
                  )
                })}

              </tbody>
            </Table>
          }
        </Container >

      </>
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

      let strListOfEquipmentItemsPerRequest = tempArr.join(", ");

      for (let requestObj of requests) {
        //console.log(requestObj.id, key);
        if (String(requestObj.id) === key) {
          //console.log('in here!')
          requestObj[
            "equipment_in_request"
          ] = strListOfEquipmentItemsPerRequest;
        }
      }
      //console.log(requests);
    }

    //IMPLEMENT THIS ALGORITHM!
    //for loop through [{id:x, equipment:'y'}, {id:x, equipment:'z'}] to transform data to {x: 'y, z'}
    //for loop through request array [{request1}, {request2}]
    // --> for each request, use id to get values in the object in step 1 and put into current request object with the key value "equipment_in_request"
  }

  return { requests, isLoading: reduxState.isLoadingReducer };
};

export default connect(mapStoreToProps)(RentalRequests);
