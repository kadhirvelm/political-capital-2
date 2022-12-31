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
    costToAcquire: 1;
    timeToAcquire: 6;
    type: "intern";
}

export interface INewHire extends IBasicStaffer {
    upgradedFrom: ["intern"];
    costToAcquire: 1;
    timeToAcquire: 6;
    type: "newHire";
}

export interface IRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: [];
    costToAcquire: 2;
    timeToAcquire: 12;
    votes: 1;
    type: "representative";
}

export interface ISeniorRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: ["representative"];
    costToAcquire: 4;
    timeToAcquire: 12;
    votes: 2;
    type: "seniorRepresentative";
}

export interface IIndependentRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: ["representative"];
    costToAcquire: 4;
    timeToAcquire: 12;
    votes: 1;
    isIndependent: true;
    type: "independentRepresentative";
}

export interface IPhoneBanker extends IBasicStaffer, IGenerator {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    payout: 0.5;
    type: "phoneBanker";
}

export interface ISocialMediaManager extends IBasicStaffer, IGenerator {
    upgradedFrom: ["phoneBanker", "newHire"];
    costToAcquire: 4;
    timeToAcquire: 12;
    payout: 1;
    type: "socialMediaManager";
}

export interface IRecruiter extends IBasicStaffer, IRecruit {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    recruitCapacity: 1;
    type: "recruiter";
}

export interface IHrManager extends IBasicStaffer, IRecruit {
    upgradedFrom: ["recruiter", "newHire"];
    costToAcquire: 2;
    timeToAcquire: 12;
    recruitCapacity: 2;
    type: "hrManager";
}

export interface IPartTimeInstructor extends IBasicStaffer, ITrainer {
    upgradedFrom: [];
    costToAcquire: 1;
    timeToAcquire: 6;
    trainingCapacity: 1;
    type: "partTimeInstructor";
}

export interface ICoach extends IBasicStaffer, ITrainer {
    upgradedFrom: ["partTimeInstructor", "newHire"];
    costToAcquire: 2;
    timeToAcquire: 12;
    trainingCapacity: 2;
    type: "coach";
}
