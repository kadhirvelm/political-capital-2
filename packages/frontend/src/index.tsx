/**
 * Copyright (c) 2022 - KM
 */

import { PoliticalCapitalTwo } from "./components/PoliticalCapitalTwo";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { Store } from "./store/createStore";

import "./index.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GlobalScreen } from "./components/GlobalScreen";

const router = createBrowserRouter([
    {
        path: "/global-screen",
        element: <GlobalScreen />,
    },
    {
        path: "*",
        element: <PoliticalCapitalTwo />,
    },
]);

const root = createRoot(document.getElementById("root")!);
root.render(
    <Provider store={Store}>
        <ChakraProvider>
            <RouterProvider router={router} />
        </ChakraProvider>
    </Provider>,
);
