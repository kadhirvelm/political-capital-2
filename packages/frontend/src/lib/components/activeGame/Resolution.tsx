/*
 * Copyright 2023 KM.
 */

import { Card, CardBody } from "@chakra-ui/react";
import { getEarlyVoteBonus, type IActiveResolution, IEvent } from "@pc2/api";
import classNames from "classnames";
import { flatten } from "lodash-es";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { roundToHundred } from "../../utility/roundTo";
import { getFakeDate } from "../common/ServerStatus";
import { GameModifier } from "./GameModifier";
import styles from "./Resolution.module.scss";
import { type FC } from "react";

export const Resolution: FC<{ isGlobalScreen?: boolean; resolution: IActiveResolution }> = ({
  resolution,
  isGlobalScreen,
}) => {
  const votesOnResolution = usePoliticalCapitalSelector((s) =>
    flatten(Object.values(s.localGameState.fullGameState?.activePlayersVotes[resolution.activeResolutionRid] ?? {})),
  );
  const resolveEvents = usePoliticalCapitalSelector((s) => s.localGameState.resolveEvents);
  const player = usePoliticalCapitalSelector((s) => s.playerState.player);
  const fullGameState = usePoliticalCapitalSelector((s) => s.localGameState.fullGameState);

  if (resolveEvents === undefined || fullGameState === undefined) {
    return null;
  }

  const playerParty = player === undefined ? [] : fullGameState.activePlayersStaffers[player.playerRid];

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
    const totalNo = votesOnResolution.filter((vote) => vote.vote === "failed").length;

    const willPass = totalYes > totalNo;

    if (resolution.state !== "active") {
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
          <div className={styles.singleVoteCategory}>
            <div className={styles.no}>No</div>
            <div className={styles.divider} />
            <div>{totalNo}</div>
          </div>
        </div>
      );
    }

    // Informant view below

    return (
      <div className={styles.totalVotes}>
        <div className={styles.onTrack}>
          <div>Votes cast</div>
        </div>
        <div className={styles.singleVoteCategory}>
          <div className={styles.yes}>Yes</div>
          <div className={styles.divider} />
          <div>{roundToHundred((totalYes / (totalYes + totalNo)) * 100)}%</div>
        </div>
        <div className={styles.singleVoteCategory}>
          <div className={styles.no}>No</div>
          <div className={styles.divider} />
          <div>{roundToHundred((totalNo / (totalYes + totalNo)) * 100)}%</div>
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
            <span className={styles.description}>Total PC</span>
            <span className={styles.politicalCapitalPayout}>
              {roundToHundred(resolution.resolutionDetails.politicalCapitalPayout).toLocaleString()}
            </span>
          </div>
          <div className={styles.tallyContainer}>
            <div className={styles.tallyOn}>Will tally on</div>
            {tallyOnEvent === undefined ? "Pending" : getFakeDate(tallyOnEvent.resolvesOn)}
          </div>
          {tallyOnEvent !== undefined && (
            <div className={styles.earlyVotingContainer}>
              <div className={styles.earlyVoting}>Current early voting bonus</div>
              <div>{roundToHundred(getEarlyVoteBonus(fullGameState.gameState.gameClock, tallyOnEvent.resolvesOn))}</div>
            </div>
          )}
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
          {resolution.state.toUpperCase()} {passedOn !== undefined && ` on ${getFakeDate(passedOn.resolvesOn)}`}
        </div>
        {maybeRenderTotalVotesCast()}
      </div>
    );
  };

  return (
    <Card className={styles.cardContainer} style={{ background: "white", borderColor: "#9E9E9E" }} variant="outline">
      <CardBody>
        <div className={styles.title}>{resolution.resolutionDetails.title}</div>
        <div className={styles.description}>{resolution.resolutionDetails.description}</div>
        <div className={styles.resolutionFooter}>
          <GameModifier gameModifier={resolution.resolutionDetails.gameModifier} isGlobalScreen={isGlobalScreen} />
          {renderFooter()}
        </div>
      </CardBody>
    </Card>
  );
};
