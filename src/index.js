import React from "react";
import ReactDOM from "react-dom";
import LogInForm from "./components/login";

function Counter() {
  return (
    <div>
      <LogInForm />
    </div>
  );
}

const $root = document.querySelector(".js-root");
ReactDOM.render(<Counter />, $root);
