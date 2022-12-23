/**
 * Copyright (c) 2022 - KM
 */

import { ActiveResolution, ActiveResolutionVote } from "@pc2/distributed-compute";

export async function resolveResolution(activeResolution: ActiveResolution) {
    const allActiveVotes = await ActiveResolutionVote.findAll({
        where: { activeResolutionRid: activeResolution.activeResolutionRid },
    });

    const votesInFavor = allActiveVotes.filter((vote) => vote.vote === "inFavor");
    const votesAgainst = allActiveVotes.filter((vote) => vote.vote === "against");

    if (votesInFavor > votesAgainst) {
        activeResolution.state = "passed";
    } else {
        activeResolution.state = "failed";
    }

    await activeResolution.save();
}
