/**
 * Copyright (c) 2022 - KM
 */

import { IAllStaffers } from "@pc2/api";
import { IResolvedGameModifiersForEachStaffer } from "../selectors/gameModifiers";

type IDescriptionOfStaffer = {
    [key in Exclude<keyof IAllStaffers, "unknown">]: string;
};

export const descriptionOfStaffer = (gameModifiers: IResolvedGameModifiersForEachStaffer): IDescriptionOfStaffer => {
    return {
        intern: "A college intern, doesn't provide much value - yet",
        newHire: `Provides ${gameModifiers.newHire.effectiveness} political capital every day`,
        accountant: `Provides a 20% discount in political capital when hiring any staffer`,
        seasonedStaffer: `Provides ${gameModifiers.seasonedStaffer.effectiveness} political capital every day.`,
        chiefOfStaff: `Reduces training and hiring time of staffers by 15%`,
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
        lobbyist: `Get paid 10% more political capital from resolutions.`,
        politicalSpy: `Allows viewing of enemy political parties and political capital`,
        informant: `Allows viewing the cast votes ahead of tallying`,
    };
};
