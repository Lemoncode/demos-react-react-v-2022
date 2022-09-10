// import React from "react";
import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { increment, decrement, incrementAsync } from "./counterSlice";

export const CounterComponent = (): React.ReactElement => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  const [incrementAmount, setIncrementAmount] = useState("2");

  const incrementValue = +incrementAmount || 0;

  return (
    <div>
      <div>
        <button onClick={() => dispatch(decrement())}>-</button>
        <span>{count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
      <div>
        <input
          value={incrementAmount}
          onChange={(e) => setIncrementAmount(e.target.value)}
        />
        <button onClick={() => dispatch(incrementAsync(incrementValue))}>Add Async</button>
      </div>
    </div>
  );
};
