/**
 * Copyright (c) 2022 - KM
 */

import { SampleServiceFrontend } from "@pc2/api";
import React from "react";
import ReactDOM from "react-dom";
import { checkIsError } from "./utility/alertOnError";
import "./index.scss";

const HelloWorld: React.FC<{}> = () => {
    const [endpointValue, setEndpointValue] = React.useState<string | undefined>(undefined);

    const loadEndpoint = async () => {
        const loadedValue = checkIsError(
            await SampleServiceFrontend.sampleEndpoint({ samplePayload: "Sent from the browser!" }),
        );
        if (loadedValue === undefined) {
            return;
        }

        const { newPayload } = loadedValue;

        setEndpointValue(newPayload);
    };

    React.useEffect(() => {
        loadEndpoint();
    }, []);

    return <div>Hello world! {endpointValue}</div>;
};

ReactDOM.render(<HelloWorld />, document.getElementById("root"));
