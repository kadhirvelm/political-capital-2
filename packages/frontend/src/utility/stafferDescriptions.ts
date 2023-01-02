/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, IAllStaffers } from "@pc2/api";
import { IResolvedGameModifiers } from "../selectors/gameModifiers";
import { roundToThousand } from "./roundTo";

type IDescriptionOfStaffer = {
    [key in Exclude<keyof IAllStaffers, "unknown">]: string;
};

export const descriptionOfStaffer = (gameModifiers: IResolvedGameModifiers): IDescriptionOfStaffer => {
    return {
        intern: "A college intern, doesn't provide much value - yet",
        newHire: `Provides ${roundToThousand(
            DEFAULT_STAFFER.newHire.payout * gameModifiers.staffers.newHire.effectiveness,
        )} political capital every day`,
        seasonedStaffer: `Provides ${roundToThousand(
            DEFAULT_STAFFER.seasonedStaffer.payout * gameModifiers.staffers.newHire.effectiveness,
        )} political capital every day`,
        politicalCommentator: `Provides ${roundToThousand(
            DEFAULT_STAFFER.politicalCommentator.payout * gameModifiers.staffers.newHire.effectiveness,
        )} political capital every day and provides ${DEFAULT_STAFFER.politicalCommentator.votes} votes on resolutions`,
        representative: `Provides ${Math.floor(
            DEFAULT_STAFFER.representative.votes * gameModifiers.staffers.representative.effectiveness,
        )} vote on resolutions`,
        seniorRepresentative: `Provides ${Math.floor(
            DEFAULT_STAFFER.seniorRepresentative.votes * gameModifiers.staffers.seniorRepresentative.effectiveness,
        )} votes on resolutions`,
        independentRepresentative: `Provides ${Math.floor(
            DEFAULT_STAFFER.independentRepresentative.votes *
                gameModifiers.staffers.independentRepresentative.effectiveness,
        )} vote to pass, and ${Math.floor(
            DEFAULT_STAFFER.independentRepresentative.votes *
                gameModifiers.staffers.independentRepresentative.effectiveness,
        )} vote to fail on resolutions`,
        senator: `Provides ${Math.floor(
            DEFAULT_STAFFER.senator.votes * gameModifiers.staffers.senator.effectiveness,
        )} votes on resolutions`,
        seasonedSenator: `Provides ${Math.floor(
            DEFAULT_STAFFER.seasonedSenator.votes * gameModifiers.staffers.seasonedSenator.effectiveness,
        )} votes on resolutions`,
        independentSenator: `Provides ${Math.floor(
            DEFAULT_STAFFER.independentSenator.votes * gameModifiers.staffers.independentSenator.effectiveness,
        )} votes to pass, and ${Math.floor(
            DEFAULT_STAFFER.independentSenator.votes * gameModifiers.staffers.independentSenator.effectiveness,
        )} votes to fail on resolutions`,
        phoneBanker: `Generates ${roundToThousand(
            DEFAULT_STAFFER.phoneBanker.payout * gameModifiers.staffers.phoneBanker.effectiveness,
        )} political capital every day`,
        socialMediaManager: `Generates ${roundToThousand(
            DEFAULT_STAFFER.socialMediaManager.payout * gameModifiers.staffers.socialMediaManager.effectiveness,
        )} political capital every day`,
        recruiter: `Recruits ${Math.floor(
            DEFAULT_STAFFER.recruiter.recruitCapacity * gameModifiers.staffers.recruiter.effectiveness,
        )} staffer to your party at a time`,
        hrManager: `Recruits up to ${Math.floor(
            DEFAULT_STAFFER.hrManager.recruitCapacity * gameModifiers.staffers.hrManager.effectiveness,
        )} staffers to your party at a time`,
        partTimeInstructor: `Trains ${Math.floor(
            DEFAULT_STAFFER.partTimeInstructor.trainingCapacity *
                gameModifiers.staffers.partTimeInstructor.effectiveness,
        )} staffer in your party at a time`,
        coach: `Trains up to ${Math.floor(
            DEFAULT_STAFFER.coach.trainingCapacity * gameModifiers.staffers.coach.effectiveness,
        )} staffers in your party at a time`,
    };
};
