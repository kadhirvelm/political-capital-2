/**
 * Copyright (c) 2022 - KM
 */

import { IAllStaffers } from "./generatedStaffers";

export interface IBasicStaffer {
    displayName: string;
    upgradedFrom: Array<keyof IAllStaffers>;
    costToAcquire: number;
    timeToAcquire: number;
    type: keyof IAllStaffers;
}

export interface IVoter {
    votes: number;
    isIndependent?: boolean;
}

export interface IGenerator {
    payout: number;
}

export interface IRecruit {
    recruitCapacity: number;
}

export interface ITrainer {
    trainingCapacity: number;
}

export interface IIntern extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 0;
    timeToAcquire: 21;
    type: "intern";
}

export interface INewHire extends IBasicStaffer, IGenerator {
    upgradedFrom: ["intern"];
    costToAcquire: 0;
    timeToAcquire: 21;
    payout: 0.15;
    type: "newHire";
}

export interface ISeasonedStaffer extends IBasicStaffer, IGenerator {
    upgradedFrom: ["newHire"];
    costToAcquire: 10;
    timeToAcquire: 42;
    payout: 0.25;
    type: "seasonedStaffer";
}

export interface IPoliticalCommentator extends IBasicStaffer, IGenerator, IVoter {
    upgradedFrom: ["seasonedStaffer"];
    costToAcquire: 10;
    timeToAcquire: 42;
    payout: 0.5;
    votes: 2;
    type: "politicalCommentator";
}

export interface IRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: [];
    costToAcquire: 10;
    timeToAcquire: 42;
    votes: 1;
    type: "representative";
}

export interface ISeniorRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: ["representative"];
    costToAcquire: 8;
    timeToAcquire: 42;
    votes: 2;
    type: "seniorRepresentative";
}

export interface IIndependentRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: ["representative"];
    costToAcquire: 8;
    timeToAcquire: 42;
    votes: 1;
    isIndependent: true;
    type: "independentRepresentative";
}

export interface ISenator extends IBasicStaffer, IVoter {
    upgradedFrom: ["seniorRepresentative"];
    costToAcquire: 6;
    timeToAcquire: 42;
    votes: 3;
    type: "senator";
}

export interface ISeasonedSenator extends IBasicStaffer, IVoter {
    upgradedFrom: ["senator"];
    costToAcquire: 4;
    timeToAcquire: 42;
    votes: 4;
    type: "seasonedSenator";
}

export interface IIndependentSenator extends IBasicStaffer, IVoter {
    upgradedFrom: ["senator"];
    costToAcquire: 4;
    timeToAcquire: 42;
    votes: 3;
    isIndependent: true;
    type: "independentSenator";
}

export interface IPhoneBanker extends IBasicStaffer, IGenerator {
    upgradedFrom: [];
    costToAcquire: 5;
    timeToAcquire: 36;
    payout: 0.4;
    type: "phoneBanker";
}

export interface ISocialMediaManager extends IBasicStaffer, IGenerator {
    upgradedFrom: ["phoneBanker", "newHire"];
    costToAcquire: 5;
    timeToAcquire: 36;
    payout: 0.8;
    type: "socialMediaManager";
}

export interface IRecruiter extends IBasicStaffer, IRecruit {
    upgradedFrom: [];
    costToAcquire: 5;
    timeToAcquire: 36;
    recruitCapacity: 1;
    type: "recruiter";
}

export interface IHrManager extends IBasicStaffer, IRecruit {
    upgradedFrom: ["recruiter", "newHire"];
    costToAcquire: 5;
    timeToAcquire: 36;
    recruitCapacity: 2;
    type: "hrManager";
}

export interface IPartTimeInstructor extends IBasicStaffer, ITrainer {
    upgradedFrom: [];
    costToAcquire: 5;
    timeToAcquire: 36;
    trainingCapacity: 1;
    type: "partTimeInstructor";
}

export interface ICoach extends IBasicStaffer, ITrainer {
    upgradedFrom: ["partTimeInstructor", "newHire"];
    costToAcquire: 5;
    timeToAcquire: 36;
    trainingCapacity: 2;
    type: "coach";
}
