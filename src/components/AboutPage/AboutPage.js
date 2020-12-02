import React from 'react';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

const AboutPage = () => (
  <div className="container">
    <>

      <h1>About Dental Rental</h1>
      <p>
        This app was created for the North Dakota Dental Foundation to fast-forward the process of recieving request applications from clients for
        specific dental equipment. They will be able to manage the client request forms and equipment availability.
      </p>

      <h3>Client Submission Form</h3>
      <p>
        A client will log all required data, along with the types equipment they want, and upon submission, the request form goes to the
        Rental Requests to be approved, or denied by the administrative user.
      </p>

      <h3>Rental Requests</h3>
      <p>
        View all requests submitted by clients. The table will show all user information, so that you may contact the client, and 
        approve or deny the requests. You can filter by status, to hone in on what you are looking for.
      </p>

      <h3>Inventory Management</h3>
        The user will be able to view all inventory equipment logged into the system, along with their availability statuses. They can change the 
        status, or take a note on every individual item. You can also filter by status, to make looking for your items a breeze.
      <p>

      </p>

      <h3>User Management</h3>
      <p>
        The user table lists all users registered into the Dental Rental system. <strong>All registered users have administrative access to all
        Dental Rental functionality,</strong> including the ability to register and delete users!
      </p>

    </>
  </div>
);

export default AboutPage;
