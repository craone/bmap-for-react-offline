import "./styles.css";
import BmapExample from "./map/BmapExample";

import React, { useEffect, useRef } from "react";



export default function App() {
    return (
        <div className="App">
            <h1>Hello CodeSandbox</h1>
            <h2>Start editing to see some magic happen!</h2>
            <BmapExample></BmapExample>
        </div>
    );
}
