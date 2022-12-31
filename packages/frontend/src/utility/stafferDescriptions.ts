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
        intern: "Something something intern",
        newHire: "Something something new hire",
        representative: `Provides ${Math.floor(
            1 * gameModifiers.staffers.representative.effectiveness,
        )} vote on resolutions`,
        seniorRepresentative: `Provides ${Math.floor(
            2 * gameModifiers.staffers.seniorRepresentative.effectiveness,
        )} votes on resolutions`,
        independentRepresentative: `Provides ${Math.floor(
            2 * gameModifiers.staffers.independentRepresentative.effectiveness,
        )} vote to pass, and ${Math.floor(
            2 * gameModifiers.staffers.independentRepresentative.effectiveness,
        )} vote to fail on resolutions`,
        phoneBanker: `Generates ${roundToThousand(
            0.5 * gameModifiers.staffers.phoneBanker.effectiveness,
        )} political capital every day.`,
        socialMediaManager: `Generates ${roundToThousand(
            0.5 * gameModifiers.staffers.socialMediaManager.effectiveness,
        )} political capital every day.`,
        recruiter: `Recruits ${Math.floor(
            1 * gameModifiers.staffers.recruiter.effectiveness,
        )} staffer to your party at a time.`,
        hrManager: `Recruits up to ${Math.floor(
            2 * gameModifiers.staffers.hrManager.effectiveness,
        )} staffers to your party at a time.`,
        partTimeInstructor: `Trains ${Math.floor(
            1 * gameModifiers.staffers.partTimeInstructor.effectiveness,
        )} staffer in your party at a time.`,
        coach: `Trains up to ${Math.floor(
            2 * gameModifiers.staffers.coach.effectiveness,
        )} staffers in your party at a time.`,
    };
};
