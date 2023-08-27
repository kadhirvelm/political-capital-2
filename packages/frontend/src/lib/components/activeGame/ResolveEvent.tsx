/*
 * Copyright 2023 KM.
 */

import { DEFAULT_STAFFER, type IActiveStafferRid, IEvent } from "@pc2/api";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { isResolveGameEvent, type IUserFacingResolveEvents } from "../../store/gameState";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { getFakeDate } from "../common/ServerStatus";
import { StafferName } from "../common/StafferName";
import styles from "./ResolveEvent.module.scss";
import { type FC } from "react";

export const ResolveEvent: FC<{
  activeStafferRid?: IActiveStafferRid;
  event: IUserFacingResolveEvents | undefined;
}> = ({ event }) => {
  const player = usePoliticalCapitalSelector((s) => s.playerState.player);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
  const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

  if (fullGameState === undefined || event === undefined) {
    return null;
  }

  const renderEventDetails = () => {
    return IEvent.visit<JSX.Element | undefined>(event.eventDetails, {
      finishHiringStaffer: (finishHiring) => {
        if (player === undefined) {
          return;
        }

        const hiringStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
          (staffer) => staffer.activeStafferRid === finishHiring.activeStafferRid,
        );

        if (hiringStaffer === undefined) {
          return <div>Unknown staffer</div>;
        }

        return (
          <div>
            <div className={styles.title}>Finish recruiting</div>
            <StafferName showDescription showType staffer={hiringStaffer} />
          </div>
        );
      },
      finishTrainingStaffer: (finishTraining) => {
        if (player === undefined) {
          return;
        }

        const trainingStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
          (staffer) => staffer.activeStafferRid === finishTraining.activeStafferRid,
        );

        if (trainingStaffer === undefined) {
          return <div>Unknown staffer</div>;
        }

        return (
          <div>
            <div className={styles.title}>Finish training</div>
            <StafferName showDescription showType staffer={trainingStaffer} />
          </div>
        );
      },
      newResolution: () => <div>Create new resolution</div>,
      payoutEarlyVoting: () => <div>Payout early voting</div>,
      startHiringStaffer: (startHiring) => (
        <div>
          <div className={styles.title}>Start recruiting</div>
          <div>{DEFAULT_STAFFER[startHiring.stafferType].displayName}</div>
          <div className={styles.description}>
            {descriptionOfStaffer(resolvedGameModifiers)[startHiring.stafferType]}
          </div>
        </div>
      ),
      startTrainingStaffer: (startTraining) => {
        if (player === undefined) {
          return;
        }

        const trainingStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
          (staffer) => staffer.activeStafferRid === startTraining.activeStafferRid,
        );

        return (
          <div>
            <div className={styles.title}>Start training</div>
            <div>{trainingStaffer?.stafferDetails.displayName}</div>
            <div>
              {trainingStaffer !== undefined &&
                `to ${DEFAULT_STAFFER[trainingStaffer?.stafferDetails.type].displayName}`}
            </div>
            <div className={styles.description}>
              {trainingStaffer !== undefined &&
                descriptionOfStaffer(resolvedGameModifiers)[trainingStaffer.stafferDetails.type]}
            </div>
          </div>
        );
      },
      tallyResolution: () => <div>Tally current resolution</div>,
      unknown: () => <div />,
    });
  };

  return (
    <div className={styles.singleHiringEvent} key={event.eventDetails.type + event.state}>
      <div className={styles.eventBody}>{renderEventDetails()}</div>
      <div className={styles.eventFooter}>
        <div className={styles.description}>Completes on</div>
        {isResolveGameEvent(event) ? getFakeDate(event.resolvesOn) : "Pending"}
      </div>
    </div>
  );
};

export const MinimalResolveEvent: FC<{
  activeStafferRid?: IActiveStafferRid;
  event: IUserFacingResolveEvents;
}> = ({ event, activeStafferRid }) => {
  const player = usePoliticalCapitalSelector((s) => s.playerState.player);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

  if (player === undefined || fullGameState === undefined) {
    return null;
  }

  const renderEventDetails = () => {
    return IEvent.visit(event.eventDetails, {
      finishHiringStaffer: (finishHiring) => {
        if (finishHiring.activeStafferRid === activeStafferRid) {
          const recruiterStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
            (staffer) => staffer.activeStafferRid === finishHiring.recruiterRid,
          );

          return (
            <>
              <div>Being recruited by</div>
              <div>{recruiterStaffer?.stafferDetails.displayName}</div>
            </>
          );
        }

        const hiringStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
          (staffer) => staffer.activeStafferRid === finishHiring.activeStafferRid,
        );

        return (
          <>
            <div>Hiring</div>
            <div>{hiringStaffer?.stafferDetails.displayName}</div>
            <div>({hiringStaffer !== undefined && DEFAULT_STAFFER[hiringStaffer.stafferDetails.type].displayName})</div>
          </>
        );
      },
      finishTrainingStaffer: (finishTraining) => {
        if (finishTraining.activeStafferRid === activeStafferRid) {
          const trainerStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
            (staffer) => staffer.activeStafferRid === finishTraining.trainerRid,
          );

          return (
            <>
              <div>Being trained by</div>
              <div>{trainerStaffer?.stafferDetails.displayName}</div>
            </>
          );
        }

        const trainingStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
          (staffer) => staffer.activeStafferRid === finishTraining.activeStafferRid,
        );

        return (
          <>
            <div>Training</div>
            <div>{trainingStaffer?.stafferDetails.displayName}</div>
            <div>
              {trainingStaffer !== undefined &&
                `to ${DEFAULT_STAFFER[trainingStaffer?.stafferDetails.type].displayName}`}
            </div>
          </>
        );
      },
      newResolution: () => <div />,
      payoutEarlyVoting: () => <div />,
      startHiringStaffer: (startHiring) => (
        <>
          <div>Hiring a</div>
          <div>{DEFAULT_STAFFER[startHiring.stafferType].displayName}</div>
        </>
      ),
      startTrainingStaffer: (startTraining) => {
        if (startTraining.activeStafferRid === activeStafferRid) {
          const trainerStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
            (staffer) => staffer.activeStafferRid === startTraining.trainerRid,
          );

          return (
            <>
              <div>Being trained by</div>
              <div>{trainerStaffer?.stafferDetails.displayName}</div>
            </>
          );
        }

        const trainingStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
          (staffer) => staffer.activeStafferRid === startTraining.activeStafferRid,
        );

        return (
          <>
            <div>Training</div>
            <div>{trainingStaffer?.stafferDetails.displayName}</div>
            <div>
              {trainingStaffer !== undefined &&
                `to ${DEFAULT_STAFFER[trainingStaffer?.stafferDetails.type].displayName}`}
            </div>
          </>
        );
      },
      tallyResolution: () => <div />,
      unknown: () => <div />,
    });
  };

  return (
    <div className={styles.minimalEvent} key={event.eventDetails.type + event.state}>
      <div className={styles.minimalEventSentence}>
        {renderEventDetails()}
        <div>until</div>
        <div>{isResolveGameEvent(event) ? getFakeDate(event.resolvesOn) : "Pending"}</div>
      </div>
    </div>
  );
};
