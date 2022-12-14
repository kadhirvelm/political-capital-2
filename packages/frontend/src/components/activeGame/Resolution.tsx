/**
 * Copyright (c) 2022 - KM
 */

import { Card, CardBody } from "@chakra-ui/react";
import { IActiveResolution, IEvent } from "@pc2/api";
import classNames from "classnames";
import { flatten } from "lodash-es";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { roundToHundred } from "../../utility/roundTo";
import { getFakeDate } from "../common/ServerStatus";
import { GameModifier } from "./GameModifier";
import styles from "./Resolution.module.scss";

export const Resolution: React.FC<{ resolution: IActiveResolution; isGlobalScreen?: boolean }> = ({
    resolution,
    isGlobalScreen,
}) => {
    const votesOnResolution = usePoliticalCapitalSelector((s) =>
        flatten(
            Object.values(s.localGameState.fullGameState?.activePlayersVotes[resolution.activeResolutionRid] ?? {}),
        ),
    );
    const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);
    const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

    if (resolveEvents === undefined || fullGameState === undefined) {
        return null;
    }

    const playerParty = player !== undefined ? fullGameState.activePlayersStaffers[player.playerRid] : [];

    const tallyOnEvent = resolveEvents.game.find(
        (event) =>
            IEvent.isTallyResolution(event.eventDetails) &&
            event.eventDetails.activeResolutionRid === resolution?.activeResolutionRid,
    );

    const maybeRenderTotalVotesCast = () => {
        if (votesOnResolution.length === 0) {
            return <div className={classNames(styles.totalVotes, styles.description)}>No votes cast yet</div>;
        }

        const hasInformant = playerParty.find((p) => p.stafferDetails.type === "informant")?.state === "active";
        const canViewResolution = hasInformant || resolution.state !== "active";

        if (!canViewResolution) {
            return <div className={classNames(styles.totalVotes, styles.description)}>Some votes have been cast</div>;
        }

        const totalYes = votesOnResolution.filter((vote) => vote.vote === "passed").length;
        // const totalAbstain = votesOnResolution.filter((vote) => vote.vote === "abstain").length;
        const totalNo = votesOnResolution.filter((vote) => vote.vote === "failed").length;

        const willPass = totalYes > totalNo;

        return (
            <div className={styles.totalVotes}>
                <div className={styles.onTrack}>
                    <div>Votes cast</div>
                </div>
                <div className={styles.singleVoteCategory}>
                    <div className={styles.total}>Total</div>
                    <div className={styles.divider} />
                    <div>{votesOnResolution.length}</div>
                </div>
                <div className={styles.singleVoteCategory}>
                    <div className={styles.yes}>Yes</div>
                    <div className={styles.divider} />
                    <div>{totalYes}</div>
                </div>
                {/* <div className={styles.singleVoteCategory}>
                    <div className={styles.abstain}>Abstain</div>
                    <div className={styles.divider} />
                    <div>{totalAbstain}</div>
                </div> */}
                <div className={styles.singleVoteCategory}>
                    <div className={styles.no}>No</div>
                    <div className={styles.divider} />
                    <div>{totalNo}</div>
                </div>
                {resolution.state === "active" && (
                    <div className={styles.onTrackTo}>
                        <div className={styles.description}>On track to</div>
                        <div className={styles.divider} />
                        <div className={classNames({ [styles.yes]: willPass, [styles.no]: !willPass })}>
                            {willPass ? "Pass" : "Fail"}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderFooter = () => {
        if (resolution.state === "active") {
            return (
                <div className={styles.payoutContainer}>
                    <div>
                        <span className={styles.description}>PC per vote</span>
                        <span className={styles.politicalCapitalPayout}>
                            {roundToHundred(
                                resolution.resolutionDetails.politicalCapitalPayout *
                                    resolvedGameModifiers.game.payoutPerResolution,
                            ).toLocaleString()}
                        </span>
                    </div>
                    <div className={styles.tallyContainer}>
                        <div className={styles.tallyOn}>Will tally on</div>
                        {tallyOnEvent !== undefined ? getFakeDate(tallyOnEvent.resolvesOn) : "Pending"}
                    </div>
                    {maybeRenderTotalVotesCast()}
                </div>
            );
        }

        const passedOn = resolveEvents.game.find(
            (event) =>
                event.state === "complete" &&
                event.eventDetails.type === "tally-resolution" &&
                event.eventDetails.activeResolutionRid === resolution.activeResolutionRid,
        );

        return (
            <div className={styles.finalResults}>
                <div
                    className={classNames({
                        [styles.passed]: resolution.state === "passed",
                        [styles.failed]: resolution.state === "failed",
                    })}
                >
                    {resolution.state.toUpperCase()}{" "}
                    {passedOn !== undefined && ` on ${getFakeDate(passedOn.resolvesOn)}`}
                </div>
                {maybeRenderTotalVotesCast()}
            </div>
        );
    };

    return (
        <Card className={styles.cardContainer} variant="elevated">
            <CardBody>
                <div className={styles.title}>{resolution.resolutionDetails.title}</div>
                <div className={styles.description}>{resolution.resolutionDetails.description}</div>
                <div className={styles.resolutionFooter}>
                    <GameModifier
                        gameModifier={resolution.resolutionDetails.gameModifier}
                        isGlobalScreen={isGlobalScreen}
                    />
                    {renderFooter()}
                </div>
            </CardBody>
        </Card>
    );
};
