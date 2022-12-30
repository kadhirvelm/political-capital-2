/**
 * Copyright (c) 2022 - KM
 */

import { IAllStaffers } from "@pc2/api";

type IDescriptionOfStaffer = {
    [key in Exclude<keyof IAllStaffers, "unknown">]: string;
};

export const descriptionOfStaffer: IDescriptionOfStaffer = {
    intern: "Something something intern",
    newHire: "Something something new hire",
    representative: "Provides 1 vote on resolutions",
    seniorRepresentative: "Provides 2 votes on resolutions",
    independentRepresentative: "Provides 1 vote to pass, and one vote to fail on resolutions",
    phoneBanker: "Generates 0.5 political capital every day.",
    socialMediaManager: "Generates 1 political capital every day.",
    recruiter: "Recruits 1 staffer to your party at a time.",
    hrManager: "Recruits up to 2 staffers to your party at a time.",
    partTimeInstructor: "Trains 1 staffer in your party at a time.",
    coach: "Trains up to 2 staffers in your party at a time.",
};
