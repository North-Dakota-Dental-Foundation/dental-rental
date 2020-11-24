import axios from "axios";
import { put, takeEvery, takeLatest, select } from "redux-saga/effects";

function* createEquipment(action) {
  try {
    // clear any alerts that may be in there already

    yield axios.post("/api/inventory", action.payload);
    // dispatch an alert that the upload was successful
    yield put({
      type: "SET_ALERT",
      payload: {
        message: "Successfully created Equipment",
        alert: "alert-success",
      },
    });
    // refresh list of uploads
    yield put({ type: "FETCH_ITEM" });
  } catch (error) {
    // dispatch an error that the upload was rejected
    yield put({
      type: "SET_ALERT",
      payload: { message: "Error creating Equipment", alert: "alert-error" },
    });
    console.log("Error getting equipment items from server:", error);
  }
}

function* fetchItem() {
  try {
    const response = yield axios.get("/api/inventory");
    // add the upload to the redux store
    yield put({ type: "SET_ITEM", payload: response.data });
  } catch (error) {
    // dispatch an error that the upload was rejected
    yield put({
      type: "SET_ALERT",
      payload: { message: "Error retrieving Equipment", alert: "alert-error" },
    });
    console.log("Error getting Equipment from server:", error);
  }
}

function* inventoryViewSaga() {
  yield takeLatest("CREATE_ITEM", createEquipment);
  yield takeLatest("FETCH_ITEM", fetchItem);

  // yield takeEvery(
  //     'FETCH',
  //     fetchItem,
  // );
  // yield takeEvery(
  //     'POST',
  //     postItem,
  // );
  // yield takeEvery(
  //     'DELETE',
  //     deleteItem,
  // );
  // yield takeEvery(
  //     'EDIT',
  //     editItem,
  // )
}

export default inventoryViewSaga;
