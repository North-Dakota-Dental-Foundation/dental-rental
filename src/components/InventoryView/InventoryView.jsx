import React, { Component } from "react";
import { connect } from "react-redux";

import { Modal } from "react-bootstrap";
import {
  Button,
  Table,
  Form,
  FormGroup,
  Spinner,
  Container,
  OverlayTrigger,
  OverlayTriggerProps,
  Tooltip,
  Alert,
} from "react-bootstrap";
import swal from "sweetalert";
import { Row, Col } from "react-bootstrap";
import "../App/App.css";
import axios from "axios";
import ThreeDots from "../ThreeDots/ThreeDots";
import Select from "react-select";

class InventoryView extends Component {
  state = {
    equipment_item: "",
    equipment_status: "",
    serial_number: "",
    nddf_code: "",
    changeStatus: "",
    isOpen: false,
    noteIsOpen: false,
    noteisOpenWithCurrentId: "",
    note: "",
    inventory: [],
    isEdit: false,
    itemToEdit: null,
    filterStatus: [{ label: `NONE`, value: "N/A" }],
    filterOptions: [
      { label: `NONE`, value: "N/A" },
      { value: 0, label: "AVAILABLE" },
      { value: 1, label: "CHECKED-OUT" },
      { value: 3, label: "IN-INSPECTION" },
      { value: 4, label: "MISSING" },
      { value: 2, label: "SHIPPED" },
      { value: 5, label: "RETIRED" },
    ],
    selectOptions: [
      { value: "AVAILABLE", label: "AVAILABLE" },
      { value: "CHECKED-OUT", label: "CHECKED-OUT" },
      { value: "IN-INSPECTION", label: "IN-INSPECTION" },
      { value: "MISSING", label: "MISSING" },
      { value: "SHIPPED", label: "SHIPPED" },
    ],
  };

  componentDidMount() {
    // this.props.dispatch({ type: 'LOADING' });
    this.props.dispatch({ type: 'FETCH_INVENTORY' }); // Fetch ALL inventory
    // this.props.dispatch({ type: "NOT_LOADING" });
  };

  //   componentDidUpdate(prevProps){
  //     if(prevProps.value !== this.props.value){ this.submit() }
  //  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps !== this.props) {
  //     console.log('Inventory has changed!');
  //   };
  // };

  handleNoteChange = (event) => {
    this.setState({
      ...this.state,
      note: event.target.value,
    });
  };

  submit = () => {
    console.log(`Applying filter number... ${this.state.filterStatus}`);

    if (this.state.filterStatus[0].value === "N/A") {
      this.props.dispatch({ type: 'FETCH_INVENTORY' });
    } else if (this.state.filterStatus[0].value !== "N/A") {
      this.props.dispatch({ type: 'FETCH_FILTERED_INVENTORY', payload: this.state.filterStatus[0].value });
    }
  };

  /*   getInventory = () => {
    this.props.dispatch({
      type: "FETCH_INVENTORY",
    });
  }; */

