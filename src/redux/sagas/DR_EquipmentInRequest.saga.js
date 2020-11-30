import axios from 'axios';
import { put, takeEvery } from 'redux-saga/effects';

function* equipmentInRequestsSaga() {
    yield takeEvery(
        'FETCH_EQUIPMENT_IN_REQUESTS',
        fetchEquipmentInRequests,
    );
};

function* fetchEquipmentInRequests(action) {
    try {
        const response = yield axios.get(`/api/requests/all-equipment`);
        yield put({ type: 'SET_REQUEST_EQUIPMENT', payload: response.data });
    } catch (error) {
        console.log('Failed to get user info from /api/requests', error);
    };
};

export default equipmentInRequestsSaga;