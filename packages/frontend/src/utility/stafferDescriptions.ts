/**
 * Copyright (c) 2022 - KM
 */

import { DEFAULT_STAFFER, IAllStaffers, isGenerator, isRecruit, isTrainer, isVoter } from "@pc2/api";
import { IResolvedGameModifiers } from "../selectors/gameModifiers";
import { roundToThousand } from "./roundTo";

type IDescriptionOfStaffer = {
    [key in Exclude<keyof IAllStaffers, "unknown">]: string;
};

export const getEffectivenessNumber = (
    gameModifiers: IResolvedGameModifiers,
    stafferType: Exclude<keyof IAllStaffers, "unknown">,
): number => {
    const defaultStaffer = DEFAULT_STAFFER[stafferType];

    if (isVoter(defaultStaffer)) {
        return Math.floor(defaultStaffer.votes * gameModifiers.staffers[stafferType].effectiveness);
    }

    if (isGenerator(defaultStaffer)) {
        return roundToThousand(defaultStaffer.payout * gameModifiers.staffers[stafferType].effectiveness);
    }

    if (isRecruit(defaultStaffer)) {
        return Math.floor(defaultStaffer.recruitCapacity * gameModifiers.staffers[stafferType].effectiveness);
    }

    if (isTrainer(defaultStaffer)) {
        return Math.floor(defaultStaffer.trainingCapacity * gameModifiers.staffers[stafferType].effectiveness);
    }

    return 0;
};

export const descriptionOfStaffer = (gameModifiers: IResolvedGameModifiers): IDescriptionOfStaffer => {
    return {
        intern: "A college intern, doesn't provide much value - yet",
        newHire: `Provides ${getEffectivenessNumber(gameModifiers, "newHire")} political capital every day`,
        seasonedStaffer: `Provides ${getEffectivenessNumber(
            gameModifiers,
            "seasonedStaffer",
        )} political capital every day.`,
        politicalCommentator: `Provides ${getEffectivenessNumber(
            gameModifiers,
            "politicalCommentator",
        )} political capital every day.`,
        headOfHr: `Recruits up to ${getEffectivenessNumber(
            gameModifiers,
            "headOfHr",
        )} staffers to your party at a time.`,
        professor: `Trains up to ${getEffectivenessNumber(
            gameModifiers,
            "professor",
        )} staffers in your party at a time.`,
        representative: `Provides ${getEffectivenessNumber(gameModifiers, "representative")} vote on resolutions`,
        seniorRepresentative: `Provides ${getEffectivenessNumber(
            gameModifiers,
            "seniorRepresentative",
        )} votes on resolutions`,
        independentRepresentative: `Provides ${getEffectivenessNumber(
            gameModifiers,
            "independentRepresentative",
        )} vote to pass, and ${getEffectivenessNumber(
            gameModifiers,
            "independentRepresentative",
        )} vote to fail on resolutions`,
        senator: `Provides ${getEffectivenessNumber(gameModifiers, "senator")} votes on resolutions`,
        seasonedSenator: `Provides ${getEffectivenessNumber(gameModifiers, "seasonedSenator")} votes on resolutions`,
        independentSenator: `Provides ${getEffectivenessNumber(
            gameModifiers,
            "independentSenator",
        )} votes to pass, and ${getEffectivenessNumber(
            gameModifiers,
            "independentSenator",
        )} votes to fail on resolutions`,
        phoneBanker: `Generates ${getEffectivenessNumber(gameModifiers, "phoneBanker")} political capital every day`,
        socialMediaManager: `Generates ${getEffectivenessNumber(
            gameModifiers,
            "socialMediaManager",
        )} political capital every day`,
        recruiter: `Recruits ${getEffectivenessNumber(gameModifiers, "recruiter")} staffer to your party at a time`,
        hrManager: `Recruits up to ${getEffectivenessNumber(
            gameModifiers,
            "hrManager",
        )} staffers to your party at a time`,
        adjunctInstructor: `Trains ${getEffectivenessNumber(
            gameModifiers,
            "adjunctInstructor",
        )} staffer in your party at a time`,
        professionalTrainer: `Trains up to ${getEffectivenessNumber(
            gameModifiers,
            "professionalTrainer",
        )} staffers in your party at a time`,
        initiate: `An initiate into the shadow government still learning the ropes`,
        veteranInitiate: `An adept member of the shadow government, ready to take on greater responsibility`,
        politicalSpy: `Allows viewing of enemy political parties`,
        informationBroker: `Allows viewing enemy political capital. Also provides ${getEffectivenessNumber(
            gameModifiers,
            "informationBroker",
        )} political capital per day`,
        informant: `Allows viewing the cast votes ahead of tallying`,
    };
};
