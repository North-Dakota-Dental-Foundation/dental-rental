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
    yield takeEvery(
        'DELETE_USER',
        deleteUser,
    );
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

function* deleteUser(action) {
    try {
        const id = action.payload;
        yield axios.delete(`/userpage/deleteuser/${id}`, action.payload);
        yield put({ type: 'FETCH_USERS' });
    } catch (err) {
        console.log('Failed to delete message from /userpage/deleteuser', err)
    };
};

export default userPageSaga;