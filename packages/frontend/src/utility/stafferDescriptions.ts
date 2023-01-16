/**
 * Copyright (c) 2022 - KM
 */

import { ACCOUNTANT_MODIFIER, CHIEF_OF_STAFF_MODIFIER, IAllStaffers, LOBBYIST_MODIFIER } from "@pc2/api";
import { IResolvedGameModifiersForEachStaffer } from "../selectors/gameModifiers";

type IDescriptionOfStaffer = {
    [key in Exclude<keyof IAllStaffers, "unknown">]: string;
};

const getPercent = (modifier: number) => `${Math.abs(modifier) * 100}%`;

export const descriptionOfStaffer = (gameModifiers: IResolvedGameModifiersForEachStaffer): IDescriptionOfStaffer => {
    return {
        intern: "A college intern, doesn't provide much value - yet",
        newHire: `Provides ${gameModifiers.newHire.effectiveness} political capital every day`,
        accountant: `Reduces training and hiring costs of staffers by ${getPercent(
            ACCOUNTANT_MODIFIER.costToAcquire ?? 0,
        )}`,
        seasonedStaffer: `Provides ${gameModifiers.seasonedStaffer.effectiveness} political capital every day.`,
        chiefOfStaff: `Reduces training and hiring time of staffers by ${getPercent(
            CHIEF_OF_STAFF_MODIFIER.timeToAcquire ?? 0,
        )}`,
        politicalCommentator: `Provides ${gameModifiers.politicalCommentator.effectiveness} political capital every day.`,
        headOfHr: `Recruits up to ${gameModifiers.headOfHr.effectiveness} staffers to your party at a time.`,
        professor: `Trains up to ${gameModifiers.professor.effectiveness} staffers in your party at a time.`,
        representative: `Provides ${gameModifiers.representative.effectiveness} vote on resolutions`,
        seniorRepresentative: `Provides ${gameModifiers.seniorRepresentative.effectiveness} votes on resolutions`,
        independentRepresentative: `Provides ${gameModifiers.independentRepresentative.effectiveness} vote to pass, and ${gameModifiers.independentRepresentative.effectiveness} vote to fail on resolutions`,
        senator: `Provides ${gameModifiers.senator.effectiveness} votes on resolutions`,
        seasonedSenator: `Provides ${gameModifiers.seasonedSenator.effectiveness} votes on resolutions`,
        independentSenator: `Provides ${gameModifiers.independentSenator.effectiveness} votes to pass, and ${gameModifiers.independentSenator.effectiveness} votes to fail on resolutions`,
        phoneBanker: `Generates ${gameModifiers.phoneBanker.effectiveness} political capital every day`,
        socialMediaManager: `Generates ${gameModifiers.socialMediaManager.effectiveness} political capital every day`,
        recruiter: `Recruits ${gameModifiers.recruiter.effectiveness} staffer to your party at a time`,
        hrManager: `Recruits up to ${gameModifiers.hrManager.effectiveness} staffers to your party at a time`,
        adjunctInstructor: `Trains ${gameModifiers.adjunctInstructor.effectiveness} staffer in your party at a time`,
        professionalTrainer: `Trains up to ${gameModifiers.professionalTrainer.effectiveness} staffers in your party at a time`,
        initiate: `An initiate into the shadow government still learning the ropes`,
        veteranInitiate: `An adept member of the shadow government, ready to take on greater responsibility`,
        lobbyist: `Get paid ${getPercent(
            LOBBYIST_MODIFIER.payoutPerPlayer ?? 0,
        )} more political capital from resolutions. Earn ${getPercent(
            LOBBYIST_MODIFIER.earlyVotingBonus ?? 0,
        )} more from early voting bonuses.`,
        politicalSpy: `Allows viewing of enemy political parties and political capital`,
        informant: `Allows viewing the cast votes ahead of tallying`,
    };
};
