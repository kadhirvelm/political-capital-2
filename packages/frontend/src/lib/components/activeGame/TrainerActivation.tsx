/*
 * Copyright 2023 KM.
 */

import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import {
  DEFAULT_STAFFER,
  getStafferCategory,
  type IActiveStaffer,
  type IActiveStafferRid,
  type IBasicStaffer,
  IEvent,
  type IGameClock,
  type IGameStateRid,
  type IPlayerRid,
  type IStafferCategory,
  type IStartTrainingStaffer,
  type ITrainer,
  PoliticalCapitalTwoServiceFrontend,
  StafferLadderIndex,
} from "@pc2/api";
import classNames from "classnames";
import { batch } from "react-redux";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { getAvailableToTrainStaffer } from "../../selectors/staffers";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addGameEventToStaffer, type IUserFacingResolveEvents, payPoliticalCapital } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { getStaffersOfCategory } from "../../utility/categorizeStaffers";
import { doesExceedLimit } from "../../utility/doesExceedLimit";
import { summaryStaffers } from "../../utility/partySummarizer";
import { roundToHundred, roundToThousand } from "../../utility/roundTo";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { getFakeDate } from "../common/ServerStatus";
import { StafferName } from "../common/StafferName";
import { ResolveEvent } from "./ResolveEvent";
import styles from "./TrainerActivation.module.scss";
import { type FC, useState } from "react";

