/**
 * Copyright (c) 2022 - KM
 */

import {
    DEFAULT_RESOLUTIONS,
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

jest.mock("bull");

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

    it("works in the complex case", async () => {
        const gameClock = 10 as IGameClock;

        const gameStateRid = "some-game-state-rid-1" as IGameStateRid;
        const playerRid = "some-player-rid-1" as IPlayerRid;

        const votingStaffer = "some-voting-staffer" as IActiveStafferRid;
        const recruiterStaffer = "some-recruiter-staffer" as IActiveStafferRid;
        const phoneBankerStaffer = "phone-banker-staffer" as IActiveStafferRid;

        const activeResolutionRid = "some-active-resolution" as IActiveResolutionRid;

        await ActivePlayer.create({
            playerRid,
            gameStateRid,
            politicalCapital: 0,
            approvalRating: 0,
            lastUpdatedGameClock: 9 as IGameClock,
            isReady: true,
        });
        await ActiveStaffer.create({
            gameStateRid,
            playerRid,
            activeStafferRid: votingStaffer,
            stafferDetails: DEFAULT_STAFFER.representative,
            state: "active",
        });
        await ActiveStaffer.create({
            gameStateRid,
            playerRid,
            activeStafferRid: recruiterStaffer,
            stafferDetails: DEFAULT_STAFFER.recruiter,
            state: "active",
        });
        await ActiveStaffer.create({
            gameStateRid,
            playerRid,
            activeStafferRid: phoneBankerStaffer,
            stafferDetails: DEFAULT_STAFFER.phoneBanker,
            state: "disabled",
        });
        await ActiveResolution.create({
            gameStateRid,
            activeResolutionRid,
            resolutionDetails: DEFAULT_RESOLUTIONS.doublePoliticalCapitalFromResolutions,
            state: "passed",
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

        await handlePlayerProcessor({ data: { playerRid, gameStateRid, gameClock } } as Job<IProcessPlayerQueue>, noop);

        const activePlayer = await ActivePlayer.findOne({ where: { playerRid } });

        // Player changes: political capital --> 10 (resolution vote) + 1 (phone banker) - 1 (intern hire)
        expect(activePlayer?.politicalCapital).toEqual(10);
        expect(activePlayer?.lastUpdatedGameClock).toEqual(10);

        // Resolve events --> 1 new finish hiring staffer at (10 + intern time to hire)
        const resolveEvents = await ResolveGameEvent.findAll();

        expect(resolveEvents.length).toEqual(4);
        const completedEvents = resolveEvents.filter((event) => event.state === "complete");
        expect(completedEvents.length).toEqual(3);

        const activeEvent = resolveEvents.find((event) => event.state === "active");
        expect(activeEvent?.resolvesOn).toEqual(gameClock + DEFAULT_STAFFER.intern.timeToAcquire);
        expect(activeEvent?.eventDetails.type).toEqual("finish-hiring-staffer");

        const activeStaffers = await ActiveStaffer.findAll({});

        expect(activeStaffers.length).toEqual(4);
        const areActiveStaffers = activeStaffers.filter((staffer) => staffer.state === "active");
        expect(areActiveStaffers.length).toEqual(3);

        const disabledStaffer = activeStaffers.find((staffer) => staffer.state === "disabled");
        expect(disabledStaffer?.stafferDetails.type).toEqual(DEFAULT_STAFFER.intern.type);
    });
});
