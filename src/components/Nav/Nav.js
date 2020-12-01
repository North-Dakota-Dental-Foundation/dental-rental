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
    text: "Login / Register",
  };

  if (props.store.user.id != null) {
    loginLinkData.path = "/rental_requests";
    loginLinkData.text = "Rental Requests";
  }

  return (
    <div>
      <Navbar bg="dark" className="navbar-default">
        <Navbar.Brand href="#rental_requests">
          <img
            alt=""
            src={logo}
            width="100"
            height="40"
            className="d-inline-block align-top"
          />{" "}
          <Link className="nav-link" to={loginLinkData.path}>
            {/* Show this link if they are logged in or not,
          but call this link 'Home' if they are logged in,
          and call this link 'Login / Register' if they are not */}
            {loginLinkData.text}
          </Link>
          {/* Show the link to the info page and the logout button if the user is logged in */}
          {props.store.user.id && (
            <>
              <Link
                className="nav-link"
                to="/inventory_view"
                style={{ color: "white" }}
              >
                Inventory Management{" "}
              </Link>
              <Link className="nav-link" to="/users" style={{ color: "white" }}>
                Users{" "}
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
              <LogOutButton className="logout-button" />
            </>
          )}
          {/* Always show this link since the about page is not protected */}
        </Navbar.Brand>
      </Navbar>
    </div>
  );
};

export default connect(mapStoreToProps)(Nav);
