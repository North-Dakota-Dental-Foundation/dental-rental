const inventoryReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ITEM":
      return action.payload;
    default:
      return state;
  }
};

// uploads will be on the redux state at:
// state.mapRinks
export default inventoryReducer;
