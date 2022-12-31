/**
 * Copyright (c) 2022 - KM
 */

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { IEvent } from "@pc2/api";
import * as React from "react";
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
            <div className={styles.resolveEventsContainer}>
                <ResolveEvent event={nextResolutionEvent} />
            </div>
        );
    };

    const maybeRenderMostRecentResolution = () => {
        const maybeRenderResolution = resolutionsSorted[0];
        if (maybeRenderResolution === undefined) {
            return undefined;
        }

        return <Resolution resolution={maybeRenderResolution} />;
    };

    const viewPreviousResolutions = () => setIsViewingPreviousResolutions(true);
    const onBackFromPreviousResolutions = () => setIsViewingPreviousResolutions(false);

    const maybeRenderSeeResolutionHistory = () => {
        if (resolutionsSorted.length <= 1) {
            return undefined;
        }

        return (
            <div className={styles.seePreviousResolutions} onClick={viewPreviousResolutions}>
                <span>See previous resolutions</span>
                <ArrowForwardIcon />
            </div>
        );
    };

    const maybeRenderVotes = () => {
        const maybeVoteOnResolution = resolutionsSorted[0];
        if (maybeVoteOnResolution === undefined) {
            return undefined;
        }

        return (
            <PlayerVoters
                gameStateRid={fullGameState.gameState.gameStateRid}
                activeResolutionRid={maybeVoteOnResolution.activeResolutionRid}
            />
        );
    };

    const renderBody = () => {
        if (isViewingPreviousResolutions) {
            return <PreviousResolutions resolutionsSorted={resolutionsSorted} onBack={onBackFromPreviousResolutions} />;
        }

        return (
            <>
                {maybeRenderNextResolution()}
                {maybeRenderMostRecentResolution()}
                {maybeRenderSeeResolutionHistory()}
                {maybeRenderVotes()}
            </>
        );
    };

    return <div>{renderBody()}</div>;
};
