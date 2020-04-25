import React, { useState } from "react";
import ReactDOM from "react-dom";
import Toggler from "./components/toggler";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Toggler />
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

const $root = document.querySelector(".js-root");
ReactDOM.render(<Counter />, $root);
