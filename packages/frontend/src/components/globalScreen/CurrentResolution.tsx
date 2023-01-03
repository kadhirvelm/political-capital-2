/**
 * Copyright (c) 2022 - KM
 */

import { IEvent } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { Resolution } from "../activeGame/Resolution";
import { ResolveEvent } from "../activeGame/ResolveEvent";
import styles from "./CurrentResolution.module.scss";

export const CurrentResolution: React.FC<{}> = () => {
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (fullGameState === undefined || resolveEvents === undefined) {
        return null;
    }

    const resolutionsSorted = fullGameState.activeResolutions
        .slice()
        .sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));

    const maybeRenderNextResolution = () => {
        const maybeVoteOnResolution = resolutionsSorted[0];
        if (maybeVoteOnResolution !== undefined && maybeVoteOnResolution.state === "active") {
            return undefined;
        }

        const nextResolutionEvent = resolveEvents.game
            .slice()
            .sort((a, b) => (a.resolvesOn > b.resolvesOn ? -1 : 1))
            .find((event) => IEvent.isNewResolution(event.eventDetails));

        return (
            <div className={styles.resolveEvent}>
                <ResolveEvent event={nextResolutionEvent} />
            </div>
        );
    };

    const maybeRenderMostRecentResolution = () => {
        const maybeRenderResolution = resolutionsSorted[0];
        if (maybeRenderResolution === undefined) {
            return undefined;
        }

        return <Resolution resolution={maybeRenderResolution} isGlobalScreen={true} />;
    };

    return (
        <>
            {maybeRenderNextResolution()}
            {maybeRenderMostRecentResolution()}
        </>
    );
};
