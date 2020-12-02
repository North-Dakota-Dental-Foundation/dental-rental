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

    filterStatus: "N/A",
  };

  // TODO: If "filterStatus" equals "N/A", run "filterInv();"

  componentDidMount() {
    this.getInventory();
  };

  handleNoteChange = (event) => {
    this.setState({
      ...this.state,
      note: event.target.value,
    });
  };

  submit = () => {
    console.log(`Applying filter number... ${this.state.filterStatus}`);

    // this.setState({
    //   inventory: [],
    // });

    if (this.state.filterStatus === "N/A") {
      this.getInventory();
    } else if (this.state.filterStatus !== "N/A") {
      this.getFilterInventory();
    }
  };

  getInventory = () => {
    console.log("Getting entire inventory");
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
  };

  getFilterInventory = () => {
    // Repopulates this.state.inventory with filtered data
    console.log("Filtering inventory...");
    axios
      .get(`/api/inventory/filterinv/${this.state.filterStatus}`) // GET request with selected filter
      .then((response) => {
        this.setState({
          // Sets this.state.inventory to new data
          inventory: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  editStatus = (id, value) => {
    console.log(id);
    this.props.dispatch({
      type: "EDIT_STATUS",
      payload: {
        equipment_status: value,
        equipment_id: id,
      },
    });
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
    /*     this.getInventory(); // TODO: Move this to your EDIT_NOTE saga due to async delays
     */
  };

  deleteInventory = (inventoryId, objectIndex) => {
    console.log(this.state.inventory);
    console.log(objectIndex);

    swal({
      title: `Are you sure you want to delete ${this.state.inventory[objectIndex].equipment_item}?`,
      text: "Once this item is deleted, you will have to re-add it.",
      icon: "warning",
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`/api/inventory/${inventoryId}`)
          .then((response) => {
            console.log(response.data);
            swal(
              `${this.state.inventory[objectIndex].equipment_item} has been deleted.`,
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
          `${this.state.inventory[objectIndex].equipment_item} has NOT been deleted.`
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
    console.log(
      `Handle filter change ${event.target.name} ${event.target.value}`
    );
    this.setState(
      {
        [event.target.name]: event.target.value,
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
        <br />

        <Alert style={{ paddingLeft: "80px", paddingRight: "80px" }} variant="light">
          <Row>
            <Col className="text-center">
              Browse through all of the inventory.
                <br />
                Add new equipment to the inventory, and change/filter by the equipment status.
            </Col>
          </Row>
        </Alert>

        <Modal
          className="modal"
          show={this.state.isOpen}
          onHide={this.closeModal}
        >
          <Modal.Header className="modalHeader" closeButton>
            <Modal.Title className="modalTitle" style={{ textAlign: "center" }}>
              Add New Equipment{" "}
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
        <br />
        <br />

        <Modal
          className="modal"
          show={this.state.noteIsOpen}
          onHide={this.closeNoteModal}
        >
          <Modal.Header className="modalHeader" closeButton>
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

          <strong>App Status Filter:</strong> <br />
          <select onChange={this.handleFilterChange} name="filterStatus">
            <option value='N/A'>NO FILTER</option>
            <option value={0}>AVAILABLE</option>
            <option value={1}>CHECKED-OUT</option>
            <option value={2}>SHIPPED</option>
            <option value={3}>IN-INSPECTION</option>
            <option value={4}>MISSING</option>
          </select>

          &nbsp; &nbsp;&nbsp;
          <OverlayTrigger
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
                variant="primary"
                ref={ref}
                {...triggerHandler}
                onClick={this.submit}
              >
                Refresh Table
              </Button>
            )}
          </OverlayTrigger>
          <br />
          <br />
          <Table id="table-container" bordered hover>
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Serial #</th>
                <th>NDDF Code</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "center" }}>Notes</th>
                <th style={{ textAlign: "center" }}>Delete Equipment</th>
              </tr>
            </thead>
            <tbody>
              {this.state.inventory.map((inventoryItem, index) => (
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
                  <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                    <select
                      onChange={(event) =>
                        this.editStatus(inventoryItem.id, event.target.value)
                      }
                      name="changeStatus"
                    >
                      <option>{inventoryItem.equipment_status}</option>

                      <option value={"Available"}>AVAILABLE</option>
                      <option value={"Checked-Out"}>CHECKED-OUT</option>
                      <option value={"Shipped"}>SHIPPED</option>
                      <option value={"In-Inspection"}>IN-INSPECTION</option>
                      <option value={"Missing"}>MISSING</option>
                    </select>
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
                    <Button
                      className="deleteButton"
                      variant="danger"
                      style={{ textAlign: "center" }}
                      onClick={() =>
                        this.deleteInventory(inventoryItem.id, index)
                      }
                    >
                      Delete Item
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
        <Modal
          className="modal"
          show={this.state.noteIsOpen}
          onHide={this.closeNoteModal}
        >
          <Modal.Header className="modalHeader" closeButton>
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
  equipment: state.inventoryReducer.equipment,
});
export default connect(mapStateToProps)(InventoryView);
