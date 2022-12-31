/**
 * Copyright (c) 2022 - KM
 */

import { IEvent } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { PlayerVoters } from "./PlayerVoters";
import { Resolution } from "./Resolution";
import { ResolveEvent } from "./ResolveEvent";
import styles from "./ActiveResolution.module.scss";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export const ActiveResolution: React.FC<{}> = () => {
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (fullGameState === undefined || resolveEvents === undefined) {
        return null;
    }

    const resolutionsSorted = fullGameState.activeResolutions
        .slice()
        .sort((a, b) => (a.createdOn > b.createdOn ? -1 : 1));

    const maybeRenderMostRecentResolution = () => {
        const maybeRenderResolution = resolutionsSorted[0];
        if (maybeRenderResolution === undefined) {
            return undefined;
        }

        return <Resolution resolution={maybeRenderResolution} />;
    };

    const maybeRenderSeeResolutionHistory = () => {
        if (resolutionsSorted.length <= 1) {
            return undefined;
        }

        return (
            <div className={styles.seePreviousResolutions}>
                <span>See previous {resolutionsSorted.length - 1} resolutions</span>
                <ArrowForwardIcon />
            </div>
        );
    };

    const maybeRenderVotes = () => {
        const maybeVoteOnResolution = resolutionsSorted[0];
        if (maybeVoteOnResolution === undefined) {
            const nextResolutionEvent = resolveEvents.game
                .slice()
                .sort((a, b) => (a.resolvesOn > b.resolvesOn ? -1 : 1))
                .find((event) => IEvent.isNewResolution(event.eventDetails));

            return <ResolveEvent event={nextResolutionEvent} />;
        }

        return (
            <PlayerVoters
                gameStateRid={fullGameState.gameState.gameStateRid}
                activeResolutionRid={maybeVoteOnResolution.activeResolutionRid}
            />
        );
    };

    return (
        <div>
            {maybeRenderMostRecentResolution()}
            {maybeRenderSeeResolutionHistory()}
            {maybeRenderVotes()}
        </div>
    );
};
