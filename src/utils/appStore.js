import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"
import feedReducer from "./feedSlice"
import connectionReducer from "./connectionSlice"
import requestReduce from "./requestSlice"
const appStore = configureStore({
  reducer:{
    user: userReducer,
    feed: feedReducer,
    connections: connectionReducer,
    requests: requestReduce
  }
})

export default appStore