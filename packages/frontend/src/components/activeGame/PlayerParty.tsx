/**
 * Copyright (c) 2022 - KM
 */

import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { IActiveStaffer, IPlayerRid, isRecruit, isTrainer } from "@pc2/api";
import * as React from "react";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getStaffersOfCategory, IStafferCategory } from "../../utility/categorizeStaffers";
import { summaryStaffers } from "../../utility/partySummarizer";
import { roundToHundred, roundToThousand } from "../../utility/roundTo";
import { StafferCard } from "../common/StafferCard";
import { ActivateStaffer } from "./ActivateStaffer";
import { PartySummary } from "./PartySummary";
import styles from "./PlayerParty.module.scss";

export const PlayerParty: React.FC<{ playerRid: IPlayerRid }> = ({ playerRid }) => {
    const [activatingStaffer, setActivatingStaffer] = React.useState<IActiveStaffer | undefined>(undefined);

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const isViewingSelf = player?.playerRid === playerRid;

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

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
                            <StafferCard staffer={staffer} isPlayerStaffer={player?.playerRid === playerRid} />
                            {canActivateCard && (
                                <Button
                                    className={styles.chevronRight}
                                    rightIcon={<ChevronRightIcon />}
                                    onClick={activateStaffer(staffer)}
                                >
                                    {isRecruit(staffer) && "Hire"}
                                    {isTrainer(staffer) && "Train"}
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

        const { votingCapacity, generator, hiring, training } = summaryStaffers(
            playerStaffers,
            resolveEvents,
            playerRid,
        );

        return (
            <div className={styles.staffers}>
                <div>
                    <div className={styles.categoryTitle}>
                        Support - {hiring} Hiring, {training} Training
                    </div>
                    {renderCategory("support")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Voters - {votingCapacity} votes</div>
                    {renderCategory("voting")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>
                        Generators - {roundToThousand(generator).toLocaleString()} PC/day
                    </div>
                    {renderCategory("generator")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Passive</div>
                    {renderCategory("passive")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Other</div>
                    {renderCategory("none")}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.overallContainer}>
            <div className={styles.resourcesContainer}>
                <div className={styles.singleResource}>
                    <div>Political capital</div>
                    <div>{roundToHundred(activePlayer.politicalCapital).toLocaleString()}</div>
                </div>
                {/* <div className={styles.singleResource}>
                    <div>Approval rating</div>
                    <div>{activePlayer.approvalRating}</div>
                </div> */}
                <PartySummary playerRid={playerRid} />
            </div>
            {renderBody()}
        </div>
    );
};
