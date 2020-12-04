import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import mapStoreToProps from "../../redux/mapStoreToProps";
import { Navbar } from "react-bootstrap";
import logo from "./Nav.png";

const Nav = (props) => {
  let loginLinkData = {
    path: "/login",
    text: "Login",
  };

  if (props.store.user.id != null) {
    loginLinkData.path = "/rental_requests";
    loginLinkData.text = "Rental Requests";
  }

  return (
    <div>
      <Navbar bg="dark" className="navbar-default">
        <Navbar.Brand>
          <img
            alt=""
            src={logo}
            width="180"
            height="60"
            className="d-inline-block align-top"
          />{" "}
        </Navbar.Brand>

        {/* Show the link to the info page and the logout button if the user is logged in */}
        {props.store.user.id && (
          <>
            <Link
              className="nav-link"
              to="/rental_requests"
              style={{ color: "white", justifyContent: "center" }}
            >
              Rental Requests Management
            </Link>
            <Link
              className="nav-link"
              to="/inventory_view"
              style={{ color: "white", justifyContent: "center" }}
            >
              Inventory Management{" "}
            </Link>
            <Link className="nav-link" to="/users" style={{ color: "white" }}>
              User Management{" "}
            </Link>
            <Link
              className="nav-link"
              to="/rental_submission_form"
              style={{ color: "white" }}
            >
              {" "}
              {/*TODO: REMOVE THIS FROM NAV BAR AFTER SUFFICIENT TESTING!!!*/}
              Client Submission Form{" "}
            </Link>
          </>
        )}
        {/* Always show this link since the about page is not protected */}
        <ul className="nav navbar-nav ml-auto">
          <LogOutButton className="logout-button" />
        </ul>
      </Navbar>
    </div>
  );
};

export default connect(mapStoreToProps)(Nav);
