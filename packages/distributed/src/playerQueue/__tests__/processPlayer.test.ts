/**
 * Copyright (c) 2022 - KM
 */

import {
    ALL_RESOLUTIONS,
    DEFAULT_STAFFER,
    IActiveResolutionRid,
    IActiveStafferRid,
    IGameClock,
    IGameStateRid,
    IPlayerRid,
} from "@pc2/api";
import { Job } from "bull";
import {
    ActivePlayer,
    ActiveResolution,
    ActiveResolutionVote,
    ActiveStaffer,
    initializeModels,
    ResolveGameEvent,
} from "../../models";
import { IProcessPlayerQueue } from "../../queues";
import { initDB, teardownDB } from "../../testUtilities/setupTests";
import { handlePlayerProcessor } from "../processPlayerQueue";

beforeAll(() => {
    initDB();

    initializeModels();
});

afterAll(() => {
    teardownDB();
});

const noop = () => {};

describe("Process player works as expected", () => {
    beforeEach(async () => {
        await Promise.all([
            ActivePlayer.truncate(),
            ActiveResolution.truncate(),
            ActiveResolutionVote.truncate(),
            ActiveStaffer.truncate(),
            ResolveGameEvent.truncate(),
        ]);
    });

    it("can process an empty sync", async () => {
        const gameClock = 10 as IGameClock;

        const gameStateRid = "some-game-state-rid-1" as IGameStateRid;
        const playerRid = "some-player-rid-1" as IPlayerRid;

        await ActivePlayer.create({
            playerRid,
            gameStateRid,
            politicalCapital: 0,
            approvalRating: 0,
            avatarSet: 1,
            lastUpdatedGameClock: 9 as IGameClock,
            isReady: true,
        });

        await handlePlayerProcessor({ data: { playerRid, gameStateRid, gameClock } } as Job<IProcessPlayerQueue>, noop);

        const activePlayer = await ActivePlayer.findOne({ where: { playerRid } });
        expect(activePlayer?.politicalCapital).toEqual(0);
    });

    it("works in the complex case", async () => {
        const gameClock = 10 as IGameClock;

        const gameStateRid = "some-game-state-rid-2" as IGameStateRid;
        const playerRid = "some-player-rid-2" as IPlayerRid;

        const votingStaffer = "some-voting-staffer" as IActiveStafferRid;
        const recruiterStaffer = "some-recruiter-staffer" as IActiveStafferRid;
        const phoneBankerStaffer = "phone-banker-staffer" as IActiveStafferRid;
        const partTimeTrainer = "part-time-trainer" as IActiveStafferRid;

        const activeResolutionRid = "some-active-resolution" as IActiveResolutionRid;

        await ActivePlayer.create({
            playerRid,
            gameStateRid,
            politicalCapital: 0,
            approvalRating: 0,
            avatarSet: 1,
            lastUpdatedGameClock: 9 as IGameClock,
            isReady: true,
        });
        await ActiveStaffer.create({
            gameStateRid,
            playerRid,
            activeStafferRid: votingStaffer,
            stafferDetails: DEFAULT_STAFFER.representative,
            avatarSet: 1,
            state: "active",
        });
        await ActiveStaffer.create({
            gameStateRid,
            playerRid,
            activeStafferRid: recruiterStaffer,
            stafferDetails: DEFAULT_STAFFER.recruiter,
            avatarSet: 1,
            state: "active",
        });
        await ActiveStaffer.create({
            gameStateRid,
            playerRid,
            activeStafferRid: phoneBankerStaffer,
            stafferDetails: DEFAULT_STAFFER.phoneBanker,
            avatarSet: 1,
            state: "disabled",
        });
        await ActiveStaffer.create({
            gameStateRid,
            playerRid,
            activeStafferRid: partTimeTrainer,
            stafferDetails: DEFAULT_STAFFER.adjunctInstructor,
            avatarSet: 1,
            state: "active",
        });
        await ActiveResolution.create({
            gameStateRid,
            activeResolutionRid,
            resolutionDetails: ALL_RESOLUTIONS[0],
            state: "passed",
            createdOn: 0 as IGameClock,
        });
        await ActiveResolutionVote.create({
            gameStateRid,
            activeResolutionRid,
            activeStafferRid: votingStaffer,
            vote: "passed",
        });
        await ResolveGameEvent.create({
            gameStateRid,
            resolvesOn: gameClock,
            eventDetails: { activeResolutionRid, type: "tally-resolution" },
            state: "complete",
        });
        await ResolveGameEvent.create({
            gameStateRid,
            resolvesOn: gameClock,
            eventDetails: {
                playerRid,
                stafferType: "intern",
                type: "start-hiring-staffer",
                recruiterRid: recruiterStaffer,
            },
            state: "active",
        });
        await ResolveGameEvent.create({
            gameStateRid,
            resolvesOn: gameClock,
            eventDetails: {
                playerRid,
                activeStafferRid: phoneBankerStaffer,
                type: "finish-hiring-staffer",
                recruiterRid: recruiterStaffer,
            },
            state: "active",
        });
        await ResolveGameEvent.create({
            gameStateRid,
            resolvesOn: gameClock,
            eventDetails: {
                playerRid,
                activeStafferRid: votingStaffer,
                trainerRid: partTimeTrainer,
                type: "start-training-staffer",
                toLevel: "seniorRepresentative",
            },
            state: "active",
        });

        await handlePlayerProcessor({ data: { playerRid, gameStateRid, gameClock } } as Job<IProcessPlayerQueue>, noop);

        const activePlayer = await ActivePlayer.findOne({ where: { playerRid } });

        // Player changes: political capital --> 10 (resolution vote) + 1 (phone banker) - 1 (intern hire) - 4 (senior rep train)
        expect(activePlayer?.politicalCapital).toEqual(6);
        expect(activePlayer?.lastUpdatedGameClock).toEqual(10);

        // Resolve events --> 1 new finish hiring staffer, 1 new finish training staffer
        const resolveEvents = await ResolveGameEvent.findAll();

        expect(resolveEvents.length).toEqual(6);
        const completedEvents = resolveEvents.filter((event) => event.state === "complete");
        expect(completedEvents.length).toEqual(4);

        const activeEvent = resolveEvents.find(
            (event) => event.state === "active" && event.eventDetails.type === "finish-hiring-staffer",
        );
        expect(activeEvent?.resolvesOn).toEqual(gameClock + DEFAULT_STAFFER.intern.timeToAcquire);

        const activeEvent2 = resolveEvents.find(
            (event) => event.state === "active" && event.eventDetails.type === "finish-training-staffer",
        );
        expect(activeEvent2?.resolvesOn).toEqual(gameClock + DEFAULT_STAFFER.seniorRepresentative.timeToAcquire);

        const activeStaffers = await ActiveStaffer.findAll({});

        expect(activeStaffers.length).toEqual(5);
        const areActiveStaffers = activeStaffers.filter((staffer) => staffer.state === "active");
        expect(areActiveStaffers.length).toEqual(3);

        const disabledStaffer = activeStaffers.find(
            (staffer) => staffer.state === "disabled" && staffer.stafferDetails.type === "intern",
        );
        expect(disabledStaffer).not.toBeUndefined();

        const disabledStaffer2 = activeStaffers.find(
            (staffer) => staffer.state === "disabled" && staffer.stafferDetails.type === "seniorRepresentative",
        );
        expect(disabledStaffer2).not.toBeUndefined();
    });
});
