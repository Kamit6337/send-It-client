import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slice/userSlice";
import { toggleReducer } from "./slice/toggleSlice";
import { roomReducer } from "./slice/roomSlice";
import { postReducer } from "./slice/postSlice";
import { followingReducer } from "./slice/followingSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    toggle: toggleReducer,
    room: roomReducer,
    post: postReducer,
    following: followingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable strict mode
    }),
  devTools: true,
});

// Define and export RootState type
export type RootState = ReturnType<typeof store.getState>;
