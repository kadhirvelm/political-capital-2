/**
 * Copyright (c) 2022 - KM
 */

import { Card } from "@chakra-ui/react";
import { DEFAULT_STAFFER, getStafferCategory, IActiveStaffer, isVoter } from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { getActiveResolution } from "../../selectors/resolutions";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { isStafferBusy } from "../../utility/isStafferBusy";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { MinimalResolveEvent } from "../activeGame/ResolveEvent";
import styles from "./StafferCard.module.scss";
import { StafferName } from "./StafferName";

export const StafferCard: React.FC<{ staffer: IActiveStaffer; isPlayerStaffer?: boolean }> = ({
    staffer,
    isPlayerStaffer,
}) => {
    const stafferCategory = getStafferCategory(staffer.stafferDetails);

    const playerRid = usePoliticalCapitalSelector((s) => s.playerState.player?.playerRid);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const activeResolution = usePoliticalCapitalSelector(getActiveResolution);

    const maybeActiveEvents = (() => {
        if (resolveEvents === undefined || !isPlayerStaffer || playerRid === undefined) {
            return [];
        }

        return (
            resolveEvents.players[playerRid]?.staffers[staffer.activeStafferRid]?.filter(
                (event) => event.state === "active" || event.state === "pending",
            ) ?? []
        );
    })();

    const isBusy = isStafferBusy(staffer, resolveEvents, playerRid, fullGameState, activeResolution);

    const maybeRenderEvents = () => {
        if (isVoter(staffer) && isBusy) {
            return (
                <div className={styles.busyContainer}>
                    <div>Voted on {activeResolution?.resolutionDetails.title}</div>
                </div>
            );
        }

        if (maybeActiveEvents.length === 0) {
            return undefined;
        }

        return (
            <div className={styles.busyContainer}>
                {maybeActiveEvents.map((event, index) => (
                    <MinimalResolveEvent
                        event={event}
                        key={event.eventDetails.type + index.toString()}
                        activeStafferRid={staffer.activeStafferRid}
                    />
                ))}
            </div>
        );
    };

    return (
        <Card
            className={classNames(styles.stafferCard, {
                [styles.voter]: stafferCategory === "voter",
                [styles.generator]: stafferCategory === "generator",
                [styles.trainer]: stafferCategory === "trainer",
                [styles.recruit]: stafferCategory === "recruit",
                [styles.shadowGovernment]: stafferCategory === "shadowGovernment",
                [styles.isBusy]: isBusy,
            })}
        >
            <div className={styles.name}>
                <StafferName staffer={staffer} />
            </div>
            <div className={styles.description}>
                {descriptionOfStaffer(resolvedGameModifiers)[staffer.stafferDetails.type]}
            </div>
            {maybeRenderEvents()}
            <div className={styles.footer}>{DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>
        </Card>
    );
};
