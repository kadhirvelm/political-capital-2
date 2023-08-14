/**
 * Copyright (c) 2022 - KM
 */

import { IEvent } from "@pc2/api";
import { getActiveResolution } from "../../selectors/resolutions";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { Resolution } from "../activeGame/Resolution";
import { ResolveEvent } from "../activeGame/ResolveEvent";
import styles from "./CurrentResolution.module.scss";
import { FC } from "react";

export const CurrentResolution: FC<{}> = () => {
    const activeResolution = usePoliticalCapitalSelector(getActiveResolution);

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (fullGameState === undefined || resolveEvents === undefined) {
        return null;
    }

    const maybeRenderNextResolution = () => {
        if (activeResolution !== undefined && activeResolution.state === "active") {
            return undefined;
        }

        const nextResolutionEvent = resolveEvents.game
            .slice()
            .sort((a, b) => (a.resolvesOn > b.resolvesOn ? -1 : 1))
            .find(
                (event) =>
                    IEvent.isNewResolution(event.eventDetails) && event.resolvesOn > fullGameState.gameState.gameClock,
            );

        return (
            <div className={styles.resolveEvent}>
                <ResolveEvent event={nextResolutionEvent} />
            </div>
        );
    };

    const maybeRenderMostRecentResolution = () => {
        if (activeResolution === undefined) {
            return undefined;
        }

        return <Resolution resolution={activeResolution} isGlobalScreen={true} />;
    };

    return (
        <>
            {maybeRenderNextResolution()}
            {maybeRenderMostRecentResolution()}
        </>
    );
};
