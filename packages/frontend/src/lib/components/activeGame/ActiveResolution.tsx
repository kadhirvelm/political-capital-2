/*
 * Copyright 2023 KM.
 */

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { IEvent } from "@pc2/api";
import React, { useState } from "react";
import { getActiveResolution } from "../../selectors/resolutions";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import styles from "./ActiveResolution.module.scss";
import { PlayerVoters } from "./PlayerVoters";
import { PreviousResolutions } from "./PreviousResolutions";
import { Resolution } from "./Resolution";
import { ResolveEvent } from "./ResolveEvent";

export const ActiveResolution = () => {
  const [isViewingPreviousResolutions, setIsViewingPreviousResolutions] = useState(false);

  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
  const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
  const activeResolution = usePoliticalCapitalSelector(getActiveResolution);

  if (fullGameState === undefined || resolveEvents === undefined) {
    return;
  }

  const maybeRenderNextResolution = () => {
    if (activeResolution !== undefined && activeResolution.state === "active") {
      return;
    }

    const nextResolutionEvent = [...resolveEvents.game]
      .sort((a, b) => (a.resolvesOn > b.resolvesOn ? -1 : 1))
      .find(
        (event) => IEvent.isNewResolution(event.eventDetails) && event.resolvesOn > fullGameState.gameState.gameClock,
      );

    if (nextResolutionEvent === undefined) {
      return;
    }

    return (
      <div className={styles.resolveEventsContainer}>
        <ResolveEvent event={nextResolutionEvent} />
      </div>
    );
  };

  const maybeRenderMostRecentResolution = () => {
    if (activeResolution === undefined) {
      return;
    }

    return <Resolution resolution={activeResolution} />;
  };

  const viewPreviousResolutions = () => setIsViewingPreviousResolutions(true);
  const onBackFromPreviousResolutions = () => setIsViewingPreviousResolutions(false);

  const maybeRenderSeeResolutionHistory = () => {
    if (fullGameState.activeResolutions.length <= 1) {
      return;
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
          activeResolutionRid={activeResolution?.activeResolutionRid}
          gameStateRid={fullGameState.gameState.gameStateRid}
        />
      </>
    );
  };

  return <div className={styles.overallContainer}>{renderBody()}</div>;
};
