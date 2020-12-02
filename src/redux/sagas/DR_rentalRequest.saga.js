import axios from 'axios';
import { put, takeEvery, takeLatest, select } from 'redux-saga/effects';

function* rentalRequestSaga() {

    yield takeEvery(
        'FETCH_REQUESTS',
        fetchRequests,
    );

    yield takeEvery(
        'FETCH_FILTERED_REQUESTS',
        fetchFilteredRequests,
    );
};

function* fetchRequests(action) {
    try {
        const response = yield axios.get(`/api/requests`);
        yield put({ type: 'SET_REQUESTS', payload: response.data });
        yield put({ type: "NOT_LOADING" }); //this removes the spinner effect
    } catch (error) {
        console.log('Failed to get request info from /api/requests', error);
    };
};

function* fetchFilteredRequests(action) {
    try {
        const requestFilterStatus = action.payload;
        const response = yield axios.get(`/api/requests/filterrequests/${requestFilterStatus}`);
        yield put({ type: 'SET_REQUESTS', payload: response.data });
        yield put({ type: "NOT_LOADING" }); //this removes the spinner effect
    } catch (error) {
        console.log('Failed to get request info from /api/requests/filterrequests/', error);
    };
};

export default rentalRequestSaga;