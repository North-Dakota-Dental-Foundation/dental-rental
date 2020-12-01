import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SubmissionForm.css"
import axios from 'axios';
import Select from 'react-select';
import { Form, Button, Modal, Container, Row, Col, Alert } from "react-bootstrap";
import makeAnimated from 'react-select/animated';


const animatedComponents = makeAnimated();

class SubmissionForm extends Component {
  state = {
    pointOfContact: "",
    city: "",
    phoneNumber: "", //TODO: NEEDS TO BE NUMBER
    practiceCompany: "",
    address: "",
    address_2: "",
    purposeForRequest: "",
    startDate: new Date(),
    endDate: new Date(),
    availableEquipment: [], //an arr containing all equipment that is available for a given date range
    arrOptions: [], //an arr that holds all available equipment that is valid for the react-select dropdown menu
    currentlySelectedEquipment: "", //will be an array of equipment objects that have been selected by the user
    state: "",
    zip: "",
    email: "",
    show: false,
    formSubmissionSuccess: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!(this.state.currentlySelectedEquipment)) {
      alert("Error: you cannot submit a form without selected equipment.");
      return;
    }

    //concatenate address 1 & address 2 if address 2 field is filled out
    let address = this.state.address;
    if (this.state.address_2) {
      address = this.state.address.concat(" " + this.state.address_2);
    }

    //remove hyphens from this.state.phoneNumber for database storage constraints
    let phoneNumber = this.state.phoneNumber;
    let arrPhoneNumbers = this.state.phoneNumber.split("-");
    phoneNumber = arrPhoneNumbers.join('');

    axios
      .post("/api/requests/", {
        company: this.state.practiceCompany,
        address: address,
        point_of_contact: this.state.pointOfContact,
        email: this.state.email,
        phone_number: phoneNumber,
        city: this.state.city,
        state: this.state.state,
        zip: this.state.zip,
        start_date: this.state.startDate,
        end_date: this.state.endDate,
        applied_date: new Date(),
        purpose: this.state.purposeForRequest,
        equipment_in_request: this.state.currentlySelectedEquipment,

      })
      .then(() => {
        this.setState({
          formSubmissionSuccess: true,
          show: true,
          pointOfContact: "",
          city: "",
          phoneNumber: "",
          practiceCompany: "",
          address: "",
          address_2: "",
          purposeForRequest: "",
          availableEquipment: [], //an arr containing all equipment that is available for a given date range
          arrOptions: [], //an arr that holds all available equipment that is valid for the react-select dropdown menu
          currentlySelectedEquipment: "", //will be an array of equipment objects that have been selected by the user
          state: "",
          zip: "",
          email: "",
        });
        console.log('Post successful.');
      })
      .catch((err) => {
        console.log(err)
        this.setState({ formSubmissionSuccess: false, show: true });
      });

  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSelect = (arrOfSelectedEquipment) => {
    this.setState({ currentlySelectedEquipment: arrOfSelectedEquipment })
  };

  handleDateChange = (dateParam, date) => {
    const currentDate = new Date();
    if (dateParam === "startDate" && date <= this.state.endDate && date >= currentDate) { // if we are editing the startDate, check that the date variable is less than or equal to the endDate
      this.setState({ startDate: date });
      this.fetchAvailableEquipment(date, this.state.endDate); //due to asynchonous nature of setting state
      this.setState({ currentlySelectedEquipment: "" }); // if the user decides to change the date, we need to remove the currently selected equipment bc it is no longer valid!
    }
    else if (dateParam === "endDate" && date >= this.state.startDate && date >= currentDate) { // if we are editing the endDate, check that the date variable is greater than the startDate
      this.setState({ endDate: date });
      this.fetchAvailableEquipment(this.state.startDate, date); //due to asynchonous nature of setting state
      this.setState({ currentlySelectedEquipment: "" }); // if the user decides to change the date, we need to remove the currently selected equipment bc it is no longer valid!
    }

  };

  fetchAvailableEquipment = (startDate, endDate) => {
    axios
      .post("/api/inventory/all-inventory-by-date-range/", {
        startDate,
        endDate
      })
      .then((res) => {
        this.setState({ availableEquipment: res.data });
        const options = res.data.map((equipmentObj) => {
          return { value: equipmentObj.id, label: equipmentObj.equipment_item, ...equipmentObj } //value allows us to select the correct equipment by using its id
        }); //value and label are keys that are required for the react-select dropdown menu
        this.setState({ arrOptions: options }); //arrOptions needed for React-Select's Select tag
      })
      .catch((err) => console.log(err));
  };

