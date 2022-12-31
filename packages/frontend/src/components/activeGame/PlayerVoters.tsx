/**
 * Copyright (c) 2022 - KM
 */

import { Button, useToast } from "@chakra-ui/react";
import {
    DEFAULT_STAFFER,
    getTotalAllowedVotes,
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
import { getVoters } from "../../selectors/getVoters";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addVotes } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import styles from "./PlayerVoters.module.scss";

export const PlayerVoters: React.FC<{
    gameStateRid: IGameStateRid;
    activeResolutionRid: IActiveResolutionRid;
}> = ({ gameStateRid, activeResolutionRid }) => {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const voters = usePoliticalCapitalSelector(getVoters);
    const votesAlreadyCast = usePoliticalCapitalSelector(
        (s) => s.localGameState.fullGameState?.activePlayersVotes?.[activeResolutionRid],
    );

    const [isLoading, setIsLoading] = React.useState(false);

    const [castVotes, setCastVotes] = React.useState<{
        [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote["vote"];
    }>({});

    const getStafferExistingVote = (activeStafferRid: IActiveStafferRid) => votesAlreadyCast?.[activeStafferRid]?.[0];

    React.useEffect(() => {
        const newCastVotesDefaultState: { [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote["vote"] } = {};

        voters.forEach((voter) => {
            const maybeExistingVote = getStafferExistingVote(voter.activeStafferRid);
            newCastVotesDefaultState[voter.activeStafferRid] = maybeExistingVote?.vote ?? "abstain";
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
        if (maybeExistingVote !== undefined) {
            return;
        }

        setCastVotes({ ...castVotes, [activeStafferRid]: newVote });
    };

    const renderNormalVotes = (voter: IActiveStaffer, totalVotes: number) => {
        const stafferVote = castVotes[voter.activeStafferRid] ?? "abstain";

        return (
            <div className={styles.voteOptionContainer}>
                <div
                    className={classNames(styles.vote, { [styles.yesVote]: stafferVote === "passed" })}
                    onClick={onSwitchVote(voter.activeStafferRid, "passed")}
                >
                    {totalVotes} Yes
                </div>
                <div
                    className={classNames(styles.vote, { [styles.abstain]: stafferVote === "abstain" })}
                    onClick={onSwitchVote(voter.activeStafferRid, "abstain")}
                >
                    Abstain
                </div>
                <div
                    className={classNames(styles.vote, { [styles.noVote]: stafferVote === "failed" })}
                    onClick={onSwitchVote(voter.activeStafferRid, "failed")}
                >
                    {totalVotes} No
                </div>
            </div>
        );
    };

    const onCastVote = (activeStafferRid: IActiveStafferRid) => async () => {
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

    return (
        <div className={styles.availableVoters}>
            <div className={styles.availableVotersText}>Available voters</div>
            <div className={styles.votersContainer}>
                {voters.map((voter) => {
                    const { stafferDetails } = voter;
                    if (!isVoter(stafferDetails)) {
                        return undefined;
                    }

                    const totalVotes = getTotalAllowedVotes(voter);
                    const maybeExistingVote = getStafferExistingVote(voter.activeStafferRid);

                    return (
                        <div className={styles.singleVote} key={voter.activeStafferRid}>
                            <div>
                                <div>{voter.stafferDetails.displayName}</div>
                                <div>{DEFAULT_STAFFER[voter.stafferDetails.type].displayName}</div>
                            </div>
                            <div className={styles.votingContainer}>
                                {stafferDetails.isIndependent
                                    ? renderIndependentVotes(totalVotes)
                                    : renderNormalVotes(voter, totalVotes)}
                                {maybeExistingVote === undefined && (
                                    <Button isLoading={isLoading} onClick={onCastVote(voter.activeStafferRid)}>
                                        Cast votes
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
