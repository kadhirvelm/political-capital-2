/**
 * Copyright (c) 2022 - KM
 */

import { Card } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IActiveStaffer } from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getStafferCategory } from "../../utility/categorizeStaffers";
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

    const isBusy = maybeActiveEvents.length > 0;

    const maybeRenderEvents = () => {
        if (maybeActiveEvents.length === 0) {
            return undefined;
        }

        return (
            <div className={styles.busyContainer}>
                {maybeActiveEvents.map((event, index) => (
                    <MinimalResolveEvent event={event} key={event.eventDetails.type + index.toString()} />
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
            <div className={styles.name}>{staffer.stafferDetails.displayName}</div>
            <div className={styles.description}>{descriptionOfStaffer[staffer.stafferDetails.type]}</div>
            {maybeRenderEvents()}
            <div className={styles.footer}>{DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>
        </Card>
    );
};
