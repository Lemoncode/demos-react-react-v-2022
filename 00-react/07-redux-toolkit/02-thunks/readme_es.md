# Thunks

## Resumen

Este ejemplo toma como punto de partida el ejemplo _01-getting-started_.

Vamos a ir paso a paso añdiendo la configuración necesaria para integrar acciones que impliquen **side effects** a través de `Redux-Thunk`.

## Paso a Paso

- Primero copiamos el ejemplo anterior, y hacemos un _npm install_

```bash
npm install
```

- Vamos a construir una *fake API*, que devolverá una promesa y por tanto implicará código asíncrono.

* Crear `src/features/counter/counterAPI.ts`

```ts
export const fetchCount = (amount = 1) =>
  new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );

```

No podemos disparar una ación que invoque directamente una función dentro de nuestros reducers, por una sencilla razón, está acción no es pura, tiene un *side effect*, el `setTimeout`.

En nuestro *state slice* de counter, vamos a hacer un seguimeinto de la petición de la API:

* Actualizar `src/features/counter/counterSlice.ts`

```diff
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

+interface CounterState {
+ value: number;
+ status: 'idle' | 'loading' | 'failed';
+}
+
+const initialState: CounterState = {
+ value: 0,
+ status: 'idle'
+}

export const counterSlice = createSlice({
  name: "counter",
- initialState: {
-   value: 0,
- },
+ initialState,
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
```

- Una vez actualizado `CounterState`, vamos a crear un `Thunk`. Un `Thunk`, nos permite ejecutar código asíncrono. Lo lanzaremos como una acción normal, `dispatch(incrementAsync(10))`. 

- `dispatch(incrementAsync(10))`, invocará al `Thunk`, con la función `dispatch` como primer argumento. El código asíncrono puede ejecutarse mientras otras acciones son lanzadas,

* Actualizar `src/features/counter/counterSlice.ts`

```diff
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
+import { fetchCount } from "./counterAPI";

interface CounterState {
  value: number;
  status: "idle" | "loading" | "failed";
}

const initialState: CounterState = {
  value: 0,
  status: "idle",
};
+
+export const incrementAsync = createAsyncThunk(
+ "counter/fetchCount",
+ async (amount: number) => {
+   const response = await fetchCount(amount);
+   return response.data;
+ }
+);
```

> El valor devuleto por `response.data`, se convertirá en el `payload` de la acción, si la petición a la API tiene éxito.

- El `Thunk`, internemante va a lanzar una sarie de accriones relacionadas, con el estado de la promesa, para poder trabajar con ellas, podemos incuir los `extraReducers`

* Actualizar `src/features/counter/counterSlice.ts`

```ts
export const counterSlice = createSlice({
  name: "counter",
  initialState,
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
  /*diff*/
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
  /*diff*/
});
```

- Ahora debemos actualizar `counter.component.tsx`, para que sea capaz de lanzar la acción `incrementAsync`.

* Actualizar `src/features/counter/counter.component.tsx`


```diff
-import React from "react";
+import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
-import { increment, decrement } from "./counterSlice";
+import { increment, decrement, incrementAsync } from "./counterSlice";

export const CounterComponent = (): React.ReactElement => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
+ const [incrementAmount, setIncrementAmount] = useState("2");
+
+ const incrementValue = +incrementAmount || 0;

  return (
    <div>
      <div>
        <button onClick={() => dispatch(decrement())}>-</button>
        <span>{count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
+     <div>
+       <input
+         value={incrementAmount}
+         onChange={(e) => setIncrementAmount(e.target.value)}
+       />
+       <button onClick={() => dispatch(incrementAsync(incrementValue))}>Add Async</button>
+     </div>
    </div>
  );
};

```

Veamos si funcionan nuestros cambios, `npm start`