export const TrainerActivation: FC<{
  resolveGameEvents: IUserFacingResolveEvents[];
  trainer: IBasicStaffer & ITrainer;
  trainerRequest: { gameStateRid: IGameStateRid; playerRid: IPlayerRid; trainerRid: IActiveStafferRid };
}> = ({ trainer, trainerRequest, resolveGameEvents }) => {
  const toast = useToast();
  const dispatch = usePoliticalCapitalDispatch();

  const currentPoliticalCapital = usePoliticalCapitalSelector(
    (s) => s.localGameState.fullGameState?.activePlayers[trainerRequest.playerRid]?.politicalCapital ?? 0,
  );
  const currentDate = usePoliticalCapitalSelector(
    (s) => s.localGameState.fullGameState?.gameState.gameClock ?? (0 as IGameClock),
  );

  const [isLoading, setIsLoading] = useState(false);
  const [upgradeStafferToLevel, setUpgradeStafferToLevel] = useState<
    { activeStaffer: IActiveStaffer; toLevel: IStartTrainingStaffer["toLevel"] } | undefined
  >();

  const closeModal = () => setUpgradeStafferToLevel();

  const player = usePoliticalCapitalSelector((s) => s.playerState.player);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
  const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
  const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);
  const availableToTrain = usePoliticalCapitalSelector(getAvailableToTrainStaffer(trainerRequest.trainerRid));

  if (player === undefined || fullGameState === undefined || resolveEvents === undefined) {
    return null;
  }

  const currentlyTraining = resolveGameEvents.filter(
    (gameEvent) =>
      (gameEvent.state === "active" || gameEvent.state === "pending") &&
      (IEvent.isStartTrainingStaffer(gameEvent.eventDetails) || IEvent.isFinishTrainingStaffer(gameEvent.eventDetails)),
  );

  const maybeRenderCurrentlyTraining = () => {
    if (currentlyTraining.length === 0) {
      return;
    }

    return (
      <div className={styles.currentlyTraining}>
        <div className={styles.currentlyTrainingText}>Currently in progress</div>
        <div className={styles.trainingEvents}>
          {currentlyTraining.map((trainingEvent, index) => (
            <ResolveEvent event={trainingEvent} key={trainingEvent.eventDetails.type + index.toString()} />
          ))}
        </div>
      </div>
    );
  };

  const upgradeStafferCurried = (activeStaffer: IActiveStaffer, toLevel: IStartTrainingStaffer["toLevel"]) => () =>
    setUpgradeStafferToLevel({ activeStaffer, toLevel });

  const renderSingleCategory = (category: IStafferCategory | undefined) => {
    const filteredStaffers = getStaffersOfCategory(availableToTrain, category, resolvedGameModifiers);
    if (filteredStaffers.length === 0) {
      return <div className={styles.description}>No staffers available to train</div>;
    }

    return (
      <div className={styles.staffersInCategory}>
        {filteredStaffers.map((staffer) => {
          const upgradesInto = StafferLadderIndex[staffer.stafferDetails.type] ?? [];

          return (
            <div className={styles.singleTrainee} key={staffer.activeStafferRid}>
              <div
                className={classNames(styles.currentPosition, {
                  [styles.noCategory]: category === undefined,
                  [styles.voter]: category === "voter",
                  [styles.generator]: category === "generator",
                  [styles.trainer]: category === "trainer",
                  [styles.recruit]: category === "recruit",
                  [styles.shadowGovernment]: category === "shadowGovernment",
                })}
              >
                <div className={styles.nameContainer}>
                  <StafferName showDescription={true} showType={true} staffer={staffer} />
                </div>
              </div>
              <div className={styles.upgradeInto}>
                {upgradesInto.map((upgradeStaffer) => {
                  const defaultStaffer = DEFAULT_STAFFER[upgradeStaffer];
                  const newStafferCategory = getStafferCategory(defaultStaffer);

                  const finalCost = resolvedGameModifiers[defaultStaffer.type].costToAcquire;
                  const finalTime = resolvedGameModifiers[defaultStaffer.type].timeToAcquire;

                  const isDisabled =
                    resolvedGameModifiers[upgradeStaffer].disableTraining ||
                    doesExceedLimit(upgradeStaffer, trainerRequest.playerRid, fullGameState, "training");

                  const maybeRenderDisabledExplanation = () => {
                    if (!isDisabled) {
                      return;
                    }

                    if (resolvedGameModifiers[upgradeStaffer].disableHiring) {
                      return (
                        <div className={styles.disabledReason}>
                          A game modifier has prevented this staffer from being hired.
                        </div>
                      );
                    }

                    return (
                      <div className={styles.disabledReason}>
                        You have reached the limit for this type of staffer in your party. Staffers allowed:{" "}
                        {DEFAULT_STAFFER[upgradeStaffer].limitPerParty}
                      </div>
                    );
                  };

                  return (
                    <div className={styles.withArrow} key={upgradeStaffer}>
                      <ArrowForwardIcon boxSize="1.7em" className={styles.arrow} />
                      <div
                        className={classNames(styles.newPosition, {
                          [styles.disabled]: isDisabled,
                          [styles.noCategory]: newStafferCategory === undefined,
                          [styles.voter]: newStafferCategory === "voter" && !isDisabled,
                          [styles.generator]: newStafferCategory === "generator" && !isDisabled,
                          [styles.trainer]: newStafferCategory === "trainer" && !isDisabled,
                          [styles.recruit]: newStafferCategory === "recruit" && !isDisabled,
                          [styles.shadowGovernment]: newStafferCategory === "shadowGovernment" && !isDisabled,
                        })}
                        onClick={isDisabled ? undefined : upgradeStafferCurried(staffer, upgradeStaffer)}
                      >
                        <div>
                          {defaultStaffer.displayName} ({finalCost} PC, {finalTime} days)
                        </div>
                        <div className={styles.description}>
                          {descriptionOfStaffer(resolvedGameModifiers)[upgradeStaffer]}
                        </div>
                        {maybeRenderDisabledExplanation()}
                        {defaultStaffer.limitPerParty !== undefined && (
                          <div className={styles.description}>Limited to {defaultStaffer.limitPerParty} per party </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const maybeRenderStaffersToTrain = () => {
    if (availableToTrain.length === 0) {
      return <div className={styles.noTraineesAvailable}>No staffers available</div>;
    }

    const playerStaffers = fullGameState.activePlayersStaffers[player.playerRid];
    const { votingCapacity, generator, hiring, training } = summaryStaffers(playerStaffers, resolvedGameModifiers);

    return (
      <div className={styles.staffers}>
        <div>
          <div className={styles.categoryTitle}>Hiring - {hiring}</div>
          {renderSingleCategory("recruit")}
        </div>
        <div>
          <div className={styles.categoryTitle}>Training - {training}</div>
          {renderSingleCategory("trainer")}
        </div>
        <div>
          <div className={styles.categoryTitle}>Voters - {votingCapacity} votes</div>
          {renderSingleCategory("voter")}
        </div>
        <div>
          <div className={styles.categoryTitle}>Generators - {roundToThousand(generator).toLocaleString()} PC/day</div>
          {renderSingleCategory("generator")}
        </div>
        <div>
          <div className={styles.categoryTitle}>Shadow government</div>
          {renderSingleCategory("shadowGovernment")}
        </div>
        <div>
          <div className={styles.categoryTitle}>No category</div>
          {renderSingleCategory()}
        </div>
      </div>
    );
  };

  const maybeRenderTrainStaffer = () => {
    if (currentlyTraining.length >= trainer.trainingCapacity) {
      return (
        <div className={classNames(styles.atCapacity, styles.description)}>
          This trainer is at capacity. Please wait for the above events to finish.
        </div>
      );
    }

    return (
      <div className={styles.train}>
        <div className={styles.trainStaffer}>Available staffers to train</div>
        <div className={styles.allTrainingPossibilities}>{maybeRenderStaffersToTrain()}</div>
      </div>
    );
  };

  const politicalCapitalCost = (() => {
    if (upgradeStafferToLevel === undefined) {
      return;
    }

    return resolvedGameModifiers[upgradeStafferToLevel.toLevel].costToAcquire;
  })();

  const maybeRenderTrainStafferBody = () => {
    if (upgradeStafferToLevel === undefined || politicalCapitalCost === undefined) {
      return;
    }

    const toLevelStaffer = DEFAULT_STAFFER[upgradeStafferToLevel.toLevel];

    const finalTime = resolvedGameModifiers[upgradeStafferToLevel.toLevel].timeToAcquire;
    const finalPoliticalCapital = roundToHundred(currentPoliticalCapital - politicalCapitalCost);

    return (
      <div className={styles.modalBody}>
        <div className={styles.modalSentence}>
          <div>{trainer.displayName}</div>
          <div className={styles.description}>to train</div>
          <div>{upgradeStafferToLevel.activeStaffer.stafferDetails.displayName}</div>
        </div>
        <div className={styles.modalSentence}>
          <div className={styles.description}>from</div>
          <div>{DEFAULT_STAFFER[upgradeStafferToLevel.activeStaffer.stafferDetails.type].displayName}</div>
          <div className={styles.description}>to</div>
          <div>{toLevelStaffer.displayName}</div>
        </div>
        <div className={styles.modalSentence}>
          <div className={styles.description}>Costs</div>
          <div className={styles.cost}>{politicalCapitalCost} political capital</div>
          <div className={styles.description}>and </div>
          <div>{finalTime} days to finish</div>
        </div>
        <div className={styles.result}>
          <div className={styles.modalSentence}>
            <div className={styles.description}>Current PC</div>
            <div>{roundToHundred(currentPoliticalCapital).toLocaleString()}</div>
          </div>
          <div className={styles.modalSentence}>
            <div className={styles.description}>Remaining</div>
            <div className={classNames({ [styles.cost]: finalPoliticalCapital < 0 })}>
              {finalPoliticalCapital.toLocaleString()}
            </div>
          </div>
          <div className={styles.modalSentence}>
            <div className={styles.description}>Available on</div>
            <div>{getFakeDate((currentDate + finalTime) as IGameClock)}</div>
          </div>
        </div>
      </div>
    );
  };

  const onConfirmTrainStaffer = async () => {
    if (upgradeStafferToLevel === undefined) {
      return;
    }

    setIsLoading(true);
    const newTrainStaffer = checkIsError(
      await PoliticalCapitalTwoServiceFrontend.trainStaffer({
        gameStateRid: trainerRequest.gameStateRid,
        trainRequest: {
          activeStafferRid: upgradeStafferToLevel.activeStaffer.activeStafferRid,
          playerRid: trainerRequest.playerRid,
          toLevel: upgradeStafferToLevel.toLevel,
          trainerRid: trainerRequest.trainerRid,
        },
      }),
      toast,
    );
    setIsLoading(false);

    if (newTrainStaffer === undefined || politicalCapitalCost === undefined) {
      return;
    }

    batch(() => {
      dispatch(payPoliticalCapital({ cost: politicalCapitalCost, playerRid: trainerRequest.playerRid }));

      dispatch(
        addGameEventToStaffer({
          activeStafferRid: trainerRequest.trainerRid,
          playerRid: trainerRequest.playerRid,
          resolveGameEvent: newTrainStaffer.pendingEvent,
        }),
      );
      dispatch(
        addGameEventToStaffer({
          activeStafferRid: upgradeStafferToLevel.activeStaffer.activeStafferRid,
          playerRid: trainerRequest.playerRid,
          resolveGameEvent: newTrainStaffer.pendingEvent,
        }),
      );
    });

    closeModal();
  };

  const canAfford = (() => {
    if (politicalCapitalCost === undefined) {
      return false;
    }

    return currentPoliticalCapital - politicalCapitalCost >= 0;
  })();

  return (
    <div>
      {maybeRenderCurrentlyTraining()}
      {maybeRenderTrainStaffer()}
      <Modal isOpen={upgradeStafferToLevel !== undefined} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm training</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{maybeRenderTrainStafferBody()}</ModalBody>
          <ModalFooter>
            {fullGameState.gameState.state === "paused" && <div className={styles.pausedGame}>The game is paused</div>}
            <Button
              colorScheme="green"
              disabled={fullGameState.gameState.state !== "active" || !canAfford}
              isLoading={isLoading}
              onClick={onConfirmTrainStaffer}
            >
              Train staffer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