  //bootstrap modal opening/closing handlers
  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  render() {
    return (
      <Container>
        {/* <Button onClick={this.handleShow}>Show Modal</Button>
        <Button onClick={() => this.setState({ formSubmissionSuccess: true })}>Form success</Button> */}
        <Form id="form-container" onSubmit={this.handleSubmit}>
          <Row>
            <Col className="text-center">
              <h1 id="form-header">Dental Rental Request Form</h1>
            </Col>
          </Row>
          <Alert variant="light">
            <Row>
              <Col className="text-center">
                Ready to contribute to those in need of dental care?
            </Col>
            </Row>
            <Row>
              <Col className="text-center">
                Please begin by filling out this rental request form by giving your contact and practice/organization information,
            </Col>
            </Row>
            <Row>
              <Col className="text-center">
                purpose for request, dates to rent equipment, and the equipment items you wish to rent for the given date range.
            </Col>
            </Row>
          </Alert>
          <br />
          <Form.Group controlId="formBasicInfo">
            <Row>
              <Col>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="pointOfContact"
                  value={this.state.pointOfContact}
                  onChange={this.handleChange}
                  required placeholder="Your Name" />
              </Col>
              <Col>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  placeholder="###-###-####"
                  value={this.state.phoneNumber}
                  onChange={this.handleChange}
                  required
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                />
              </Col>
              <Col>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  placeholder="Your Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Form.Label>Practice/Company</Form.Label>
            <Form.Control
              type="text"
              name="practiceCompany"
              placeholder="Your Dental Practice/Organization"
              value={this.state.practiceCompany}
              onChange={this.handleChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  placeholder="1234 Main St."
                  value={this.state.address}
                  onChange={this.handleChange}
                  required
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Address 2</Form.Label>
                <Form.Control
                  type="text"
                  name="address_2"
                  placeholder="Apartment, studio, floor, etc."
                  value={this.state.address_2}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="City"
                  value={this.state.city}
                  onChange={this.handleChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State"
                  value={this.state.state}
                  onChange={this.handleChange}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Zip</Form.Label>
                <Form.Control
                  type="number"
                  name="zip"
                  placeholder="Zip"
                  value={this.state.zip}
                  onChange={this.handleChange}
                  required
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Dental Rental Purpose</Form.Label>
                <Form.Control
                  type="text"
                  name="purposeForRequest"
                  placeholder="Ex: Improve dental health of community."
                  value={this.state.purposeForRequest}
                  onChange={this.handleChange}
                  required
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Start Date</Form.Label>
                <DatePicker className="form-control" wrapperClassName="form-control" required selected={this.state.startDate} onChange={(date) => this.handleDateChange("startDate", date)} />
              </Col>
              <Col>
                <Form.Label>End Date</Form.Label>
                <DatePicker className="form-control" wrapperClassName="form-control" required selected={this.state.endDate} onChange={(date) => this.handleDateChange("endDate", date)} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col>
                <Form.Label>Select Dental Rental Equipment</Form.Label>
                <Select
                  components={animatedComponents}
                  noOptionsMessage={() => "No available equipment for the given date range."}
                  isMulti
                  placeholder="Select one or many pieces of equipment for the given date range."
                  name="available-equipment"
                  options={this.state.arrOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={this.handleSelect}
                  value={this.state.currentlySelectedEquipment || ""} //this allows for validating date changes
                />
              </Col>
            </Row>
          </Form.Group>
          <br />
          <Button size="lg" variant="primary" type="submit">Submit Request</Button>
        </Form>
        {/* Modal rendering when form submitted */}
        {
          this.state.formSubmissionSuccess ? <Modal
            show={this.state.show}
            onHide={this.handleClose}
            backdrop="static"
            keyboard={false}
            centered
          >
            <Modal.Header className="d-block">
              <Modal.Title className="text-center">Successful Form Submission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Thank you for submitting your Dental Rental request!
              <br />
              We will review your request and get back to you promptly.
              <br />
              <Button variant="link" href="https://nddental.org">Back to the ND Dental Foundation homepage.</Button>
            </Modal.Body>
          </Modal> :
            <Modal
              show={this.state.show}
              onHide={this.handleClose}
              backdrop="static"
              keyboard={false}
              centered
            >
              <Modal.Header className="d-block">
                <Modal.Title className="text-center">Form Submission Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Sorry - something went wrong!
                 <br />
                <Button variant="link" href="https://nddental.org">Back to the ND Dental Foundation homepage.</Button>
              </Modal.Body>
            </Modal>
        }
      </Container >
    );
  }
}

export default SubmissionForm;
