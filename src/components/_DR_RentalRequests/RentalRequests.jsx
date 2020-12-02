import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert, Table, Container, Row, Col } from "react-bootstrap";
import RequestItem from "./RequestItem";
import equipmentInRequestsSaga from "../../redux/sagas/DR_EquipmentInRequest.saga"; //TODO: REMOVE!
import ThreeDots from "../_DR_ThreeDots/ThreeDots";
import Select from 'react-select';


class RentalRequests extends Component {
  state = {
    filterOptions: [{ value: 'NONE', label: 'NONE' }, { value: 'PENDING', label: 'PENDING' }, { value: 'APPROVED', label: 'APPROVED' },
    { value: 'REJECTED', label: 'REJECTED' }, { value: 'ACTIVE', label: 'ACTIVE' }, { value: 'PROCESSED', label: 'PROCESSED' }],
    requestFilterStatus: [{ label: `NONE`, value: `NONE` }] //This will be an array of objects [{value: x, label: "y"}]. This is necessary for react-select
  }

  componentDidMount() {
    this.props.dispatch({ type: "LOADING" }); //activates spinner effect
    this.getRequests();
    this.getEquipmentInRequests();
  }

  getRequests = () => {

    if (this.state.requestFilterStatus[0].value === 'NONE') { // If filter = NONE, run "FETCH_REQUESTS"
      this.props.dispatch({
        type: 'FETCH_REQUESTS',
      });
    };

    if (this.state.requestFilterStatus[0].value !== 'NONE') { // If filter != NONE, run "FETCH FILTERED_REQUESTS"
      this.props.dispatch({
        type: 'FETCH_FILTERED_REQUESTS',
        payload: this.state.requestFilterStatus[0].value,
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
      requestFilterStatus: [event],
    }, () => { this.getRequests() });
  };

  getNumberOfPendingRequests = () => {
    return this.props.requests.filter(requestObj => {
      return requestObj.status === 'PENDING';
    }).length;
  }

  render() {
    console.log(this.props.requests);
    console.log(this.state.requestFilterStatus);
    return (
      <>
        <br />
        <Container id="table-col-increase-padding" fluid>
          <Row>
            <Col className="text-center">
              <h1 id="form-header">Dental Rental Requests</h1>
              <br />
            </Col>
          </Row>
          <Row>
            <Col xs={3} md={3} sm={3} lg={3} xl={3}>
              Status Filter Applied:
              <Select
                onChange={this.handleFilterChange}
                className="basic-single"
                classNamePrefix="select"
                value={this.state.requestFilterStatus}
                name="requestFilterStatus"
                options={this.state.filterOptions}
                placeholder="Filter by Status"
              />
            </Col>
            <Col> {/*This extra column allows for right alignment*/}
            </Col>
            {/* if the number of PENDING is greater than 0 AND if the filter is set to PENDING or NONE, then show the alert */}
            {this.props.requests.length > 0 && (this.state.requestFilterStatus[0].value === 'PENDING' || this.state.requestFilterStatus[0].value === 'NONE') &&
              <Col md="auto" xs="auto" sm="auto" lg="auto" xl="auto">
                <Alert variant="danger">
                  Current Number of Pending Requests: {this.getNumberOfPendingRequests()} {/*length of this array corresponds to the number of requests*/}
                </Alert>
              </Col>
            }
          </Row>
          <br />
          {this.props.isLoading ?

            <>
              <br />
              <br />
              <Row>
                <Col className="text-center">
                  <ThreeDots />
                </Col>
              </Row>
            </>
            :
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
