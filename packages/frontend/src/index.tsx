/**
 * Copyright (c) 2022 - KM
 */

import { PoliticalCapitalTwo } from "./components/PoliticalCapitalTwo";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import "./index.scss";

const root = createRoot(document.getElementById("root")!);
root.render(
    <ChakraProvider>
        <PoliticalCapitalTwo />
    </ChakraProvider>,
);
