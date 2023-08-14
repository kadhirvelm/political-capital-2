"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { Store } from "./store/createStore";

export default function PoliticalCapitalProviders({ children }: PropsWithChildren) {
    return (
        <Provider store={Store}>
            <CacheProvider>
                <ChakraProvider>{children}</ChakraProvider>
            </CacheProvider>
        </Provider>
    );
}
