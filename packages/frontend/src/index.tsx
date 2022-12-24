/**
 * Copyright (c) 2022 - KM
 */

import { PoliticalCapitalTwo } from "./components/PoliticalCapitalTwo";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { Store } from "./store/createStore";

import "./index.scss";

const root = createRoot(document.getElementById("root")!);
root.render(
    <Provider store={Store}>
        <ChakraProvider>
            <PoliticalCapitalTwo />
        </ChakraProvider>
    </Provider>,
);
