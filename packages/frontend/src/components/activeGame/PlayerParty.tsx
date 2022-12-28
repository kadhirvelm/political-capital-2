/**
 * Copyright (c) 2022 - KM
 */

import { IPlayerRid } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getStaffersOfCategory, IStafferCategory } from "../../utility/categorizeStaffers";
import { StafferCard } from "../common/StafferCard";
import styles from "./PlayerParty.module.scss";

export const PlayerParty: React.FC<{ playerRid: IPlayerRid }> = ({ playerRid }) => {
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    if (fullGameState === undefined) {
        return null;
    }

    const activePlayer = fullGameState.activePlayers[playerRid];
    const playerStaffers = fullGameState.activePlayersStaffers[playerRid];

    const renderCategory = (category: IStafferCategory) => {
        const staffersInCategory = getStaffersOfCategory(playerStaffers, category);
        if (staffersInCategory.length === 0) {
            return <div className={styles.noneFound}>None found</div>;
        }

        return (
            <div className={styles.staffersInCategory}>
                {staffersInCategory.map((staffer) => (
                    <StafferCard staffer={staffer} key={staffer.activeStafferRid} />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className={styles.resourcesContainer}>
                <div className={styles.singleResource}>
                    <div>Political capital</div>
                    <div>{activePlayer.politicalCapital}</div>
                </div>
                <div className={styles.singleResource}>
                    <div>Approval rating</div>
                    <div>{activePlayer.approvalRating}</div>
                </div>
            </div>
            <div className={styles.staffers}>
                <div>
                    <div className={styles.categoryTitle}>Support</div>
                    {renderCategory("support")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Voters</div>
                    {renderCategory("voting")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Generators</div>
                    {renderCategory("generator")}
                </div>
            </div>
        </div>
    );
};
