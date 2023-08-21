/*
 * Copyright 2023 KM.
 */

import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import {
  getStafferCategory,
  type IActiveStaffer,
  type IBasicStaffer,
  type IRecruit,
  isRecruit,
  isTrainer,
  type ITrainer,
} from "@pc2/api";
import classNames from "classnames";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { StafferName } from "../common/StafferName";
import styles from "./ActivateStaffer.module.scss";
import { RecruiterActivation } from "./RecruiterActivation";
import { TrainerActivation } from "./TrainerActivation";
import React from "react";

export const ActivateStaffer = ({
  activateStaffer,
  onBack,
}: {
  activateStaffer: IActiveStaffer;
  onBack: () => void;
}) => {
  const player = usePoliticalCapitalSelector((s) => s.playerState.player);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
  const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

  if (player === undefined || fullGameState === undefined || resolveEvents === undefined) {
    return;
  }

  const renderStafferActivationSpecifics = () => {
    if (isRecruit(activateStaffer)) {
      return (
        <RecruiterActivation
          recruitRequest={{
            gameStateRid: fullGameState.gameState.gameStateRid,
            playerRid: player.playerRid,
            recruiterRid: activateStaffer.activeStafferRid,
          }}
          recruiter={activateStaffer.stafferDetails as IBasicStaffer & IRecruit}
          resolveGameEvents={resolveEvents.players[player.playerRid]?.staffers[activateStaffer.activeStafferRid] ?? []}
        />
      );
    }

    if (isTrainer(activateStaffer)) {
      return (
        <TrainerActivation
          resolveGameEvents={resolveEvents.players[player.playerRid]?.staffers[activateStaffer.activeStafferRid] ?? []}
          trainer={activateStaffer.stafferDetails as IBasicStaffer & ITrainer}
          trainerRequest={{
            gameStateRid: fullGameState.gameState.gameStateRid,
            playerRid: player.playerRid,
            trainerRid: activateStaffer.activeStafferRid,
          }}
        />
      );
    }
  };

  const categoryOfStaffer = getStafferCategory(activateStaffer);

  return (
    <div className={styles.activateStaffer}>
      <div className={styles.onBack}>
        <Button leftIcon={<ChevronLeftIcon />} onClick={onBack}>
          Back
        </Button>
      </div>
      <div
        className={classNames(styles.activatingStaffer, {
          [styles.trainer]: categoryOfStaffer === "trainer",
          [styles.recruit]: categoryOfStaffer === "recruit",
        })}
      >
        <StafferName showDescription showType staffer={activateStaffer} />
      </div>
      {renderStafferActivationSpecifics()}
    </div>
  );
};
