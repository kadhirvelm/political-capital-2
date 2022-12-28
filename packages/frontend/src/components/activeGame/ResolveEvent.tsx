/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, IEvent } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { isResolveGameEvent, IUserFacingResolveEvents } from "../../store/gameState";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { getFakeDate } from "../common/ServerStatus";
import styles from "./ResolveEvent.module.scss";

export const ResolveEvent: React.FC<{ event: IUserFacingResolveEvents }> = ({ event }) => {
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    if (player === undefined || fullGameState === undefined) {
        return null;
    }

    const renderEventDetails = () => {
        return IEvent.visit(event.eventDetails, {
            startHiringStaffer: (startHiring) => (
                <div>
                    <div className={styles.title}>Send out a job posting for a</div>
                    <div>{DEFAULT_STAFFER[startHiring.stafferType].displayName}</div>
                    <div className={styles.description}>{descriptionOfStaffer[startHiring.stafferType]}</div>
                </div>
            ),
            finishHiringStaffer: (finishHiring) => {
                const hiringStaffer = fullGameState.activePlayersStaffers[player.playerRid].find(
                    (staffer) => staffer.activeStafferRid === finishHiring.activeStafferRid,
                );

                return (
                    <div>
                        <div className={styles.title}>Sign contract with</div>
                        <div>{hiringStaffer?.stafferDetails.displayName}</div>
                        <div>
                            {hiringStaffer !== undefined &&
                                DEFAULT_STAFFER[hiringStaffer.stafferDetails.type].displayName}
                        </div>
                        <div className={styles.description}>
                            {hiringStaffer !== undefined && descriptionOfStaffer[hiringStaffer.stafferDetails.type]}
                        </div>
                    </div>
                );
            },
            startTrainingStaffer: () => <div />,
            finishTrainingStaffer: () => <div />,
            newResolution: () => <div />,
            tallyResolution: () => <div />,
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
