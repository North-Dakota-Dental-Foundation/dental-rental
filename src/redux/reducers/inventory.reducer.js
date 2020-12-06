const defaultState = {
  currentItem: null,
  inventory: [],
};
const inventoryReducer = (state = defaultState, action) => {
  if (action.type === "SET_INVENTORY") {
    // clear uploads and set to a new list (action.payload)
    return {
      ...state,
      inventory: action.payload,
    };
  } else if (action.type === "SET_CURRENT_INVENTORY") {
    return {
      ...state,
      currentItem: action.payload,
    };
  }
  return state;
};

// uploads will be on the redux state at:
// state.mapRinks
export default inventoryReducer;
