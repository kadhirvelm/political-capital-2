/**
 * Copyright (c) 2022 - KM
 */

import { MinusIcon } from "@chakra-ui/icons";
import {
    allGenerators,
    allRecruits,
    allShadowGovernment,
    allTrainers,
    allVoters,
    DEFAULT_STAFFER,
    IGameModifier,
    IStafferEffect,
} from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import styles from "./GameModifier.module.scss";

export const GameModifier: React.FC<{ gameModifier?: IGameModifier; isGlobalScreen?: boolean }> = ({
    gameModifier,
    isGlobalScreen,
}) => {
    if (gameModifier === undefined) {
        return null;
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
            return undefined;
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
                {maybeRenderModifier(gameModifier.payoutPerResolution, "political capital payout per vote")}
            </div>
        );
    }

    const renderStaffer = (staffer: IStafferEffect["staffersAffected"][number], index: number) => {
        const maybeRenderAnd = () => (index !== 0 ? ", and " : "");

        if (staffer === "everyone") {
            return <div key="everyone">{maybeRenderAnd()}Everyone</div>;
        }

        if (staffer === "voter") {
            return (
                <div key="voter">
                    {maybeRenderAnd()}
                    {allVoters.join(", and ")}
                </div>
            );
        }

        if (staffer === "generator") {
            return (
                <div key="generator">
                    {maybeRenderAnd()}
                    {allGenerators.map((s) => s.displayName).join(", and ")}
                </div>
            );
        }

        if (staffer === "recruit") {
            return (
                <div key="recruit">
                    {maybeRenderAnd()}
                    {allRecruits.map((s) => s.displayName).join(", and ")}
                </div>
            );
        }

        if (staffer === "trainer") {
            return (
                <div key="trainer">
                    {maybeRenderAnd()}
                    {allTrainers.map((s) => s.displayName).join(", and ")}
                </div>
            );
        }

        if (staffer === "shadowGovernment") {
            return (
                <div key="shadowGovernment">
                    {maybeRenderAnd()}
                    {allShadowGovernment.map((s) => s.displayName).join(", and ")}
                </div>
            );
        }

        return <div key={staffer}>{`${maybeRenderAnd()}${DEFAULT_STAFFER[staffer].displayName}s`}</div>;
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
                {gameModifier.staffersAffected.map(renderStaffer)}
            </div>
        </div>
    );
};
