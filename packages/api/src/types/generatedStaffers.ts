/*
 * Copyright 2023 KM.
 */

// NOTE: this is a generated file, please run yarn convert in the api package to regenerate it.

import {
  type IAccountant,
  type IAdjunctInstructor,
  type IChiefOfStaff,
  type IHeadOfHr,
  type IHrManager,
  type IIndependentRepresentative,
  type IIndependentSenator,
  type IInformant,
  type IInitiate,
  type IIntern,
  type ILobbyist,
  type INewHire,
  type IPhoneBanker,
  type IPoliticalCommentator,
  type IPoliticalSpy,
  type IProfessionalTrainer,
  type IProfessor,
  type IRecruiter,
  type IRepresentative,
  type ISeasonedSenator,
  type ISeasonedStaffer,
  type ISenator,
  type ISeniorRepresentative,
  type ISocialMediaManager,
  type IVeteranInitiate,
} from "./Staffer";
import { type GenericType, type VisitorPattern } from "./visit";

export interface IAllStaffers {
  accountant: IAccountant;
  adjunctInstructor: IAdjunctInstructor;
  chiefOfStaff: IChiefOfStaff;
  headOfHr: IHeadOfHr;
  hrManager: IHrManager;
  independentRepresentative: IIndependentRepresentative;
  independentSenator: IIndependentSenator;
  informant: IInformant;
  initiate: IInitiate;
  intern: IIntern;
  lobbyist: ILobbyist;
  newHire: INewHire;
  phoneBanker: IPhoneBanker;
  politicalCommentator: IPoliticalCommentator;
  politicalSpy: IPoliticalSpy;
  professionalTrainer: IProfessionalTrainer;
  professor: IProfessor;
  recruiter: IRecruiter;
  representative: IRepresentative;
  seasonedSenator: ISeasonedSenator;
  seasonedStaffer: ISeasonedStaffer;
  senator: ISenator;
  seniorRepresentative: ISeniorRepresentative;
  socialMediaManager: ISocialMediaManager;
  veteranInitiate: IVeteranInitiate;
}

export type IPossibleStaffer = GenericType<IAllStaffers>;

