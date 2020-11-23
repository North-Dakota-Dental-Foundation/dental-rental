import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import mapStoreToProps from "../../redux/mapStoreToProps";
import { Navbar } from "react-bootstrap";

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
    <div className="nav">
      <div className="navLink">
        <Link to="/rental_requests">
          <h3 className="nav-title">Dental Rental</h3>
        </Link>
      </div>
      <div className="nav-right">
        <Link className="nav-link" to={loginLinkData.path}>
          {/* Show this link if they are logged in or not,
          but call this link 'Home' if they are logged in,
          and call this link 'Login / Register' if they are not */}
          {loginLinkData.text}
        </Link>
        {/* Show the link to the info page and the logout button if the user is logged in */}
        {props.store.user.id && (
          <>
            <Link className="nav-link" to="/inventory_view">
              Inventory Management{" "}
            </Link>
            <Link className="nav-link" to="/users">
              Users{" "}
            </Link>
            <LogOutButton className="nav-link" />
          </>
        )}
        {/* Always show this link since the about page is not protected */}
      </div>
    </div>
  );
};

export default connect(mapStoreToProps)(Nav);
