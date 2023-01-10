/**
 * Copyright (c) 2022 - KM
 */

import { Avatar, Card } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IActiveStaffer, isVoter } from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { getActiveResolution } from "../../selectors/resolutions";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getStafferCategory } from "../../utility/categorizeStaffers";
import { isStafferBusy } from "../../utility/isStafferBusy";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { MinimalResolveEvent } from "../activeGame/ResolveEvent";
import styles from "./StafferCard.module.scss";

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
                [styles.voting]: stafferCategory === "voting",
                [styles.generator]: stafferCategory === "generator",
                [styles.support]: stafferCategory === "support",
                [styles.isBusy]: isBusy,
            })}
        >
            <div className={styles.name}>
                <Avatar
                    size="md"
                    name={staffer.stafferDetails.displayName}
                    showBorder
                    src={`https://robohash.org/${staffer.stafferDetails.displayName}?set=set${staffer.avatarSet}`}
                />
                {staffer.stafferDetails.displayName}
            </div>
            <div className={styles.description}>
                {descriptionOfStaffer(resolvedGameModifiers)[staffer.stafferDetails.type]}
            </div>
            {maybeRenderEvents()}
            <div className={styles.footer}>{DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>
        </Card>
    );
};
