/*
 * Copyright 2023 KM.
 */

import { MinusIcon } from "@chakra-ui/icons";
import {
  allGenerators,
  allRecruits,
  allShadowGovernment,
  allTrainers,
  allVoters,
  DEFAULT_STAFFER,
  getStafferCategory,
  type IGameModifier,
  type IStafferEffect,
} from "@pc2/api";
import classNames from "classnames";
import styles from "./GameModifier.module.scss";
import React from "react";

export const GameModifier = ({
  gameModifier,
  isGlobalScreen,
}: {
  gameModifier?: IGameModifier;
  isGlobalScreen?: boolean;
}) => {
  if (gameModifier === undefined) {
    return;
  }

  const renderAdjective = (percent: number) => {
    if (percent > 0) {
      return <div>Increase</div>;
    }

    return <div>Decrease</div>;
  };

  const renderPercent = (percent: number) => {
    if (percent > 0) {
      return (
        <div className={classNames(styles.modifierSentence, { [styles.isGlobalScreen]: isGlobalScreen })}>
          <span>by</span>
          <div className={styles.positive}>{percent}%</div>
        </div>
      );
    }

    return (
      <div className={classNames(styles.modifierSentence, { [styles.isGlobalScreen]: isGlobalScreen })}>
        <span>by</span>
        <div className={styles.negative}>{percent}%</div>
      </div>
    );
  };

  const maybeRenderModifier = (numberChange: number | undefined, description: string) => {
    if (numberChange === undefined) {
      return;
    }

    const percent = numberChange * 100;
    return (
      <div className={classNames(styles.modifierSentence, { [styles.isGlobalScreen]: isGlobalScreen })}>
        <div>{renderAdjective(percent)}</div>
        <div>{description}</div>
        <div>{renderPercent(percent)}</div>
      </div>
    );
  };

  if (gameModifier.type === "resolution-effect") {
    return (
      <div className={styles.resolutionModifierContainer}>
        {maybeRenderModifier(gameModifier.timePerResolution, "time per resolution")}
        {maybeRenderModifier(gameModifier.timeBetweenResolutions, "time between resolutions")}
        {maybeRenderModifier(gameModifier.payoutPerResolution, "total political capital per resolution")}
        {maybeRenderModifier(gameModifier.payoutPerPlayer, "political capital voting payout")}
        {maybeRenderModifier(gameModifier.earlyVotingBonus, "early voting bonus")}
      </div>
    );
  }

  const renderStaffer = (staffer: IStafferEffect["staffersAffected"][number]) => {
    if (staffer === "everyone") {
      return (
        <div className={classNames(styles.categoryTag, styles.noCategory)} key="everyone">
          Everyone
        </div>
      );
    }

    if (staffer === "voter") {
      return (
        <div className={classNames(styles.categoryTag, styles.voter)} key="generator">
          All voters: {allVoters.map((s) => s.displayName).join(", ")}
        </div>
      );
    }

    if (staffer === "generator") {
      return (
        <div className={classNames(styles.categoryTag, styles.generator)} key="generator">
          All generators: {allGenerators.map((s) => s.displayName).join(", ")}
        </div>
      );
    }

    if (staffer === "recruit") {
      return (
        <div className={classNames(styles.categoryTag, styles.recruit)} key="recruit">
          All recruiters: {allRecruits.map((s) => s.displayName).join(", ")}
        </div>
      );
    }

    if (staffer === "trainer") {
      return (
        <div className={classNames(styles.categoryTag, styles.trainer)} key="trainer">
          All trainers: {allTrainers.map((s) => s.displayName).join(", ")}
        </div>
      );
    }

    if (staffer === "shadowGovernment") {
      return (
        <div className={classNames(styles.categoryTag, styles.shadowGovernment)} key="shadowGovernment">
          All shadow government: {allShadowGovernment.map((s) => s.displayName).join(", and ")}
        </div>
      );
    }

    const defaultStaffer = DEFAULT_STAFFER[staffer];
    const stafferCategory = getStafferCategory(defaultStaffer);

    return (
      <div
        className={classNames(styles.categoryTag, {
          [styles.noCategory]: stafferCategory === undefined,
          [styles.voter]: stafferCategory === "voter",
          [styles.generator]: stafferCategory === "generator",
          [styles.trainer]: stafferCategory === "trainer",
          [styles.recruit]: stafferCategory === "recruit",
          [styles.shadowGovernment]: stafferCategory === "shadowGovernment",
        })}
        key={staffer}
      >{`${DEFAULT_STAFFER[staffer].displayName}s`}</div>
    );
  };

  return (
    <div className={styles.stafferModifierContainer}>
      {maybeRenderModifier(gameModifier.costToAcquire, "political capital cost")}
      {maybeRenderModifier(gameModifier.timeToAcquire, "time to hire")}
      {maybeRenderModifier(gameModifier.effectiveness, "effectiveness")}
      {gameModifier.disableHiring !== undefined && (
        <div className={styles.negative}>
          <MinusIcon className={styles.minusIcon} />
          Prevents hiring of
        </div>
      )}
      {gameModifier.disableTraining !== undefined && (
        <div className={styles.negative}>
          <MinusIcon className={styles.minusIcon} />
          Prevents training of
        </div>
      )}
      <div className={styles.stafferModifier}>
        <div className={styles.affects}>Affects</div>
        {gameModifier.staffersAffected.map((s) => renderStaffer(s))}
      </div>
    </div>
  );
};
