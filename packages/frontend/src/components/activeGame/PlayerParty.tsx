/**
 * Copyright (c) 2022 - KM
 */

import { ArrowRightIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { IActiveStaffer, IPlayerRid } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getStaffersOfCategory, IStafferCategory } from "../../utility/categorizeStaffers";
import { StafferCard } from "../common/StafferCard";
import { ActivateStaffer } from "./ActivateStaffer";
import styles from "./PlayerParty.module.scss";

export const PlayerParty: React.FC<{ playerRid: IPlayerRid }> = ({ playerRid }) => {
    const [activatingStaffer, setActivatingStaffer] = React.useState<IActiveStaffer | undefined>(undefined);

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const isViewingSelf = player?.playerRid === playerRid;

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    if (fullGameState === undefined) {
        return null;
    }

    const activePlayer = fullGameState.activePlayers[playerRid];
    const playerStaffers = fullGameState.activePlayersStaffers[playerRid];

    const onBack = () => setActivatingStaffer(undefined);
    const activateStaffer = (staffer: IActiveStaffer) => () => setActivatingStaffer(staffer);

    const renderCategory = (category: IStafferCategory) => {
        const staffersInCategory = getStaffersOfCategory(playerStaffers, category);
        if (staffersInCategory.length === 0) {
            return <div className={styles.noneFound}>None found</div>;
        }

        return (
            <div className={styles.staffersInCategory}>
                {staffersInCategory.map((staffer) => {
                    const canActivateCard = isViewingSelf && category === "support";
                    return (
                        <div className={styles.activateStafferContainer} key={staffer.activeStafferRid}>
                            <StafferCard staffer={staffer} />
                            {canActivateCard && (
                                <Button className={styles.chevronRight} onClick={activateStaffer(staffer)}>
                                    <ArrowRightIcon />
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderBody = () => {
        if (activatingStaffer !== undefined) {
            return <ActivateStaffer activateStaffer={activatingStaffer} onBack={onBack} />;
        }

        return (
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
            {renderBody()}
        </div>
    );
};
