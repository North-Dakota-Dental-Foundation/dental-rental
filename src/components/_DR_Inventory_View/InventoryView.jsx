import React, { Component } from "react";

class InventoryView extends Component {
  state = {
    filterStatus: "",
    changeStatus: "",
    addEquipment: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <>
        <h1>Inventory View</h1>

        <br />

        <select name="filterStatus">
          <option>Available</option>
          <option>Checked-Out</option>
          <option>Shipped</option>
          <option>In Inspection</option>
          <option>Missing</option>
        </select>

        <button>Add New Equipment</button>

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
