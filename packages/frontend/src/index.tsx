/**
 * Copyright (c) 2022 - KM
 */

import { PoliticalCapitalTwo } from "./components/PoliticalCapitalTwo";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import "./index.scss";

// const HelloWorld: React.FC<{}> = () => {
//     const attemptWebSocket = () => {
//         const maybeSocket = new WebSocket("ws://localhost:3003/");

//         maybeSocket.onopen = (event) => {
//             console.log("Open", event);
//         };

//         maybeSocket.onmessage = (event) => {
//             console.log("Message", event);
//         };
//     };

//     React.useEffect(() => {
//         attemptWebSocket();
//     }, []);

//     return <div>Hello world!</div>;
// };

const root = createRoot(document.getElementById("root")!);
root.render(
    <ChakraProvider>
        <PoliticalCapitalTwo />
    </ChakraProvider>,
);
