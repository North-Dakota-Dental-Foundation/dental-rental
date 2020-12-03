import React, { Component } from "react";
import { connect } from "react-redux";
import { Alert, Table, Container, Row, Col } from "react-bootstrap";
import RequestItem from "./RequestItem";
import equipmentInRequestsSaga from "../../redux/sagas/DR_EquipmentInRequest.saga"; //TODO: REMOVE!
import ThreeDots from "../_DR_ThreeDots/ThreeDots";
import Select from 'react-select';
import "./RentalRequest.css"


class RentalRequests extends Component {
  state = {
    numberOfPendingRequests: 0,
    noFilterOption: [{ value: 'NONE', label: 'NONE' }],
    currentFilterOptions: [{ value: 'APPROVED', label: 'APPROVED' }, { value: 'ACTIVE', label: 'ACTIVE' }, { value: 'PENDING', label: 'PENDING' }],
    requestFilterStatus: [{ label: `NONE`, value: `NONE` }], //This will be an array of objects [{value: x, label: "y"}]. This is necessary for react-select
    archivedFilterOptions: [{ value: 'PROCESSED', label: 'PROCESSED' }, { value: 'REJECTED', label: 'REJECTED' }],
  }

  componentDidMount() {
    this.props.dispatch({ type: "LOADING" }); //activates spinner effect
    this.getEquipmentInRequests();
    this.getRequests();

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

  getNumberOfRequestsByStatus = (strStatus) => {
    return this.props.requests.filter(requestObj => {
      return requestObj.status === strStatus;
    }).length;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <>
        <br />
        <Container className="mb-5" id="table-col-increase-padding" fluid>
          <Row>
            <Col className="text-center">
              <h1 id="form-header">Dental Rental Requests</h1>
            </Col>
          </Row>

          <Alert style={{ paddingLeft: "80px", paddingRight: "80px" }} variant="light">
            <Row>
              <Col className="text-center">
                Browse through all clients equipment requests.
                <br />
                Change, and filter by the request status.
            </Col>
            </Row>
          </Alert>

          <Row>
            <Col xs={3} md={3} sm={3} lg={3} xl={3}>
              <strong>Filter by Status:</strong>
              <Select
                onChange={this.handleFilterChange}
                className="basic-single"
                classNamePrefix="select"
                value={this.state.requestFilterStatus}
                name="requestFilterStatus"
                options={[{ label: '', options: this.state.noFilterOption }, { label: `Current`, options: this.state.currentFilterOptions }, { label: `Archived`, options: this.state.archivedFilterOptions }]}
                placeholder="Filter by Status"
              />
            </Col>
            <Col> {/*This extra column allows for right alignment*/}
            </Col>

            {/* if the number of PENDING is greater than 0 AND if the filter is set to a CERTAIN STATUS, then show the alert */}
            {this.getNumberOfRequestsByStatus('PENDING') > 0 && (this.state.requestFilterStatus[0].value === 'PENDING' || this.state.requestFilterStatus[0].value === 'NONE') &&
              <Col md="auto" xs="auto" sm="auto" lg="auto" xl="auto">
                <Alert variant="danger">
                  <strong>Current Number of Pending Requests: {this.getNumberOfRequestsByStatus('PENDING')}</strong> {/*length of this array corresponds to the number of requests*/}
                </Alert>
              </Col>
            }
            {this.getNumberOfRequestsByStatus(this.state.requestFilterStatus[0].value) > 0 && (this.state.requestFilterStatus[0].value === 'APPROVED' || this.state.requestFilterStatus[0].value === 'ACTIVE') &&
              <Col md="auto" xs="auto" sm="auto" lg="auto" xl="auto">
                <Alert variant="success">
                  <strong>{`Total Number of ${this.capitalizeFirstLetter(this.state.requestFilterStatus[0].value.toLowerCase())} Requests: `}{this.getNumberOfRequestsByStatus(this.state.requestFilterStatus[0].value)}</strong>
                </Alert>
              </Col>
            }
            {this.getNumberOfRequestsByStatus(this.state.requestFilterStatus[0].value) > 0 && (this.state.requestFilterStatus[0].value === 'REJECTED' || this.state.requestFilterStatus[0].value === 'PROCESSED') &&
              <Col md="auto" xs="auto" sm="auto" lg="auto" xl="auto">
                <Alert variant="dark">
                  <strong>{`Total Number of ${this.capitalizeFirstLetter(this.state.requestFilterStatus[0].value.toLowerCase())} Requests: `}{this.getNumberOfRequestsByStatus(this.state.requestFilterStatus[0].value)}</strong>
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
            <Table className="mb-5" id="table-container" bordered hover responsive>
              <thead>
                <tr>
                  <th > Contact</th>
                  <th>Practice/Company</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Equipment</th>
                  <th>Purpose</th>
                  <th>Applied Date</th>
                  <th>Requested Dates</th>
                  <th style={{ width: "15%" }}>Application Status</th>
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
  let requests_2;
  let equipmentInRequests = reduxState.equipmentReducer;

  //console.log(reduxState.equipmentReducer);
  //need to get all equipment_items, transform the data into a string of equipment items
  if (reduxState.equipmentReducer && reduxState.rentalRequestsReducer) {

    // ##################### 
    // UNCOMMENT IF GOING BACK TO OLD WAY!

    // const allRequestsObj = reduxState.equipmentReducer[0];
    // //console.log(allRequestsObj);
    // for (let key in allRequestsObj) {
    //   let arrEquipmentItems = allRequestsObj[key];
    //   let tempArr = [];

    //   //loop and grab every equipment item and put into an arr
    //   for (let item of arrEquipmentItems) {
    //     //console.log(item);
    //     tempArr.push(item.equipment_item);
    //   }

    //   let strListOfEquipmentItemsPerRequest = tempArr.join(", ");

    //   for (let requestObj of requests) {
    //     //console.log(requestObj.id, key);
    //     if (String(requestObj.id) === key) {
    //       //console.log('in here!')
    //       requestObj[
    //         "equipment_in_request"
    //       ] = strListOfEquipmentItemsPerRequest;
    //     }
    //   }
    // }
    // #####################
    // console.log(requests);
    // console.log(equipmentInRequests);

    //create an temporary obj with key of each request's id and with a value of a string of equipment in particular request
    let tempObj = {};
    equipmentInRequests.map((obj) => {
      console.log(typeof obj.id);
      //if the obj.id is NOT a key in the tempObj, this is a new request. Insert initial content
      if (!tempObj.hasOwnProperty(obj.id)) {
        tempObj[obj.id] = obj.equipment_item;
      }
      //Else, the id already exists in the obj, add the new equipment item to the existing string of equipment items
      else {
        tempObj[obj.id] = tempObj[obj.id].concat(`, ${obj.equipment_item}`);
      }
    });
    // loop through request array [{request1}, {request2}]
    // for each request, use id to get values in the object in step 1 and put into current request object with the key value "equipment_in_request"
    requests_2 = requests.map((requestObj) => {
      requestObj.equipment_in_request = tempObj[requestObj.id];
      return requestObj;
    });
  } // end of if
  requests = requests_2;
  return { requests, isLoading: reduxState.isLoadingReducer };
};

export default connect(mapStoreToProps)(RentalRequests);
