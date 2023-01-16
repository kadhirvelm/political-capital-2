/**
 * Copyright (c) 2022 - KM
 */

import { IAllStaffers } from "./generatedStaffers";

export interface IBasicStaffer {
    displayName: string;
    upgradedFrom: Array<keyof IAllStaffers>;
    costToAcquire: number;
    timeToAcquire: number;
    limitPerParty?: number;
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

export interface IShadowGovernment {
    shadowGovernment: true;
}

export interface IIntern extends IBasicStaffer {
    upgradedFrom: [];
    costToAcquire: 0;
    timeToAcquire: 18;
    type: "intern";
}

export interface INewHire extends IBasicStaffer, IGenerator {
    upgradedFrom: ["intern"];
    costToAcquire: 0;
    timeToAcquire: 18;
    payout: 0.15;
    type: "newHire";
}

export interface IAccountant extends IBasicStaffer {
    upgradedFrom: ["newHire"];
    costToAcquire: 10;
    timeToAcquire: 18;
    limitPerParty: 1;
    type: "accountant";
}

export interface ISeasonedStaffer extends IBasicStaffer, IGenerator {
    upgradedFrom: ["newHire"];
    costToAcquire: 0;
    timeToAcquire: 18;
    payout: 0.25;
    limitPerParty: 2;
    type: "seasonedStaffer";
}

export interface IChiefOfStaff extends IBasicStaffer {
    upgradedFrom: ["seasonedStaffer"];
    costToAcquire: 10;
    timeToAcquire: 36;
    limitPerParty: 1;
    type: "chiefOfStaff";
}

export interface IPoliticalCommentator extends IBasicStaffer, IGenerator {
    upgradedFrom: ["seasonedStaffer"];
    costToAcquire: 30;
    timeToAcquire: 36;
    payout: 1.3;
    limitPerParty: 1;
    type: "politicalCommentator";
}

export interface IHeadOfHr extends IBasicStaffer, IRecruit {
    upgradedFrom: ["seasonedStaffer"];
    costToAcquire: 30;
    timeToAcquire: 36;
    recruitCapacity: 3;
    limitPerParty: 1;
    type: "headOfHr";
}

export interface IProfessor extends IBasicStaffer, ITrainer {
    upgradedFrom: ["seasonedStaffer"];
    costToAcquire: 30;
    timeToAcquire: 36;
    trainingCapacity: 3;
    limitPerParty: 1;
    type: "professor";
}

export interface IRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: [];
    costToAcquire: 10;
    timeToAcquire: 36;
    votes: 1;
    limitPerParty: 5;
    type: "representative";
}

export interface ISeniorRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: ["representative"];
    costToAcquire: 10;
    timeToAcquire: 18;
    votes: 2;
    limitPerParty: 5;
    type: "seniorRepresentative";
}

export interface IIndependentRepresentative extends IBasicStaffer, IVoter {
    upgradedFrom: ["representative"];
    costToAcquire: 10;
    timeToAcquire: 18;
    votes: 1;
    isIndependent: true;
    limitPerParty: 5;
    type: "independentRepresentative";
}

export interface ISenator extends IBasicStaffer, IVoter {
    upgradedFrom: ["seniorRepresentative"];
    costToAcquire: 10;
    timeToAcquire: 18;
    votes: 3;
    type: "senator";
}

export interface ISeasonedSenator extends IBasicStaffer, IVoter {
    upgradedFrom: ["senator"];
    costToAcquire: 15;
    timeToAcquire: 18;
    votes: 4;
    type: "seasonedSenator";
}

export interface IIndependentSenator extends IBasicStaffer, IVoter {
    upgradedFrom: ["senator"];
    costToAcquire: 15;
    timeToAcquire: 18;
    votes: 3;
    isIndependent: true;
    type: "independentSenator";
}

export interface IPhoneBanker extends IBasicStaffer, IGenerator {
    upgradedFrom: [];
    costToAcquire: 10;
    timeToAcquire: 18;
    payout: 0.4;
    limitPerParty: 3;
    type: "phoneBanker";
}

export interface ISocialMediaManager extends IBasicStaffer, IGenerator {
    upgradedFrom: ["phoneBanker"];
    costToAcquire: 20;
    timeToAcquire: 36;
    payout: 0.8;
    limitPerParty: 2;
    type: "socialMediaManager";
}

export interface IRecruiter extends IBasicStaffer, IRecruit {
    upgradedFrom: [];
    costToAcquire: 10;
    timeToAcquire: 36;
    recruitCapacity: 1;
    limitPerParty: 2;
    type: "recruiter";
}

export interface IHrManager extends IBasicStaffer, IRecruit {
    upgradedFrom: ["recruiter"];
    costToAcquire: 20;
    timeToAcquire: 36;
    recruitCapacity: 2;
    limitPerParty: 1;
    type: "hrManager";
}

export interface IAdjunctInstructor extends IBasicStaffer, ITrainer {
    upgradedFrom: [];
    costToAcquire: 10;
    timeToAcquire: 36;
    trainingCapacity: 1;
    limitPerParty: 2;
    type: "adjunctInstructor";
}

export interface IProfessionalTrainer extends IBasicStaffer, ITrainer {
    upgradedFrom: ["adjunctInstructor"];
    costToAcquire: 20;
    timeToAcquire: 36;
    trainingCapacity: 2;
    limitPerParty: 1;
    type: "professionalTrainer";
}

export interface IInitiate extends IBasicStaffer, IShadowGovernment {
    upgradedFrom: [];
    costToAcquire: 10;
    timeToAcquire: 18;
    shadowGovernment: true;
    type: "initiate";
}

export interface IVeteranInitiate extends IBasicStaffer, IShadowGovernment {
    upgradedFrom: ["initiate"];
    costToAcquire: 10;
    timeToAcquire: 18;
    shadowGovernment: true;
    limitPerParty: 1;
    type: "veteranInitiate";
}

export interface ILobbyist extends IBasicStaffer, IShadowGovernment {
    upgradedFrom: ["veteranInitiate"];
    costToAcquire: 15;
    timeToAcquire: 36;
    shadowGovernment: true;
    limitPerParty: 1;
    type: "lobbyist";
}

export interface IPoliticalSpy extends IBasicStaffer, IShadowGovernment {
    upgradedFrom: ["veteranInitiate"];
    costToAcquire: 15;
    timeToAcquire: 36;
    shadowGovernment: true;
    limitPerParty: 1;
    type: "politicalSpy";
}

export interface IInformant extends IBasicStaffer, IShadowGovernment {
    upgradedFrom: ["veteranInitiate"];
    costToAcquire: 15;
    timeToAcquire: 36;
    shadowGovernment: true;
    limitPerParty: 1;
    type: "informant";
}
