/**
 * Copyright (c) 2022 - KM
 */

import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { IActiveStaffer, IPlayerRid, isRecruit, IStafferCategory, isTrainer } from "@pc2/api";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getStaffersOfCategory } from "../../utility/categorizeStaffers";
import { summaryStaffers } from "../../utility/partySummarizer";
import { roundToHundred, roundToThousand } from "../../utility/roundTo";
import { StafferCard } from "../common/StafferCard";
import { PlayerName } from "../common/StafferName";
import { ActivateStaffer } from "./ActivateStaffer";
import { PartySummary } from "./PartySummary";
import styles from "./PlayerParty.module.scss";
import { FC, useState } from "react";

export const PlayerParty: FC<{ playerRid: IPlayerRid }> = ({ playerRid }) => {
    const [activatingStaffer, setActivatingStaffer] = useState<IActiveStaffer | undefined>(undefined);

    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const isViewingSelf = player?.playerRid === playerRid;

    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (fullGameState === undefined) {
        return null;
    }

    const playerDetails = fullGameState.players[playerRid];
    const activePlayer = fullGameState.activePlayers[playerRid];
    const playerStaffers = fullGameState.activePlayersStaffers[playerRid];

    const onBack = () => setActivatingStaffer(undefined);
    const activateStaffer = (staffer: IActiveStaffer) => () => setActivatingStaffer(staffer);

    const renderCategory = (category: IStafferCategory | undefined) => {
        const staffersInCategory = getStaffersOfCategory(playerStaffers, category, resolvedGameModifiers);
        if (staffersInCategory.length === 0) {
            return <div className={styles.noneFound}>None found</div>;
        }

        return (
            <div className={styles.staffersInCategory}>
                {staffersInCategory.map((staffer) => {
                    const canActivateCard =
                        isViewingSelf &&
                        (category === "recruit" || category === "trainer") &&
                        staffer.state === "active";
                    const effectiveness = resolvedGameModifiers[staffer.stafferDetails.type].effectiveness;

                    const canActivateMore = (() => {
                        if (!canActivateCard) {
                            return false;
                        }

                        const activeEvents =
                            resolveEvents?.players[playerRid]?.staffers[staffer.activeStafferRid]?.filter(
                                (e) => e.state === "active" || e.state === "pending",
                            ) ?? [];

                        return effectiveness > activeEvents.length;
                    })();

                    return (
                        <div className={styles.activateStafferContainer} key={staffer.activeStafferRid}>
                            <StafferCard staffer={staffer} isPlayerStaffer={player?.playerRid === playerRid} />
                            {canActivateCard && (
                                <Button
                                    className={styles.chevronRight}
                                    colorScheme={canActivateMore ? "green" : undefined}
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

        const { votingCapacity, generator, hiring, training } = summaryStaffers(playerStaffers, resolvedGameModifiers);

        return (
            <div className={styles.staffers}>
                <div>
                    <div className={styles.categoryTitle}>Hiring - {hiring}</div>
                    {renderCategory("recruit")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Training - {training}</div>
                    {renderCategory("trainer")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Voters - {votingCapacity} votes</div>
                    {renderCategory("voter")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>
                        Generators - {roundToThousand(generator).toLocaleString()} PC/day
                    </div>
                    {renderCategory("generator")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>Shadow government</div>
                    {renderCategory("shadowGovernment")}
                </div>
                <div>
                    <div className={styles.categoryTitle}>No category</div>
                    {renderCategory(undefined)}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.overallContainer}>
            <div className={styles.withPlayerName}>
                <PlayerName player={playerDetails} activePlayer={activePlayer} />
                <div className={styles.resourcesContainer}>
                    <div className={styles.name}>{playerDetails.name}</div>
                    <div className={styles.singleResource}>
                        <div>Political capital</div>
                        <div>{roundToHundred(activePlayer.politicalCapital).toLocaleString()}</div>
                    </div>
                    <PartySummary playerRid={playerRid} />
                </div>
            </div>
            {renderBody()}
        </div>
    );
};