export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {
  accountant: {
    costToAcquire: 10,
    displayName: "Accountant",
    limitPerParty: 1,
    timeToAcquire: 18,
    type: "accountant",
    upgradedFrom: ["newHire"],
  },
  adjunctInstructor: {
    costToAcquire: 10,
    displayName: "Adjunct instructor",
    limitPerParty: 2,
    timeToAcquire: 36,
    trainingCapacity: 1,
    type: "adjunctInstructor",
    upgradedFrom: [],
  },
  chiefOfStaff: {
    costToAcquire: 10,
    displayName: "Chief of staff",
    limitPerParty: 1,
    timeToAcquire: 36,
    type: "chiefOfStaff",
    upgradedFrom: ["seasonedStaffer"],
  },
  headOfHr: {
    costToAcquire: 30,
    displayName: "Head of hr",
    limitPerParty: 1,
    recruitCapacity: 3,
    timeToAcquire: 36,
    type: "headOfHr",
    upgradedFrom: ["seasonedStaffer"],
  },
  hrManager: {
    costToAcquire: 20,
    displayName: "Hr manager",
    limitPerParty: 1,
    recruitCapacity: 2,
    timeToAcquire: 36,
    type: "hrManager",
    upgradedFrom: ["recruiter"],
  },
  independentRepresentative: {
    costToAcquire: 10,
    displayName: "Independent representative",
    isIndependent: true,
    limitPerParty: 5,
    timeToAcquire: 18,
    type: "independentRepresentative",
    upgradedFrom: ["representative"],
    votes: 1,
  },
  independentSenator: {
    costToAcquire: 15,
    displayName: "Independent senator",
    isIndependent: true,
    timeToAcquire: 18,
    type: "independentSenator",
    upgradedFrom: ["senator"],
    votes: 3,
  },
  informant: {
    costToAcquire: 15,
    displayName: "Informant",
    limitPerParty: 1,
    shadowGovernment: true,
    timeToAcquire: 36,
    type: "informant",
    upgradedFrom: ["veteranInitiate"],
  },
  initiate: {
    costToAcquire: 10,
    displayName: "Initiate",
    shadowGovernment: true,
    timeToAcquire: 18,
    type: "initiate",
    upgradedFrom: [],
  },
  intern: {
    costToAcquire: 0,
    displayName: "Intern",
    timeToAcquire: 18,
    type: "intern",
    upgradedFrom: [],
  },
  lobbyist: {
    costToAcquire: 15,
    displayName: "Lobbyist",
    limitPerParty: 1,
    shadowGovernment: true,
    timeToAcquire: 36,
    type: "lobbyist",
    upgradedFrom: ["veteranInitiate"],
  },
  newHire: {
    costToAcquire: 0,
    displayName: "New hire",
    payout: 0.15,
    timeToAcquire: 18,
    type: "newHire",
    upgradedFrom: ["intern"],
  },
  phoneBanker: {
    costToAcquire: 10,
    displayName: "Phone banker",
    limitPerParty: 3,
    payout: 0.4,
    timeToAcquire: 18,
    type: "phoneBanker",
    upgradedFrom: [],
  },
  politicalCommentator: {
    costToAcquire: 30,
    displayName: "Political commentator",
    limitPerParty: 1,
    payout: 1.3,
    timeToAcquire: 36,
    type: "politicalCommentator",
    upgradedFrom: ["seasonedStaffer"],
  },
  politicalSpy: {
    costToAcquire: 15,
    displayName: "Political spy",
    limitPerParty: 1,
    shadowGovernment: true,
    timeToAcquire: 36,
    type: "politicalSpy",
    upgradedFrom: ["veteranInitiate"],
  },
  professionalTrainer: {
    costToAcquire: 20,
    displayName: "Professional trainer",
    limitPerParty: 1,
    timeToAcquire: 36,
    trainingCapacity: 2,
    type: "professionalTrainer",
    upgradedFrom: ["adjunctInstructor"],
  },
  professor: {
    costToAcquire: 30,
    displayName: "Professor",
    limitPerParty: 1,
    timeToAcquire: 36,
    trainingCapacity: 3,
    type: "professor",
    upgradedFrom: ["seasonedStaffer"],
  },
  recruiter: {
    costToAcquire: 10,
    displayName: "Recruiter",
    limitPerParty: 2,
    recruitCapacity: 1,
    timeToAcquire: 36,
    type: "recruiter",
    upgradedFrom: [],
  },
  representative: {
    costToAcquire: 10,
    displayName: "Representative",
    limitPerParty: 5,
    timeToAcquire: 36,
    type: "representative",
    upgradedFrom: [],
    votes: 1,
  },
  seasonedSenator: {
    costToAcquire: 15,
    displayName: "Seasoned senator",
    timeToAcquire: 18,
    type: "seasonedSenator",
    upgradedFrom: ["senator"],
    votes: 4,
  },
  seasonedStaffer: {
    costToAcquire: 0,
    displayName: "Seasoned staffer",
    limitPerParty: 2,
    payout: 0.25,
    timeToAcquire: 18,
    type: "seasonedStaffer",
    upgradedFrom: ["newHire"],
  },
  senator: {
    costToAcquire: 10,
    displayName: "Senator",
    timeToAcquire: 18,
    type: "senator",
    upgradedFrom: ["seniorRepresentative"],
    votes: 3,
  },
  seniorRepresentative: {
    costToAcquire: 10,
    displayName: "Senior representative",
    limitPerParty: 5,
    timeToAcquire: 18,
    type: "seniorRepresentative",
    upgradedFrom: ["representative"],
    votes: 2,
  },
  socialMediaManager: {
    costToAcquire: 20,
    displayName: "Social media manager",
    limitPerParty: 2,
    payout: 0.8,
    timeToAcquire: 36,
    type: "socialMediaManager",
    upgradedFrom: ["phoneBanker"],
  },
  veteranInitiate: {
    costToAcquire: 10,
    displayName: "Veteran initiate",
    limitPerParty: 1,
    shadowGovernment: true,
    timeToAcquire: 18,
    type: "veteranInitiate",
    upgradedFrom: ["initiate"],
  },
};

