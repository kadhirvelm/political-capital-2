/**
 * Copyright (c) 2022 - KM
 */

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { IEvent } from "@pc2/api";
import * as React from "react";
import { getActiveResolution } from "../../selectors/resolutions";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./ActiveResolution.module.scss";
import { PlayerVoters } from "./PlayerVoters";
import { PreviousResolutions } from "./PreviousResolutions";
import { Resolution } from "./Resolution";
import { ResolveEvent } from "./ResolveEvent";

export const ActiveResolution: React.FC<{}> = () => {
    const [isViewingPreviousResolutions, setIsViewingPreviousResolutions] = React.useState(false);

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
    const activeResolution = usePoliticalCapitalSelector(getActiveResolution);

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

        if (nextResolutionEvent === undefined) {
            return undefined;
        }

        return (
            <div className={styles.resolveEventsContainer}>
                <ResolveEvent event={nextResolutionEvent} />
            </div>
        );
    };

    const maybeRenderMostRecentResolution = () => {
        if (activeResolution === undefined) {
            return undefined;
        }

        return <Resolution resolution={activeResolution} />;
    };

    const viewPreviousResolutions = () => setIsViewingPreviousResolutions(true);
    const onBackFromPreviousResolutions = () => setIsViewingPreviousResolutions(false);

    const maybeRenderSeeResolutionHistory = () => {
        if (fullGameState.activeResolutions.length <= 1) {
            return undefined;
        }

        return (
            <div className={styles.seePreviousResolutions} onClick={viewPreviousResolutions}>
                <span>See all resolutions</span>
                <ArrowForwardIcon />
            </div>
        );
    };

    const renderBody = () => {
        if (isViewingPreviousResolutions) {
            return <PreviousResolutions onBack={onBackFromPreviousResolutions} />;
        }

        return (
            <>
                {maybeRenderNextResolution()}
                {maybeRenderMostRecentResolution()}
                {maybeRenderSeeResolutionHistory()}
                <PlayerVoters
                    gameStateRid={fullGameState.gameState.gameStateRid}
                    activeResolutionRid={activeResolution?.activeResolutionRid}
                />
            </>
        );
    };

    return <div className={styles.overallContainer}>{renderBody()}</div>;
};
