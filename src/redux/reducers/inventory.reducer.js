const defaultState = {
  currentItem: null,
  equipment: [],
};
const inventoryReducer = (state = defaultState, action) => {
  if (action.type === "SET_ITEM") {
    // clear uploads and set to a new list (action.payload)
    return {
      ...state,
      rinks: action.payload,
    };
  } else if (action.type === "SET_CURRENT_ITEM") {
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
