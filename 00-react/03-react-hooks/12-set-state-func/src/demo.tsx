import React from "react";

export const MyComponent: React.FC = () => {
  const [number, setNumber] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setNumber((number) => number + 1);
    }, 1500);
    setNumber(1);
  }, []);

  return (
    <>
      <h4>Number: {number}</h4>
    </>
  );
};
