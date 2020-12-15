import React, { Component } from "react";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { connect } from "react-redux";
import Navigation from "../Nav/Nav";
import Footer from "../Footer/Footer";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import LoginPage from "../LoginPage/LoginPage";
import InventoryView from "../InventoryView/InventoryView";
import RentalRequest from "../RentalRequests/RentalRequests";
import SubmissionForm from "../SubmissonForm/SubmissionForm";
import Users from "../Users/Users";
import PublicSubmissionForm from "../SubmissonForm/PublicSubmissionForm";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.dispatch({ type: "FETCH_USER" });
    this.props.dispatch({ type: "FETCH_INVENTORY" });

    setInterval( () => {
      this.props.dispatch({ type: "FETCH_USER" });
    }, 1000 * 10) // Run every 10 seconds
  }

  render() {
    return (
      <Router>
        <div>

          <Navigation /> 
          
          <Switch>
            <Redirect exact from="/" to="/rental_requests" />

            {/* Visiting localhost:3000/about will show the about page. */}
            <ProtectedRoute
              // shows AboutPage at all times (logged in or not)
              exact
              path="/rental_requests"
              component={RentalRequest}
            />

            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}

            <ProtectedRoute
              // logged in shows UserPage else shows LoginPage
              exact
              path="/rental_submission_form"
              component={SubmissionForm}
            />

            <ProtectedRoute
              // logged in shows UserPage else shows LoginPage
              exact
              path="/inventory_view"
              component={InventoryView}
            />

            <ProtectedRoute
              // logged in shows InfoPage else shows LoginPage
              exact
              path="/users"
              component={Users}
            />

            {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
            <ProtectedRoute
              // with authRedirect:
              // - if logged in, redirects to "/user"
              // - else shows LoginPage at /login
              exact
              path="/login"
              component={LoginPage}
              authRedirect="/rental_requests"
            />

            {/* If none of the other routes matched, we will show a 404. */}
            <Route path="/public_rental_submission_form" component={PublicSubmissionForm} />
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  state: state,
  equipment: state.inventoryReducer.equipment,
  user: state.user,
});
export default connect(mapStateToProps)(App);
