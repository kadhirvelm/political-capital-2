/*
 * Copyright 2023 KM.
 */

import { Button, useToast } from "@chakra-ui/react";
import {
  type IActiveResolutionRid,
  type IActiveResolutionVote,
  type IActiveStaffer,
  type IActiveStafferRid,
  type IGameStateRid,
  isVoter,
  PoliticalCapitalTwoServiceFrontend,
} from "@pc2/api";
import classNames from "classnames";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { getVoters, getVotesAlreadyCast } from "../../selectors/getVoters";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { addVotes } from "../../store/gameState";
import { checkIsError } from "../../utility/alertOnError";
import { StafferName } from "../common/StafferName";
import styles from "./PlayerVoters.module.scss";
import { MinimalResolveEvent } from "./ResolveEvent";
import { type FC, useState, useEffect } from "react";

export const PlayerVoters: FC<{
  activeResolutionRid: IActiveResolutionRid | undefined;
  gameStateRid: IGameStateRid;
}> = ({ gameStateRid, activeResolutionRid }) => {
  const toast = useToast();
  const dispatch = usePoliticalCapitalDispatch();

  const isGameActive = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState?.gameState.state === "active");
  const voters = usePoliticalCapitalSelector(getVoters);
  const votesCastByPlayerVoters = usePoliticalCapitalSelector(getVotesAlreadyCast(activeResolutionRid));
  const votesAlreadyCastOnResolution = usePoliticalCapitalSelector((s) => {
    if (activeResolutionRid === undefined) {
      return;
    }

    return s.localGameState.fullGameState?.activePlayersVotes?.[activeResolutionRid];
  });
  const activeResolution = usePoliticalCapitalSelector(
    (s) => s.localGameState.fullGameState?.activeResolutions.find((r) => r.activeResolutionRid === activeResolutionRid),
  );
  const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

  const [isLoading, setIsLoading] = useState(false);

  const [castVotes, setCastVotes] = useState<{
    [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote["vote"];
  }>({});

  const getStafferCastVoteOnResolution = (activeStafferRid: IActiveStafferRid) =>
    votesAlreadyCastOnResolution?.[activeStafferRid]?.[0];

  useEffect(() => {
    const newCastVotesDefaultState: { [activeStafferRid: IActiveStafferRid]: IActiveResolutionVote["vote"] } = {};

    for (const voter of voters) {
      newCastVotesDefaultState[voter.staffer.activeStafferRid] =
        getStafferCastVoteOnResolution(voter.staffer.activeStafferRid)?.vote ??
        castVotes[voter.staffer.activeStafferRid];
    }

    setCastVotes(newCastVotesDefaultState);
  }, [voters]);

  useEffect(() => {
    if (activeResolutionRid !== undefined) {
      return;
    }

    setCastVotes({});
  }, [activeResolutionRid]);

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
    if (getStafferCastVoteOnResolution(activeStafferRid) !== undefined) {
      return;
    }

    setCastVotes({ ...castVotes, [activeStafferRid]: newVote });
  };

  const renderNormalVotes = (voter: IActiveStaffer, totalVotes: number) => {
    const stafferVote = castVotes[voter.activeStafferRid];

    return (
      <div className={styles.voteOptionContainer}>
        <div
          className={classNames(styles.vote, { [styles.yesVote]: stafferVote === "passed" })}
          onClick={onSwitchVote(voter.activeStafferRid, "passed")}
        >
          {totalVotes} Yes
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

  const onCastVote = (votingStaffer: IActiveStaffer) => async () => {
    if (!isVoter(votingStaffer.stafferDetails)) {
      return;
    }

    const vote = votingStaffer.stafferDetails.isIndependent ? "passed" : castVotes[votingStaffer.activeStafferRid];
    if (activeResolutionRid === undefined || vote === undefined) {
      return;
    }

    setIsLoading(true);
    const newVotes = checkIsError(
      await PoliticalCapitalTwoServiceFrontend.castVote({
        activeResolutionRid,
        gameStateRid,
        vote,
        votingStafferRid: votingStaffer.activeStafferRid,
      }),
      toast,
    );
    setIsLoading(false);

    if (newVotes === undefined) {
      return;
    }

    dispatch(addVotes(newVotes.votes));
  };

  const maybeRenderVotesAlreadyCast = () => {
    if (votesCastByPlayerVoters.length === 0) {
      return;
    }

    const totalYes = votesCastByPlayerVoters.filter((vote) => vote.vote === "passed").length;
    const totalNo = votesCastByPlayerVoters.filter((vote) => vote.vote === "failed").length;

    return (
      <div className={styles.alreadyCastVotes}>
        <div>{"("}</div>
        <div>{totalYes} Yes,</div>
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
            return;
          }

          const totalVotes = resolvedGameModifiers[stafferDetails.type].effectiveness;
          const hasPlayerSetVotes =
            castVotes[voter.staffer.activeStafferRid] !== undefined || stafferDetails.isIndependent;

          const canStillCastVote =
            getStafferCastVoteOnResolution(voter.staffer.activeStafferRid) === undefined &&
            activeResolution?.state === "active";
          const isCastVotesDisabled = !isGameActive || !hasPlayerSetVotes || activeResolution?.state !== "active";

          return (
            <div
              className={classNames(styles.singleVote, {
                [styles.disabled]: voter.activeEvent !== undefined,
              })}
              key={voter.staffer.activeStafferRid}
            >
              <div className={styles.stafferDetails}>
                <div className={styles.nameAndType}>
                  <StafferName showDescription={true} showType={true} staffer={voter.staffer} />
                </div>
                {voter.activeEvent !== undefined && (
                  <div className={styles.activeEvent}>
                    <MinimalResolveEvent event={voter.activeEvent} />
                  </div>
                )}
              </div>
              {voter.activeEvent === undefined && (
                <div className={styles.votingContainer}>
                  {stafferDetails.isIndependent
                    ? renderIndependentVotes(totalVotes)
                    : renderNormalVotes(voter.staffer, totalVotes)}
                  {canStillCastVote && (
                    <Button
                      colorScheme={hasPlayerSetVotes ? "blue" : undefined}
                      disabled={isCastVotesDisabled}
                      isLoading={isLoading}
                      onClick={onCastVote(voter.staffer)}
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
