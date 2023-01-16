/**
 * Copyright (c) 2023 - KM
 */

import {
    BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER,
    MAX_EARLY_VOTING_BONUS,
    TIME_BETWEEN_RESOLUTIONS_IN_DAYS,
    TIME_FOR_EACH_RESOLUTION_IN_DAYS,
    TOTAL_DAYS_IN_GAME,
} from "../../constants/game";
import { IGameClock } from "../../types/BrandedIDs";
import { DEFAULT_STAFFER } from "../../types/generatedStaffers";
import { getTotalCostForStaffer, getTotalTimeCost, timeInResolutions } from "../costs";
import { getPotentialPayoutForStaffer } from "../payouts";

/**
 * The phone banker will get 3/4 of the PC of 1 representative voting early and getting 100%
 */

describe("Balance the game out", () => {
    it("baseline report", () => {
        const totalResolutions = Math.floor(
            TOTAL_DAYS_IN_GAME / (TIME_BETWEEN_RESOLUTIONS_IN_DAYS + TIME_FOR_EACH_RESOLUTION_IN_DAYS),
        );
        expect(totalResolutions).toEqual(10);

        const leftoverDays =
            TOTAL_DAYS_IN_GAME -
            (TIME_BETWEEN_RESOLUTIONS_IN_DAYS + TIME_FOR_EACH_RESOLUTION_IN_DAYS) * totalResolutions;
        expect(leftoverDays).toEqual(5);
    });

    it("The phone banker gets paid less than the representative overall", () => {
        const representative = DEFAULT_STAFFER.representative;
        const phoneBanker = DEFAULT_STAFFER.phoneBanker;

        const totalResolutions = Math.floor(
            TOTAL_DAYS_IN_GAME / (TIME_FOR_EACH_RESOLUTION_IN_DAYS + TIME_BETWEEN_RESOLUTIONS_IN_DAYS),
        );

        const totalTimeToTrainStaffer = getTotalTimeCost(representative, [], []);
        const costInResolution = timeInResolutions(totalTimeToTrainStaffer);

        const totalRepresentativePossiblePayout =
            (totalResolutions - costInResolution) * MAX_EARLY_VOTING_BONUS * representative.votes +
            (totalResolutions - costInResolution) * BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER -
            getTotalCostForStaffer(representative, [], []);

        const totalPhoneBankerPossiblePayout = getPotentialPayoutForStaffer(phoneBanker, [], 0 as IGameClock, []);

        // console.log({ totalRepresentativePossiblePayout, totalPhoneBankerPossiblePayout });

        expect(totalRepresentativePossiblePayout).toBeGreaterThan(totalPhoneBankerPossiblePayout);
    });

    it("The social media manager gets paid a bit less than the senior representative overall", () => {
        const seniorRepresentative = DEFAULT_STAFFER.seniorRepresentative;
        const socialMedia = DEFAULT_STAFFER.socialMediaManager;

        const totalResolutions = Math.floor(
            TOTAL_DAYS_IN_GAME / (TIME_FOR_EACH_RESOLUTION_IN_DAYS + TIME_BETWEEN_RESOLUTIONS_IN_DAYS),
        );

        const totalTimeToTrainStaffer = getTotalTimeCost(seniorRepresentative, [], []);
        const costInResolution = timeInResolutions(totalTimeToTrainStaffer);

        const totalSeniorRepresentativePayout =
            (totalResolutions - costInResolution) * MAX_EARLY_VOTING_BONUS * seniorRepresentative.votes +
            (totalResolutions - costInResolution) * BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER -
            getTotalCostForStaffer(seniorRepresentative, [], []);

        const totalSocialMediaManagerPayout = getPotentialPayoutForStaffer(socialMedia, [], 0 as IGameClock, []);

        // console.log({ totalSeniorRepresentativePayout, totalSocialMediaManagerPayout });

        expect(totalSeniorRepresentativePayout).toBeGreaterThan(totalSocialMediaManagerPayout);
    });

    it("The social media manager gets paid a bit less than the senator overall", () => {
        const senator = DEFAULT_STAFFER.senator;
        const socialMedia = DEFAULT_STAFFER.socialMediaManager;

        const totalResolutions = Math.floor(
            TOTAL_DAYS_IN_GAME / (TIME_FOR_EACH_RESOLUTION_IN_DAYS + TIME_BETWEEN_RESOLUTIONS_IN_DAYS),
        );

        const totalTimeToTrainStaffer = getTotalTimeCost(senator, [], []);
        const costInResolution = timeInResolutions(totalTimeToTrainStaffer);

        const totalSenatorPayout =
            (totalResolutions - costInResolution) * MAX_EARLY_VOTING_BONUS * senator.votes +
            (totalResolutions - costInResolution) * BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER -
            getTotalCostForStaffer(senator, [], []);

        const totalSocialMediaManagerPayout = getPotentialPayoutForStaffer(socialMedia, [], 0 as IGameClock, []);

        // console.log({ totalSenatorPayout, totalSocialMediaManagerPayout });

        expect(totalSenatorPayout).toBeGreaterThan(totalSocialMediaManagerPayout);
    });

    it("The social media manager gets paid less than the seasoned senator", () => {
        const seasonedSenator = DEFAULT_STAFFER.seasonedSenator;
        const socialMedia = DEFAULT_STAFFER.socialMediaManager;

        const totalResolutions = Math.floor(
            TOTAL_DAYS_IN_GAME / (TIME_FOR_EACH_RESOLUTION_IN_DAYS + TIME_BETWEEN_RESOLUTIONS_IN_DAYS),
        );

        const totalTimeToTrainStaffer = getTotalTimeCost(seasonedSenator, [], []);
        const costInResolution = timeInResolutions(totalTimeToTrainStaffer);

        const totalSeasonedSenatorPayout =
            (totalResolutions - costInResolution) * MAX_EARLY_VOTING_BONUS * seasonedSenator.votes +
            (totalResolutions - costInResolution) * BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER -
            getTotalCostForStaffer(seasonedSenator, [], []);

        const totalSocialMediaManagerPayout = getPotentialPayoutForStaffer(socialMedia, [], 0 as IGameClock, []);

        // console.log({ totalSeasonedSenatorPayout, totalSocialMediaManagerPayout });

        expect(totalSeasonedSenatorPayout).toBeGreaterThan(totalSocialMediaManagerPayout);
    });

    it("phone banker compared to social media", () => {
        const phoneBanker = DEFAULT_STAFFER.phoneBanker;
        const socialMedia = DEFAULT_STAFFER.socialMediaManager;

        const totalPotentialPayoutForPhoneBanker = getPotentialPayoutForStaffer(phoneBanker, [], 0 as IGameClock, []);
        const totalPotentialForSocialMedia = getPotentialPayoutForStaffer(socialMedia, [], 0 as IGameClock, []);

        // console.log({ totalPotentialPayoutForPhoneBanker, totalPotentialForSocialMedia });

        expect(totalPotentialForSocialMedia).toBeGreaterThan(totalPotentialPayoutForPhoneBanker);
    });

    it("intern track compared to normal", () => {
        const politicalCommentator = DEFAULT_STAFFER.politicalCommentator;
        const socialMedia = DEFAULT_STAFFER.socialMediaManager;

        const totalPotentialPayoutForCommentator = getPotentialPayoutForStaffer(
            politicalCommentator,
            [],
            0 as IGameClock,
            [],
        );
        const totalPotentialForSocialMedia = getPotentialPayoutForStaffer(socialMedia, [], 0 as IGameClock, []);

        // console.log({ totalPotentialPayoutForCommentator, totalPotentialForSocialMedia });

        expect(totalPotentialPayoutForCommentator).toBeGreaterThan(totalPotentialForSocialMedia);
    });

    it("Early limit phone banker gets paid more than the early limit representatives with wrong voting", () => {
        const representative = DEFAULT_STAFFER.representative;
        const phoneBanker = DEFAULT_STAFFER.phoneBanker;

        const totalResolutions = Math.floor(
            TOTAL_DAYS_IN_GAME / (TIME_FOR_EACH_RESOLUTION_IN_DAYS + TIME_BETWEEN_RESOLUTIONS_IN_DAYS),
        );

        const totalTimeToTrainStaffer = getTotalTimeCost(representative, [], []);
        const costInResolution = timeInResolutions(totalTimeToTrainStaffer);

        const totalRepresentativePossiblePayout =
            (totalResolutions - costInResolution) *
                MAX_EARLY_VOTING_BONUS *
                representative.votes *
                representative.limitPerParty +
            (totalResolutions - costInResolution) * BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER * 0.65 -
            getTotalCostForStaffer(representative, [], []) * representative.limitPerParty;

        const totalPhoneBankerPossiblePayout =
            getPotentialPayoutForStaffer(phoneBanker, [], 0 as IGameClock, []) * phoneBanker.limitPerParty;

        // console.log({ totalRepresentativePossiblePayout, totalPhoneBankerPossiblePayout });

        expect(totalPhoneBankerPossiblePayout).toBeGreaterThan(totalRepresentativePossiblePayout);
    });

    it("Early limit phone banker gets paid less than the early limit representatives with all correct voting", () => {
        const representative = DEFAULT_STAFFER.representative;
        const phoneBanker = DEFAULT_STAFFER.phoneBanker;

        const totalResolutions = Math.floor(
            TOTAL_DAYS_IN_GAME / (TIME_FOR_EACH_RESOLUTION_IN_DAYS + TIME_BETWEEN_RESOLUTIONS_IN_DAYS),
        );

        const totalTimeToTrainStaffer = getTotalTimeCost(representative, [], []);
        const costInResolution = timeInResolutions(totalTimeToTrainStaffer);

        const totalRepresentativePossiblePayout =
            (totalResolutions - costInResolution) *
                MAX_EARLY_VOTING_BONUS *
                representative.votes *
                representative.limitPerParty +
            (totalResolutions - costInResolution) * BASE_PC_PAYOUT_RESOLUTION_PER_PLAYER -
            getTotalCostForStaffer(representative, [], []) * representative.limitPerParty;

        const totalPhoneBankerPossiblePayout =
            getPotentialPayoutForStaffer(phoneBanker, [], 0 as IGameClock, []) * phoneBanker.limitPerParty;

        // console.log({ totalRepresentativePossiblePayout, totalPhoneBankerPossiblePayout });

        expect(totalRepresentativePossiblePayout).toBeGreaterThan(totalPhoneBankerPossiblePayout);
    });
});
