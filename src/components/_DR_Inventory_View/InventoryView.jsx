import React, { Component } from "react";
import { connect } from "react-redux";

import { Modal } from "react-bootstrap";
import { Button, Table, Form, FormGroup } from "react-bootstrap";
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
    filterStatus: "",
    changeStatus: "",
    isOpen: false,
    noteIsOpen: false,
    noteisOpenWithCurrentId: "",
    note: "",
    inventory: [],
    isEdit: false,
    itemToEdit: null,
  };

  componentDidMount() {
    this.getInventory();
  }

  handleNoteChange = (event) => {
    this.setState({
      ...this.state,
      note: event.target.value,
    });
  };

  getInventory = () => {
    console.log("In getInventory");
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

  editStatus = (id, value) => {
    console.log(id);
    this.props.dispatch({
      type: "EDIT_STATUS",
      payload: {
        equipment_status: value,
        equipment_id: id,
      },
    });
    this.getInventory();
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
    this.getInventory();

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
            this.getInventory();
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
      text: `You have successfully added ${this.state.equipment_item}to your inventory.`,
      icon: "success",
      buttons: true,
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

    this.getInventory();
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
        <h1 style={{ textAlign: "center" }}>Inventory View</h1>

        <br />

        <select name="filterStatus">
          <option>Available</option>
          <option>Checked-Out</option>
          <option>Shipped</option>
          <option>In Inspection</option>
          <option>Missing</option>
        </select>

        <Button
          variant="primary"
          className="btn-primary"
          onClick={this.openModal}
        >
          Add New Equipment{" "}
        </Button>

        <Modal
          className="modal"
          show={this.state.isOpen}
          onHide={this.closeModal}
        >
          <Modal.Header className="modalHeader" closeButton>
            <Modal.Title
              className="modalTitle"
              style={{ justifyContent: "center" }}
            >
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
                      Equipment Name:
                      <input
                        onChange={(e) =>
                          this.setState({ equipment_item: e.target.value })
                        }
                        value={this.state.equipment_item}
                        required
                      />
                    </Col>
                    <Col>
                      {""}
                      Serial Number:
                      <input
                        onChange={(e) =>
                          this.setState({ serial_number: e.target.value })
                        }
                        value={this.state.serial_number}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      NDDF Code:
                      <input
                        onChange={(e) =>
                          this.setState({ nddf_code: e.target.value })
                        }
                        value={this.state.nddf_code}
                        required
                      />{" "}
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

        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Serial #</th>
              <th>NDDF Code</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Delete Equipment</th>
            </tr>
          </thead>
          <tbody>
            {this.state.inventory.map((inventoryItem, index) => (
              <tr>
                <td>{inventoryItem.equipment_item}</td>
                <td>{inventoryItem.serial_number}</td>
                <td>{inventoryItem.nddf_code}</td>
                <td>
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
                    <option value={"In Inspection"}>IN INSPECTION</option>
                    <option value={"Missing"}>MISSING</option>
                  </select>
                </td>

                <td>
                  {" "}
                  <Button
                    variant="primary"
                    className="btn-primary"
                    onClick={(event) => this.openNoteModal(inventoryItem)}
                  >
                    Notes{" "}
                  </Button>{" "}
                </td>
                <td>
                  {" "}
                  <Button
                    variant="danger"
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
                <h2 style={{ textAlign: "center" }}>Edit Notes</h2>
                <p></p>
                <Row>
                  <Col>
                    <Form.Group
                      onChange={(event) => this.handleNoteChange(event, "note")}
                      controlId="exampleForm.ControlTextarea1a"
                    >
                      <Form.Label>Update Notes</Form.Label>
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
