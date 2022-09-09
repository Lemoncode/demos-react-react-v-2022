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
