# Redux Toolkit

## Summary

We will create a simple example of Redux using Redux Toolkit

# Step by Step guide

## Installation

First we need to install Redux Toolkit and React-Redux packages

```bash
npm install @reduxjs/toolkit react-redux
```

## Create a Redux Store

- Create `src/app/store.ts`

```ts
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
```

## Provide the Redux Store to React

To make it available to our App, we're going to use React-Rdux `<Provider>`

- Update `src/index.tsx`

```diff
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
+import { Provider } from 'react-redux';
+import { store } from './app/store';

const container = document.getElementById("root");
const root = createRoot(container);

-root.render(<App />);
+root.render(
+   <Provider store={store}>
+       <App />
+   </Provider>
+);
```

## Create a Redux State Slice

- Create `src/features/counter/counterSlice.ts`

```bash
mkdir -p src/features/counter
```

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
```

Creating a slice requires a string name to identify the slice, an initial state value, and one or more reducer functions to define how the state can be updated. Once a slice is created, we can export the generated Redux action creators and the reducer function for the whole slice.

Notice the code in `reducers`, for example:

```ts
{
  // ....
  increment: (state) => {
    state.value += 1;
  },
  // ...
}
```

> Redux Toolkit allows us to write "mutating" logic in reducers. It doesn't actually mutate the state because it uses the Immer library, which detects changes to a "draft state" and produces a brand new immutable state based off those changes.

## Add Slice Reducers to the Store

Next, we need to import the reducer function from the counter slice and add it to our store. By defining a field inside the `reducer` parameter, we tell the store to use this slice reducer function to handle all updates to that state.

* Update `src/app/store.ts`

```diff
import { configureStore } from '@reduxjs/toolkit';
+import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
    reducer: {
+       counter: counterReducer
    },
});

```