export const Staffer: VisitorPattern<IAllStaffers> = {
  typeChecks: {
    accountant: (staffer: IPossibleStaffer): staffer is IAccountant => {
      return staffer.type === "accountant";
    },
    adjunctInstructor: (staffer: IPossibleStaffer): staffer is IAdjunctInstructor => {
      return staffer.type === "adjunctInstructor";
    },
    chiefOfStaff: (staffer: IPossibleStaffer): staffer is IChiefOfStaff => {
      return staffer.type === "chiefOfStaff";
    },
    headOfHr: (staffer: IPossibleStaffer): staffer is IHeadOfHr => {
      return staffer.type === "headOfHr";
    },
    hrManager: (staffer: IPossibleStaffer): staffer is IHrManager => {
      return staffer.type === "hrManager";
    },
    independentRepresentative: (staffer: IPossibleStaffer): staffer is IIndependentRepresentative => {
      return staffer.type === "independentRepresentative";
    },
    independentSenator: (staffer: IPossibleStaffer): staffer is IIndependentSenator => {
      return staffer.type === "independentSenator";
    },
    informant: (staffer: IPossibleStaffer): staffer is IInformant => {
      return staffer.type === "informant";
    },
    initiate: (staffer: IPossibleStaffer): staffer is IInitiate => {
      return staffer.type === "initiate";
    },
    intern: (staffer: IPossibleStaffer): staffer is IIntern => {
      return staffer.type === "intern";
    },
    lobbyist: (staffer: IPossibleStaffer): staffer is ILobbyist => {
      return staffer.type === "lobbyist";
    },
    newHire: (staffer: IPossibleStaffer): staffer is INewHire => {
      return staffer.type === "newHire";
    },
    phoneBanker: (staffer: IPossibleStaffer): staffer is IPhoneBanker => {
      return staffer.type === "phoneBanker";
    },
    politicalCommentator: (staffer: IPossibleStaffer): staffer is IPoliticalCommentator => {
      return staffer.type === "politicalCommentator";
    },
    politicalSpy: (staffer: IPossibleStaffer): staffer is IPoliticalSpy => {
      return staffer.type === "politicalSpy";
    },
    professionalTrainer: (staffer: IPossibleStaffer): staffer is IProfessionalTrainer => {
      return staffer.type === "professionalTrainer";
    },
    professor: (staffer: IPossibleStaffer): staffer is IProfessor => {
      return staffer.type === "professor";
    },
    recruiter: (staffer: IPossibleStaffer): staffer is IRecruiter => {
      return staffer.type === "recruiter";
    },
    representative: (staffer: IPossibleStaffer): staffer is IRepresentative => {
      return staffer.type === "representative";
    },
    seasonedSenator: (staffer: IPossibleStaffer): staffer is ISeasonedSenator => {
      return staffer.type === "seasonedSenator";
    },
    seasonedStaffer: (staffer: IPossibleStaffer): staffer is ISeasonedStaffer => {
      return staffer.type === "seasonedStaffer";
    },
    senator: (staffer: IPossibleStaffer): staffer is ISenator => {
      return staffer.type === "senator";
    },
    seniorRepresentative: (staffer: IPossibleStaffer): staffer is ISeniorRepresentative => {
      return staffer.type === "seniorRepresentative";
    },
    socialMediaManager: (staffer: IPossibleStaffer): staffer is ISocialMediaManager => {
      return staffer.type === "socialMediaManager";
    },
    veteranInitiate: (staffer: IPossibleStaffer): staffer is IVeteranInitiate => {
      return staffer.type === "veteranInitiate";
    },
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  visit: (value, visitor) => {
    if (Staffer.typeChecks.accountant(value)) {
      return visitor.accountant(value);
    }
    if (Staffer.typeChecks.adjunctInstructor(value)) {
      return visitor.adjunctInstructor(value);
    }
    if (Staffer.typeChecks.chiefOfStaff(value)) {
      return visitor.chiefOfStaff(value);
    }
    if (Staffer.typeChecks.headOfHr(value)) {
      return visitor.headOfHr(value);
    }
    if (Staffer.typeChecks.hrManager(value)) {
      return visitor.hrManager(value);
    }
    if (Staffer.typeChecks.independentRepresentative(value)) {
      return visitor.independentRepresentative(value);
    }
    if (Staffer.typeChecks.independentSenator(value)) {
      return visitor.independentSenator(value);
    }
    if (Staffer.typeChecks.informant(value)) {
      return visitor.informant(value);
    }
    if (Staffer.typeChecks.initiate(value)) {
      return visitor.initiate(value);
    }
    if (Staffer.typeChecks.intern(value)) {
      return visitor.intern(value);
    }
    if (Staffer.typeChecks.lobbyist(value)) {
      return visitor.lobbyist(value);
    }
    if (Staffer.typeChecks.newHire(value)) {
      return visitor.newHire(value);
    }
    if (Staffer.typeChecks.phoneBanker(value)) {
      return visitor.phoneBanker(value);
    }
    if (Staffer.typeChecks.politicalCommentator(value)) {
      return visitor.politicalCommentator(value);
    }
    if (Staffer.typeChecks.politicalSpy(value)) {
      return visitor.politicalSpy(value);
    }
    if (Staffer.typeChecks.professionalTrainer(value)) {
      return visitor.professionalTrainer(value);
    }
    if (Staffer.typeChecks.professor(value)) {
      return visitor.professor(value);
    }
    if (Staffer.typeChecks.recruiter(value)) {
      return visitor.recruiter(value);
    }
    if (Staffer.typeChecks.representative(value)) {
      return visitor.representative(value);
    }
    if (Staffer.typeChecks.seasonedSenator(value)) {
      return visitor.seasonedSenator(value);
    }
    if (Staffer.typeChecks.seasonedStaffer(value)) {
      return visitor.seasonedStaffer(value);
    }
    if (Staffer.typeChecks.senator(value)) {
      return visitor.senator(value);
    }
    if (Staffer.typeChecks.seniorRepresentative(value)) {
      return visitor.seniorRepresentative(value);
    }
    if (Staffer.typeChecks.socialMediaManager(value)) {
      return visitor.socialMediaManager(value);
    }
    if (Staffer.typeChecks.veteranInitiate(value)) {
      return visitor.veteranInitiate(value);
    }
    return visitor.unknown(value);
  },
};
