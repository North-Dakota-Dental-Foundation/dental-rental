// this reducer signals whether or not the application is fetching data from the backend
// this reducer is primarily used for the skeleton effect on the frontend to signal to user that data is being retrieved
const isLoading = (state = false, action) => {
    switch (action.type) {
      case "LOADING":
        return true;
      case "NOT_LOADING":
        return false;
      default:
        return state;
    }
  };
  
  export default isLoading;