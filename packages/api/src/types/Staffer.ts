/*
 * Copyright 2023 KM.
 */

import { type IAllStaffers } from "./generatedStaffers";

export interface IBasicStaffer {
  costToAcquire: number;
  displayName: string;
  limitPerParty?: number;
  timeToAcquire: number;
  type: keyof IAllStaffers;
  upgradedFrom: Array<keyof IAllStaffers>;
}

export interface IVoter {
  isIndependent?: boolean;
  votes: number;
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
  costToAcquire: 0;
  timeToAcquire: 18;
  type: "intern";
  upgradedFrom: [];
}

export interface INewHire extends IBasicStaffer, IGenerator {
  costToAcquire: 0;
  payout: 0.15;
  timeToAcquire: 18;
  type: "newHire";
  upgradedFrom: ["intern"];
}

export interface IAccountant extends IBasicStaffer {
  costToAcquire: 10;
  limitPerParty: 1;
  timeToAcquire: 18;
  type: "accountant";
  upgradedFrom: ["newHire"];
}

export interface ISeasonedStaffer extends IBasicStaffer, IGenerator {
  costToAcquire: 0;
  limitPerParty: 2;
  payout: 0.25;
  timeToAcquire: 18;
  type: "seasonedStaffer";
  upgradedFrom: ["newHire"];
}

export interface IChiefOfStaff extends IBasicStaffer {
  costToAcquire: 10;
  limitPerParty: 1;
  timeToAcquire: 36;
  type: "chiefOfStaff";
  upgradedFrom: ["seasonedStaffer"];
}

export interface IPoliticalCommentator extends IBasicStaffer, IGenerator {
  costToAcquire: 30;
  limitPerParty: 1;
  payout: 1.3;
  timeToAcquire: 36;
  type: "politicalCommentator";
  upgradedFrom: ["seasonedStaffer"];
}

export interface IHeadOfHr extends IBasicStaffer, IRecruit {
  costToAcquire: 30;
  limitPerParty: 1;
  recruitCapacity: 3;
  timeToAcquire: 36;
  type: "headOfHr";
  upgradedFrom: ["seasonedStaffer"];
}

export interface IProfessor extends IBasicStaffer, ITrainer {
  costToAcquire: 30;
  limitPerParty: 1;
  timeToAcquire: 36;
  trainingCapacity: 3;
  type: "professor";
  upgradedFrom: ["seasonedStaffer"];
}

export interface IRepresentative extends IBasicStaffer, IVoter {
  costToAcquire: 10;
  limitPerParty: 5;
  timeToAcquire: 36;
  type: "representative";
  upgradedFrom: [];
  votes: 1;
}

export interface ISeniorRepresentative extends IBasicStaffer, IVoter {
  costToAcquire: 10;
  limitPerParty: 5;
  timeToAcquire: 18;
  type: "seniorRepresentative";
  upgradedFrom: ["representative"];
  votes: 2;
}

export interface IIndependentRepresentative extends IBasicStaffer, IVoter {
  costToAcquire: 10;
  isIndependent: true;
  limitPerParty: 5;
  timeToAcquire: 18;
  type: "independentRepresentative";
  upgradedFrom: ["representative"];
  votes: 1;
}

export interface ISenator extends IBasicStaffer, IVoter {
  costToAcquire: 10;
  timeToAcquire: 18;
  type: "senator";
  upgradedFrom: ["seniorRepresentative"];
  votes: 3;
}

export interface ISeasonedSenator extends IBasicStaffer, IVoter {
  costToAcquire: 15;
  timeToAcquire: 18;
  type: "seasonedSenator";
  upgradedFrom: ["senator"];
  votes: 4;
}

export interface IIndependentSenator extends IBasicStaffer, IVoter {
  costToAcquire: 15;
  isIndependent: true;
  timeToAcquire: 18;
  type: "independentSenator";
  upgradedFrom: ["senator"];
  votes: 3;
}

export interface IPhoneBanker extends IBasicStaffer, IGenerator {
  costToAcquire: 10;
  limitPerParty: 3;
  payout: 0.4;
  timeToAcquire: 18;
  type: "phoneBanker";
  upgradedFrom: [];
}

export interface ISocialMediaManager extends IBasicStaffer, IGenerator {
  costToAcquire: 20;
  limitPerParty: 2;
  payout: 0.8;
  timeToAcquire: 36;
  type: "socialMediaManager";
  upgradedFrom: ["phoneBanker"];
}

export interface IRecruiter extends IBasicStaffer, IRecruit {
  costToAcquire: 10;
  limitPerParty: 2;
  recruitCapacity: 1;
  timeToAcquire: 36;
  type: "recruiter";
  upgradedFrom: [];
}

export interface IHrManager extends IBasicStaffer, IRecruit {
  costToAcquire: 20;
  limitPerParty: 1;
  recruitCapacity: 2;
  timeToAcquire: 36;
  type: "hrManager";
  upgradedFrom: ["recruiter"];
}

export interface IAdjunctInstructor extends IBasicStaffer, ITrainer {
  costToAcquire: 10;
  limitPerParty: 2;
  timeToAcquire: 36;
  trainingCapacity: 1;
  type: "adjunctInstructor";
  upgradedFrom: [];
}

export interface IProfessionalTrainer extends IBasicStaffer, ITrainer {
  costToAcquire: 20;
  limitPerParty: 1;
  timeToAcquire: 36;
  trainingCapacity: 2;
  type: "professionalTrainer";
  upgradedFrom: ["adjunctInstructor"];
}

export interface IInitiate extends IBasicStaffer, IShadowGovernment {
  costToAcquire: 10;
  shadowGovernment: true;
  timeToAcquire: 18;
  type: "initiate";
  upgradedFrom: [];
}

export interface IVeteranInitiate extends IBasicStaffer, IShadowGovernment {
  costToAcquire: 10;
  limitPerParty: 1;
  shadowGovernment: true;
  timeToAcquire: 18;
  type: "veteranInitiate";
  upgradedFrom: ["initiate"];
}

export interface ILobbyist extends IBasicStaffer, IShadowGovernment {
  costToAcquire: 15;
  limitPerParty: 1;
  shadowGovernment: true;
  timeToAcquire: 36;
  type: "lobbyist";
  upgradedFrom: ["veteranInitiate"];
}

export interface IPoliticalSpy extends IBasicStaffer, IShadowGovernment {
  costToAcquire: 15;
  limitPerParty: 1;
  shadowGovernment: true;
  timeToAcquire: 36;
  type: "politicalSpy";
  upgradedFrom: ["veteranInitiate"];
}

export interface IInformant extends IBasicStaffer, IShadowGovernment {
  costToAcquire: 15;
  limitPerParty: 1;
  shadowGovernment: true;
  timeToAcquire: 36;
  type: "informant";
  upgradedFrom: ["veteranInitiate"];
}
