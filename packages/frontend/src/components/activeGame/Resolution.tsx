/**
 * Copyright (c) 2022 - KM
 */

import { Card, CardBody } from "@chakra-ui/react";
import { IActiveResolution, IEvent } from "@pc2/api";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { getFakeDate } from "../common/ServerStatus";
import { GameModifier } from "./GameModifier";
import styles from "./Resolution.module.scss";

export const Resolution: React.FC<{ resolution: IActiveResolution }> = ({ resolution }) => {
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);

    if (resolveEvents === undefined) {
        return null;
    }

    const tallyOnEvent = resolveEvents.game.find(
        (event) =>
            IEvent.isTallyResolution(event.eventDetails) &&
            event.eventDetails.activeResolutionRid === resolution?.activeResolutionRid,
    );

    return (
        <Card variant="elevated">
            <CardBody>
                <div className={styles.title}>{resolution.resolutionDetails.title}</div>
                <div className={styles.description}>{resolution.resolutionDetails.description}</div>
                <div className={styles.resolutionFooter}>
                    <GameModifier gameModifier={resolution.resolutionDetails.gameModifier} />
                    <div>
                        <span className={styles.description}>PC per vote</span>
                        <span className={styles.politicalCapitalPayout}>
                            {resolution.resolutionDetails.politicalCapitalPayout}
                        </span>
                    </div>
                    <div className={styles.tallyContainer}>
                        <div className={styles.tallyOn}>Will tally on</div>
                        {tallyOnEvent !== undefined ? getFakeDate(tallyOnEvent.resolvesOn) : "Pending"}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
