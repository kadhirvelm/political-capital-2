/**
 * Copyright (c) 2022 - KM
 */

import { IAllStaffers } from "@pc2/api";
import { IResolvedGameModifiers } from "../selectors/gameModifiers";
import { roundToThousand } from "./roundTo";

type IDescriptionOfStaffer = {
    [key in Exclude<keyof IAllStaffers, "unknown">]: string;
};

export const descriptionOfStaffer = (gameModifiers: IResolvedGameModifiers): IDescriptionOfStaffer => {
    return {
        intern: "A college intern, doesn't provide much value - yet",
        newHire: `Provides ${roundToThousand(
            0.25 * gameModifiers.staffers.newHire.effectiveness,
        )} political capital every day`,
        representative: `Provides ${Math.floor(
            1 * gameModifiers.staffers.representative.effectiveness,
        )} vote on resolutions`,
        seniorRepresentative: `Provides ${Math.floor(
            2 * gameModifiers.staffers.seniorRepresentative.effectiveness,
        )} votes on resolutions`,
        independentRepresentative: `Provides ${Math.floor(
            1 * gameModifiers.staffers.independentRepresentative.effectiveness,
        )} vote to pass, and ${Math.floor(
            2 * gameModifiers.staffers.independentRepresentative.effectiveness,
        )} vote to fail on resolutions`,
        senator: `Provides ${Math.floor(3 * gameModifiers.staffers.senator.effectiveness)} votes on resolutions`,
        seasonedSenator: `Provides ${Math.floor(
            4 * gameModifiers.staffers.seasonedSenator.effectiveness,
        )} votes on resolutions`,
        independentSenator: `Provides ${Math.floor(
            3 * gameModifiers.staffers.independentSenator.effectiveness,
        )} votes to pass, and ${Math.floor(
            3 * gameModifiers.staffers.independentSenator.effectiveness,
        )} votes to fail on resolutions`,
        phoneBanker: `Generates ${roundToThousand(
            0.5 * gameModifiers.staffers.phoneBanker.effectiveness,
        )} political capital every day`,
        socialMediaManager: `Generates ${roundToThousand(
            0.5 * gameModifiers.staffers.socialMediaManager.effectiveness,
        )} political capital every day`,
        recruiter: `Recruits ${Math.floor(
            1 * gameModifiers.staffers.recruiter.effectiveness,
        )} staffer to your party at a time`,
        hrManager: `Recruits up to ${Math.floor(
            2 * gameModifiers.staffers.hrManager.effectiveness,
        )} staffers to your party at a time`,
        partTimeInstructor: `Trains ${Math.floor(
            1 * gameModifiers.staffers.partTimeInstructor.effectiveness,
        )} staffer in your party at a time`,
        coach: `Trains up to ${Math.floor(
            2 * gameModifiers.staffers.coach.effectiveness,
        )} staffers in your party at a time`,
    };
};
