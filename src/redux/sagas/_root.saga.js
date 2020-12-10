import { all } from "redux-saga/effects";
import loginSaga from "./login.saga";
import registrationSaga from "./registration.saga";
import userSaga from "./user.saga";

import inventoryViewSaga from "./inventoryView.saga";
import rentalRequestSaga from "./rentalRequest.saga";
import userPageSaga from "./userPage.saga";
import equipmentInRequestSaga from "./equipmentInRequest.saga";

export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),

    inventoryViewSaga(),
    rentalRequestSaga(),
    userPageSaga(),
    equipmentInRequestSaga(),
  ]);
}
