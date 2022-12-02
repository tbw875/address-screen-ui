import React from "react";

// FileInput component
export default function FileInput(props) {
  return <input type="file" onChange={props.onFileChange} />;
}
