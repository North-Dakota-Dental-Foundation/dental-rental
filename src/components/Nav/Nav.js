import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import mapStoreToProps from "../../redux/mapStoreToProps";
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "./Nav.png";

const Navigation = (props) => {
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
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="shadow-md p-3 mb-2">
        <Navbar.Brand>
          <Container>
          <img
            alt=""
            src={logo}
            width="180"
            height="60"
            className="d-inline-block align-top"
            />{" "}
            </Container>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
          {props.store.user.id && (
          <>
            <Link
              className="nav-link"
              to="/rental_requests"
              style={{ color: "white", justifyContent: "center", textAlign: "center" }}
            >
              Rental Requests Management
            </Link>
            <Link
              className="nav-link"
              to="/inventory_view"
              style={{ color: "white", justifyContent: "center", textAlign: "center" }}
            >
              Inventory Management{" "}
            </Link>
            <Link className="nav-link" to="/users" style={{ color: "white", textAlign: "center" }}>
              User Management{" "}
            </Link>
            <Link
              className="nav-link"
              to="/rental_submission_form"
              style={{ color: "white", textAlign: "center" }}
            >
              {" "}
              {/*TODO: REMOVE THIS FROM NAV BAR AFTER SUFFICIENT TESTING!!!*/}
              Client Submission Form{" "}
              </Link>
          </>
        )}
          </Nav>
          <Nav>
            {props.store.user.id &&
              <LogOutButton className="logout-button" />
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default connect(mapStoreToProps)(Navigation);