  // getInventory = () => {
  //   console.log("Getting entire inventory");
  //   axios
  //     .get("/api/inventory")
  //     .then((response) => {
  //       console.log(response.data);
  //       this.setState({
  //         inventory: response.data,
  //       });
  //       this.props.dispatch({ type: "NOT_LOADING" });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // getFilterInventory = () => {
  //   // Repopulates this.state.inventory with filtered data
  //   console.log("Filtering inventory...");
  //   axios
  //     .get(`/api/inventory/filterinv/${this.state.filterStatus[0].value}`) // GET request with selected filter
  //     .then((response) => {
  //       this.setState({
  //         // Sets this.state.inventory to new data
  //         inventory: response.data,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  editStatus = (valueObj, id) => {
    console.log(valueObj.value, id);
    this.props.dispatch({
      type: "EDIT_STATUS",
      payload: {
        equipment_status: valueObj.value,
        equipment_id: id,
      },
    });
    setTimeout(this.submit, 100); // Set timeout that runs "this.submit" hopefully after the item status has been updated // 1000 = 1 second
    this.props.dispatch({
      type: "EDIT_STATUS",
      payload: {
        equipment_status: valueObj.value,
        equipment_id: id,
      },
    });
    setTimeout(this.submit, 100); // Set timeout that runs "this.submit" hopefully after the item status has been updated // 1000 = 1 second
    this.props.dispatch({
      type: "EDIT_STATUS",
      payload: {
        equipment_status: valueObj.value,
        equipment_id: id,
      },
    });
    setTimeout(this.submit, 100); // Set timeout that runs "this.submit" hopefully after the item status has been updated // 1000 = 1 second
    this.props.dispatch({
      type: "EDIT_STATUS",
      payload: {
        equipment_status: valueObj.value,
        equipment_id: id,
      },
    });
    setTimeout(this.submit, 100); // Set timeout that runs "this.submit" hopefully after the item status has been updated // 1000 = 1 second
  };

  editNotes = () => {
    console.log(this.state.note);
    this.props.dispatch({
      type: "EDIT_NOTE",
      payload: {
        note: this.state.note,
        equipment_id: this.state.itemToEdit.id,
      },
    });
    swal({
      title: "Notes Updated Successfully",
      text: `Notes for this item successfully updated.`,
      icon: "success",
      buttons: true,
    });
    setTimeout(this.submit, 100);
  };

  deleteInventory = (inventoryId, objectIndex) => {
    // console.log(this.state.inventory);
    // console.log(objectIndex);
    // console.log(inventoryId);
    swal({
      title: `Are you sure you want to retire ${this.props.inventory[objectIndex].equipment_item}?`,
      text: "Once this item is retired, you will have to re-add it.",
      icon: "warning",
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`/api/inventory/${inventoryId}`)
          .then((response) => {
            console.log(response.data);
            swal(
              `${this.props.inventory[objectIndex].equipment_item} has been retired.`,
              {
                icon: "success",
              }
            );
            this.submit();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        swal(
          `${this.props.inventory[objectIndex].equipment_item} has NOT been retired.`
        );
      }
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    console.log(event.target.value);
  };

  handleFilterChange = (event) => {
    this.setState(
      {
        filterStatus: [event],
      },
      () => {
        this.submit();
      }
    );
  };

  //form submit to create new inventory item
  onSubmit = (event) => {
    event.preventDefault();
    this.closeModal();

    this.props.dispatch({
      type: "CREATE_ITEM",
      payload: this.state,
    });

    swal({
      title: "New Equipment Added To Inventory",
      text: `You have successfully added ${this.state.equipment_item} to your inventory.`,
      icon: "success",
    });
    axios
      .get("/api/inventory")
      .then((response) => {
        console.log(response.data);
        this.setState({
          inventory: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    this.setState({
      equipment_item: "",
      serial_number: "",
      nddf_code: "",
    });
  };

  //open and closing modals
  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });
  openNoteModal = (itemToEdit) =>
    this.setState({
      noteIsOpen: true,
      itemToEdit: itemToEdit,
      note: itemToEdit.note,
    });
  closeNoteModal = () => this.setState({ noteIsOpen: false, itemToEdit: null });

  render() {
    return (
      <>
        <br />
        <Col className="text-center">
          <h1 id="form-header">Inventory Management</h1>
        </Col>
        <Alert
          style={{ paddingLeft: "80px", paddingRight: "80px" }}
          variant="light"
        >
          <Row>
            <Col className="text-center">
              Browse through all of the inventory.
              <br />
              Add new equipment to the inventory and change or filter by the
              equipment status.
            </Col>
          </Row>
        </Alert>

        <Modal
          className="modal"
          show={this.state.isOpen}
          onHide={this.closeModal}
        >
          <Modal.Header className="modalHeader">
            <Modal.Title className="modalTitle">
              <div>
                <h4 className="modalTitle"> Add New Equipment </h4>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            {" "}
            <body>
              <form
                className="modalForm"
                style={{ backgroundColor: "white" }}
                onSubmit={this.onSubmit}
              >
                <div className="formDiv">
                  <h2>Add New Equipment</h2>
                  <p></p>
                  <Row>
                    <Col>
                      <Form.Group
                        onChange={(e) =>
                          this.setState({ equipment_item: e.target.value })
                        }
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label>Name of Equipment:</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          value={this.state.equipment_item}
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col>
                      {""}
                      <Form.Group
                        onChange={(e) =>
                          this.setState({ serial_number: e.target.value })
                        }
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label>Serial Number:</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          value={this.state.serial_number}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      {""}
                      <Form.Group
                        onChange={(e) =>
                          this.setState({ nddf_code: e.target.value })
                        }
                        controlId="exampleForm.ControlTextarea1a"
                      >
                        <Form.Label> NDDF Code:</Form.Label>
                        <Form.Control
                          placeholder=""
                          as="textarea"
                          rows={1}
                          value={this.state.nddf_code}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col>
                      <Button type="submit" variant="primary w-100 text-center">
                        Add Equipment To Inventory
                      </Button>
                    </Col>
                  </Row>
                </div>
              </form>
            </body>
          </Modal.Body>
          <Modal.Footer className="modalFooter">
            <Button
              className="footerButton"
              variant="secondary w-100 text-center"
              onClick={this.closeModal}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="modal"
          show={this.state.noteIsOpen}
          onHide={this.closeNoteModal}
        >
          <Modal.Header className="modalHeader">
            <Modal.Title
              className="modalTitle"
              style={{ justifyContent: "center" }}
            >
              Notes{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            {" "}
            <body>
              <form
                className="modalForm"
                style={{ backgroundColor: "white" }}
                onSubmit={this.editNotes}
              >
                <div className="formDiv">
                  <h2 style={{ textAlign: "center" }}>Edit Notes</h2>
                  <p></p>

                  <Row>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Notes for ${ }</Form.Label>
                        <Form.Control
                          onChange={(event) => {
                            console.log(event.target.value);
                          }}
                          as="textarea"
                          rows={3}
                        />
                      </Form.Group>{" "}
                      <br />
                      <br />
                      <Button type="submit" variant="primary w-100 text-center">
                        Save Changes
                      </Button>
                    </Col>
                  </Row>
                </div>
              </form>
            </body>
          </Modal.Body>
          <Modal.Footer className="modalFooter">
            <Button
              className="footerButton"
              variant="secondary w-100 text-center"
              onClick={this.closeNoteModal}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Container>
          {this.props.state.isLoadingReducer ? (
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
              <>
                <Row>
                  <Col xs={3} md={3} sm={3} lg={3} xl={3}>
                    <strong>Filter by Status:</strong> <br />
                    <Select
                      onChange={this.handleFilterChange}
                      className="basic-single"
                      classNamePrefix="select"
                      value={this.state.filterStatus}
                      name="filterStatus"
                      options={this.state.filterOptions}
                      placeholder="Filter by Status"
                    />
                  </Col>
                  <Col style={{ textAlign: "right", paddingTop: "25px" }}>
                    &nbsp; &nbsp;&nbsp;
                  {/* <OverlayTrigger
                      placement="top"
                      delay={{ show: 1000 }}
                      overlay={
                        <Tooltip id="button-tooltip-2">
                          Filter the inventory table by status.
                      </Tooltip>
                      }
                    >
                      {({ ref, ...triggerHandler }) => (
                        <Button
                          style={{ marginRight: "3px" }}
                          variant="primary"
                          ref={ref}
                          {...triggerHandler}
                          onClick={this.submit}
                        >
                           Refresh Table 
                        </Button>
                      )}
                    </OverlayTrigger> */}
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 1000 }}
                      overlay={
                        <Tooltip id="button-tooltip-2">
                          Add new equipment to your inventory.
                      </Tooltip>
                      }
                    >
                      {({ ref, ...triggerHandler }) => (
                        <Button
                          variant="primary"
                          ref={ref}
                          {...triggerHandler}
                          className="btn-primary"
                          onClick={this.openModal}
                          style={{ float: "right" }}
                        >
                          <span>Add New Equipment</span>
                        </Button>
                      )}
                    </OverlayTrigger>
                  </Col>
                </Row>
                <br />
                <Table id="table-container" bordered hover>
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Serial #</th>
                      <th>NDDF Code</th>
                      <th style={{ textAlign: "center", width: "16%" }}>
                        Status
                    </th>
                      <th style={{ textAlign: "center" }}>Notes</th>
                      <th style={{ textAlign: "center" }}>Retire</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.inventory.map((inventoryItem, index) => (
                      <tr>
                        <td style={{ verticalAlign: "middle" }}>
                          {inventoryItem.equipment_item}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {inventoryItem.serial_number}
                        </td>
                        <td style={{ verticalAlign: "middle" }}>
                          {inventoryItem.nddf_code}
                        </td>
                        <td
                          style={{ textAlign: "center", verticalAlign: "middle" }}
                        >
                          {inventoryItem.equipment_status === "RETIRED" ? (
                            <Select
                              className="basic-single"
                              classNamePrefix="select"
                              value={[
                                {
                                  label: `${inventoryItem.equipment_status}`,
                                  value: `${inventoryItem.equipment_status}`,
                                },
                              ]}
                              name="requestStatus"
                              options={this.state.selectOptions}
                              isDisabled
                            />
                          ) : (
                              <Select
                                onChange={(e) =>
                                  this.editStatus(e, inventoryItem.id)
                                }
                                className="basic-single"
                                classNamePrefix="select"
                                value={[
                                  {
                                    label: `${inventoryItem.equipment_status}`,
                                    value: `${inventoryItem.equipment_status}`,
                                  },
                                ]}
                                name="requestStatus"
                                options={this.state.selectOptions}
                              />
                            )}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          <Button
                            variant="primary"
                            className="btn-primary"
                            onClick={(event) => this.openNoteModal(inventoryItem)}
                          >
                            Notes{" "}
                          </Button>{" "}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {" "}
                          {inventoryItem.equipment_status === "RETIRED" ? (
                            <Button
                              className="deleteButton"
                              variant="danger"
                              style={{ textAlign: "center" }}
                              disabled
                            >
                              Retire Item
                            </Button>
                          ) : (
                              <Button
                                className="deleteButton"
                                variant="danger"
                                style={{ textAlign: "center" }}
                                onClick={() =>
                                  this.deleteInventory(inventoryItem.id, index)
                                }
                              >
                                Retire Item
                              </Button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
            )}
        </Container>
        <Modal
          className="modal"
          show={this.state.noteIsOpen}
          onHide={this.closeNoteModal}
        >
          <Modal.Header className="modalHeader">
            <Modal.Title
              className="modalTitle"
              style={{ justifyContent: "center" }}
            >
              Notes
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <form
              className="modalForm"
              style={{ backgroundColor: "white" }}
              onSubmit={(this.handleNote, this.closeNoteModal)}
            >
              <div className="formDiv">
                <p></p>
                <Row>
                  <Col>
                    <Form.Group
                      onChange={(event) => this.handleNoteChange(event, "note")}
                      controlId="exampleForm.ControlTextarea1a"
                    >
                      <Form.Label>
                        {" "}
                        <h2 style={{ textAlign: "center" }}>Update Notes</h2>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={this.state.note}
                      />
                    </Form.Group>
                    <br />
                    <br />
                    <Button
                      type="submit"
                      variant="primary w-100 text-center"
                      onClick={this.editNotes}
                    >
                      Save Changes
                    </Button>
                  </Col>
                </Row>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="modalFooter">
            <Button
              className="footerButton"
              variant="secondary w-100 text-center"
              onClick={this.closeNoteModal}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  state: state,
  inventory: state.inventoryReducer.inventory,
});
export default connect(mapStateToProps)(InventoryView);
