/**
 * Copyright (c) 2022 - KM
 */

import { Button, useToast } from "@chakra-ui/react";
import {
    IActiveResolutionRid,
    IActiveResolutionVote,
    IActiveStaffer,
    IActiveStafferRid,
    IGameStateRid,
    isVoter,
    PoliticalCapitalTwoServiceFrontend,
} from "@pc2/api";
import classNames from "classnames";
import * as React from "react";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { getVoters, getVotesAlreadyCast } from "../../selectors/getVoters";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addVotes } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { getEffectivenessNumber } from "../../utility/gameModifiers";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import { StafferName } from "../common/StafferName";
import styles from "./PlayerVoters.module.scss";
import { ResolveEvent } from "./ResolveEvent";

export const PlayerVoters: React.FC<{
    gameStateRid: IGameStateRid;
    activeResolutionRid: IActiveResolutionRid | undefined;
}> = ({ gameStateRid, activeResolutionRid }) => {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const isPaused = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState?.gameState.state !== "active");
    const voters = usePoliticalCapitalSelector(getVoters);
    const votesCastByPlayerVoters = usePoliticalCapitalSelector(getVotesAlreadyCast(activeResolutionRid));
    const votesAlreadyCastOnResolution = usePoliticalCapitalSelector((s) => {
        if (activeResolutionRid === undefined) {
            return undefined;
        }

        return s.localGameState.fullGameState?.activePlayersVotes?.[activeResolutionRid];
    });
    const activeResolution = usePoliticalCapitalSelector((s) =>
        s.localGameState.fullGameState?.activeResolutions.find((r) => r.activeResolutionRid === activeResolutionRid),
    );
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

    const [isLoading, setIsLoading] = React.useState(false);

    const [castVotes, setCastVotes] = React.useState<{
        [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote["vote"];
    }>({});

    const getStafferExistingVote = (activeStafferRid: IActiveStafferRid) =>
        votesAlreadyCastOnResolution?.[activeStafferRid]?.[0];

    React.useEffect(() => {
        const newCastVotesDefaultState: { [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote["vote"] } = {};

        voters.forEach((voter) => {
            const maybeExistingVote = getStafferExistingVote(voter.staffer.activeStafferRid);
            newCastVotesDefaultState[voter.staffer.activeStafferRid] =
                maybeExistingVote?.vote ?? castVotes[voter.staffer.activeStafferRid] ?? "abstain";
        });

        setCastVotes(newCastVotesDefaultState);
    }, [voters]);

    const renderIndependentVotes = (totalVotes: number) => {
        return (
            <div className={styles.independentVoter}>
                <div>{totalVotes} Yes</div>
                <div className={styles.description}>and</div>
                <div>{totalVotes} No</div>
            </div>
        );
    };

    const onSwitchVote = (activeStafferRid: IActiveStafferRid, newVote: IActiveResolutionVote["vote"]) => () => {
        const maybeExistingVote = getStafferExistingVote(activeStafferRid);
        if (maybeExistingVote !== undefined || newVote === "abstain") {
            return;
        }

        setCastVotes({ ...castVotes, [activeStafferRid]: newVote });
    };

    const renderNormalVotes = (voter: IActiveStaffer, totalVotes: number) => {
        const stafferVote = castVotes[voter.activeStafferRid] ?? "abstain";
        const maybeExistingVote = getStafferExistingVote(voter.activeStafferRid);

        return (
            <div className={styles.voteOptionContainer}>
                <div
                    className={classNames(styles.vote, { [styles.yesVote]: stafferVote === "passed" })}
                    onClick={
                        maybeExistingVote === undefined ? onSwitchVote(voter.activeStafferRid, "passed") : undefined
                    }
                >
                    {totalVotes} Yes
                </div>
                {/* <div
                    className={classNames(styles.vote, { [styles.abstain]: stafferVote === "abstain" })}
                    onClick={
                        maybeExistingVote === undefined ? onSwitchVote(voter.activeStafferRid, "abstain") : undefined
                    }
                >
                    Abstain
                </div> */}
                <div
                    className={classNames(styles.vote, { [styles.noVote]: stafferVote === "failed" })}
                    onClick={
                        maybeExistingVote === undefined ? onSwitchVote(voter.activeStafferRid, "failed") : undefined
                    }
                >
                    {totalVotes} No
                </div>
            </div>
        );
    };

    const onCastVote = (activeStafferRid: IActiveStafferRid) => async () => {
        if (activeResolutionRid === undefined) {
            return;
        }

        const vote = castVotes[activeStafferRid] ?? "abstain";

        setIsLoading(true);
        const newVotes = checkIsError(
            await PoliticalCapitalTwoServiceFrontend.castVote({
                gameStateRid,
                votingStafferRid: activeStafferRid,
                activeResolutionRid,
                vote,
            }),
            toast,
        );
        setIsLoading(false);

        if (newVotes === undefined) {
            return undefined;
        }

        dispatch(addVotes(newVotes.votes));
    };

    const maybeRenderVotesAlreadyCast = () => {
        if (votesCastByPlayerVoters.length === 0) {
            return undefined;
        }

        const totalYes = votesCastByPlayerVoters.filter((vote) => vote.vote === "passed").length;
        // const totalAbstain = votesCastByPlayerVoters.filter((vote) => vote.vote === "abstain").length;
        const totalNo = votesCastByPlayerVoters.filter((vote) => vote.vote === "failed").length;

        return (
            <div className={styles.alreadyCastVotes}>
                <div>{"("}</div>
                <div>{totalYes} Yes,</div>
                {/* <div>{totalAbstain} Abstain,</div> */}
                <div>{totalNo} No</div>
                <div>{")"}</div>
            </div>
        );
    };

    return (
        <div className={styles.availableVoters}>
            <div className={styles.availableVotersText}>
                <div>Available voters</div>
                {maybeRenderVotesAlreadyCast()}
            </div>
            <div className={styles.votersContainer}>
                {voters.map((voter) => {
                    const { stafferDetails } = voter.staffer;
                    if (!isVoter(stafferDetails)) {
                        return undefined;
                    }

                    const totalVotes = getEffectivenessNumber(resolvedGameModifiers, voter.staffer.stafferDetails.type);
                    const maybeExistingVote = getStafferExistingVote(voter.staffer.activeStafferRid);

                    const canStafferVote =
                        castVotes[voter.staffer.activeStafferRid] !== undefined || stafferDetails.isIndependent;

                    return (
                        <div
                            className={classNames(styles.singleVote, {
                                [styles.disabled]: voter.activeEvent !== undefined,
                            })}
                            key={voter.staffer.activeStafferRid}
                        >
                            <div className={styles.stafferDetails}>
                                <div className={styles.nameAndType}>
                                    <StafferName staffer={voter.staffer} showType={true} />
                                </div>
                                <div className={styles.description}>
                                    {descriptionOfStaffer(resolvedGameModifiers)[voter.staffer.stafferDetails.type]}
                                </div>
                                {voter.activeEvent !== undefined && (
                                    <div className={styles.activeEvent}>
                                        <ResolveEvent event={voter.activeEvent} />
                                    </div>
                                )}
                            </div>
                            {voter.activeEvent === undefined && (
                                <div className={styles.votingContainer}>
                                    {stafferDetails.isIndependent
                                        ? renderIndependentVotes(totalVotes)
                                        : renderNormalVotes(voter.staffer, totalVotes)}
                                    {maybeExistingVote === undefined && (
                                        <Button
                                            isLoading={isLoading}
                                            disabled={
                                                isPaused || activeResolution?.state !== "active" || !canStafferVote
                                            }
                                            onClick={onCastVote(voter.staffer.activeStafferRid)}
                                        >
                                            Cast votes
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
