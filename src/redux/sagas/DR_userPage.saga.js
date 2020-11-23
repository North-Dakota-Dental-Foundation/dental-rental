import axios from 'axios';
import { put, takeEvery, takeLatest, select } from 'redux-saga/effects';

function* userPageSaga() {
    yield takeEvery(
        'FETCH_USERS',
        fetchUsers,
    );
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
};

function* fetchUsers(action) {
    try {
        console.log('In Redux saga');
        const response = yield axios.get(`/userpage/allusers`);
        yield put({ type: 'SET_USERS', payload: response.data });
    } catch (error) {
        console.log('Failed to get user info from /users/allusers', error);
    };
};

export default userPageSaga;