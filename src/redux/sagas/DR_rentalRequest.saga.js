import axios from 'axios';
import { put, takeEvery, takeLatest, select } from 'redux-saga/effects';

function* rentalRequestSaga() {
    yield takeEvery(
        'FETCH_REQUESTS',
        fetchRequests,
    );
};

function* fetchRequests(action) {
    try {
        const response = yield axios.get(`/api/requests`);
        yield put({ type: 'SET_REQUESTS', payload: response.data });
        yield put({ type: "NOT_LOADING" }); //this removes the spinner effect
    } catch (error) {
        console.log('Failed to get user info from /api/requests', error);
    };
};

export default rentalRequestSaga;