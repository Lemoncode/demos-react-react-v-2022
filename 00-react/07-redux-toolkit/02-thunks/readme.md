# Redux Toolkit

## Summary

We will add in this example side effecst actions

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

## Defined Typed Hooks

We can use `RootState` and `AppDispatch` types in each component. But, it's better to create typed versions of the useDispatch and useSelector hooks for usage in your application.

- `useSelector`, you don't need to type `(state: RootState)` every time
- `useDispatch`, the default `Dispatch` type does not know about thunks. In order to correctly dispatch thunks, you need to use the specific customized `AppDispatch` type from the store that includes the thunk middleware types, and use that with `useDispatch`. Adding a pre-typed `useDispatch` hook keeps you from forgetting to import `AppDispatch` where it's needed.

Since these are actual variables, not types, it's important to define them in a separate file such as `app/hooks.ts`, not the store setup file.

- Create `app/hooks.ts`

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';


export const useAppDispatch: () => AppDispatch = useDispatch; 
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

```

## Use Redux State and Actions in React Components

Now we can use the React-Redux hooks to let React components interact with the Redux store. We can read data from the store with `useAppSelector`, and dispatch actions using `useDispatch`. 

- Create a `src/features/counter/Counter.tsx` 

```tsx
import React from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { increment, decrement } from "./counterSlice";

export const CounterComponent = (): React.ReactElement => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div>
        <button onClick={() => dispatch(decrement())}>-</button>
        <span>{count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    </div>
  );
};

```

* Update `App.tsx`

```diff
import React from "react";
+import { CounterComponent } from "./features/counter/counter.component";

export const App = () => {
- return <h1>Hello React !!</h1>;
+ return <CounterComponent />;
};

```

Let's check if works `npm start`

> Exercise: Update `counter.component.tsx` including a button that disptaches `incrementByAmount` action.
