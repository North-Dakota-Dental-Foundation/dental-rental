import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";
import swal from "sweetalert";
import { Row, Col } from "react-bootstrap";
import "../App/App.css";

class InventoryView extends Component {
  state = {
    equipment: "",
    equipmentStatus: "",
    serialNumber: "",
    nddfCode: "",
    filterStatus: "",
    changeStatus: "",
    isOpen: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  //form submit to create new inventory item
  onSubmit = (event) => {
    event.preventDefault();
    this.closeModal();

    /*     this.props.dispatch({
      type: "CREATE_ITEM",
      payload: this.state,
    }); */

    swal({
      title: "New Equipment Added To Inventory",
      text: `You have successfully added ${this.state.equipment}to your inventory.`,
      icon: "success",
      buttons: true,
    });

    this.setState({
      equipment: "",
      equipmentStatus: "",
      serialNumber: "",
      nddfCode: "",
    });
  };

  //open and closing modals
  openModal = () => this.setState({ isOpen: true });
  closeModal = () => this.setState({ isOpen: false });

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
                          this.setState({ equipment: e.target.value })
                        }
                        value={this.state.equipment}
                        required
                      />
                    </Col>
                    <Col>
                      {""}
                      Serial Number:
                      <input
                        onChange={(e) =>
                          this.setState({ serialNumber: e.target.value })
                        }
                        value={this.state.serialNumber}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      NDDF Code:
                      <input
                        onChange={(e) =>
                          this.setState({ nddfCode: e.target.value })
                        }
                        value={this.state.nddfCode}
                        required
                      />{" "}
                    </Col>
                    <Col>
                      Equipment Status:{" "}
                      <select
                        onChange={(e) =>
                          this.setState({ equipmentStatus: e.target.value })
                        }
                        value={this.state.equipmentStatus}
                        required
                      >
                        <option value={"Available"}>Available</option>
                        <option value={"Checked-Out"}>Checked Out</option>
                        <option value={"Shipped"}>Shipped</option>
                        <option value={"In Inspection"}>In Inspection</option>
                        <option value={"Missing"}>Missing</option>
                      </select>
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

        <table>
          <tr>
            <th>Equipment</th>
            <th>Serial #</th>
            <th>NDDF Code</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Delete Equipment</th>
          </tr>

          <tr>
            <td>Chaos Emerald</td>
            <td>1234567</td>
            <td>CHAOSCONTROL2</td>
            <td>
              <select name="changeStatus">
                <option>Available</option>
                <option>Checked-Out</option>
                <option>Shipped</option>
                <option>In Inspection</option>
                <option>Missing</option>
              </select>
            </td>
            <td>
              <button>Add Note</button>
            </td>
            <td>
              <button>Delete Item</button>
            </td>
          </tr>
        </table>
      </>
    );
  }
}

export default InventoryView;
