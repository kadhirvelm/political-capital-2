/**
 * Copyright (c) 2022 - KM
 */

import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Card, CardBody } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IEvent } from "@pc2/api";
import { IGameModifier, IStafferEffect } from "@pc2/api/dist/types/IResolutionEffect";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getFakeDate } from "../common/ServerStatus";
import styles from "./ActiveResolution.module.scss";

const GameModifier: React.FC<{ gameModifier?: IGameModifier }> = ({ gameModifier }) => {
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
                <div>
                    by <AddIcon />
                    <div>{percent}</div>
                </div>
            );
        }

        return (
            <div>
                by <MinusIcon />
                <div>{percent}%</div>
            </div>
        );
    };

    const maybeRenderModifier = (numberChange: number | undefined, description: string) => {
        if (numberChange === undefined) {
            return undefined;
        }

        const percent = numberChange * 100;
        return (
            <div>
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

    const renderStaffer = (staffer: IStafferEffect["staffersAffected"][number]) => {
        if (staffer === "everyone") {
            return <div>All staffers</div>;
        }

        if (staffer === "voter") {
            return <div>All voters</div>;
        }

        if (staffer === "generator") {
            return <div>All generators</div>;
        }

        if (staffer === "recruit") {
            return <div>All recruiters</div>;
        }

        if (staffer === "trainer") {
            return <div>All trainers</div>;
        }

        return DEFAULT_STAFFER[staffer].displayName;
    };

    return (
        <div className={styles.stafferModifierContainer}>
            {maybeRenderModifier(gameModifier.costToAcquire, "political capital cost")}
            {maybeRenderModifier(gameModifier.timeToAcquire, "time to hire")}
            {maybeRenderModifier(gameModifier.effectiveness, "effectiveness")}
            {gameModifier.disableHiring !== undefined && <div>Prevents hiring of</div>}
            {gameModifier.disableTraining !== undefined && <div>Disables training of</div>}
            {/* {gameModifier.removeAll !== undefined && <div>Removes all existing staffers</div>} */}
            <div>{gameModifier.staffersAffected.map(renderStaffer)}</div>
        </div>
    );
};

export const ActiveResolution: React.FC<{}> = () => {
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (fullGameState === undefined || resolveEvents === undefined) {
        return null;
    }

    const activeResolution = fullGameState.activeResolutions.find((resolution) => resolution.state === "active");
    const tallyOnEvent = resolveEvents.game.find(
        (event) =>
            IEvent.isTallyResolution(event.eventDetails) &&
            event.eventDetails.activeResolutionRid === activeResolution?.activeResolutionRid,
    );

    if (activeResolution === undefined || tallyOnEvent === undefined) {
        return <div>No active resolution</div>;
    }

    return (
        <div>
            <Card variant="elevated">
                <CardBody>
                    <div className={styles.title}>{activeResolution.resolutionDetails.title}</div>
                    <div className={styles.description}>{activeResolution.resolutionDetails.description}</div>
                    <div className={styles.resolutionFooter}>
                        <GameModifier gameModifier={activeResolution.resolutionDetails.gameModifier} />
                        <div>
                            <span className={styles.description}>PC per vote</span>
                            <span className={styles.politicalCapitalPayout}>
                                {activeResolution.resolutionDetails.politicalCapitalPayout}
                            </span>
                        </div>
                        <div className={styles.tallyContainer}>
                            <div className={styles.tallyOn}>Will tally on</div>
                            {getFakeDate(tallyOnEvent.resolvesOn)}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};
