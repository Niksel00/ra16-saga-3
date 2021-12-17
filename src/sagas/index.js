import { take, put, spawn, fork, retry } from "redux-saga/effects";
import {
  fetchNewsSuccess,
} from "../actions/actionCreators";
import {
  FETCH_NEWS_REQUEST,
} from "../actions/actionTypes";
import { fetchRequest } from "../api/index";

function* handleNewsFeedRequest(action) {
  const retryCount = Infinity;
  const retryDelay = 3 * 1000;
  const response = yield retry(
    retryCount, retryDelay, fetchRequest, action.payload.id
  );

  const data = response.map((obj) => ({
    id: obj.id,
    date: obj.date,
    text: obj.text,
    likes: obj.likes.count,
    comments: obj.comments.count,
    reposts: obj.reposts.count,
    views: obj.views.count,
  }));
  yield put(fetchNewsSuccess(data));
}

function* watchNewsFeedRequest() {
  while (true) {
    const action = yield take(FETCH_NEWS_REQUEST);
    yield fork(handleNewsFeedRequest, action);
  }
}

export default function* saga() {
  yield spawn(watchNewsFeedRequest);
}