/*
 * Copyright 2023 KM.
 */

// NOTE: this is a generated file, please run yarn convert in the api package to regenerate it.

import {
  type IIntern,
  type INewHire,
  type IAccountant,
  type ISeasonedStaffer,
  type IChiefOfStaff,
  type IPoliticalCommentator,
  type IHeadOfHr,
  type IProfessor,
  type IRepresentative,
  type ISeniorRepresentative,
  type IIndependentRepresentative,
  type ISenator,
  type ISeasonedSenator,
  type IIndependentSenator,
  type IPhoneBanker,
  type ISocialMediaManager,
  type IRecruiter,
  type IHrManager,
  type IAdjunctInstructor,
  type IProfessionalTrainer,
  type IInitiate,
  type IVeteranInitiate,
  type ILobbyist,
  type IPoliticalSpy,
  type IInformant,
} from "./IStaffer";
import { type IVisit } from "./visit";

export interface IAllStaffers {
  intern: IIntern;
  newHire: INewHire;
  accountant: IAccountant;
  seasonedStaffer: ISeasonedStaffer;
  chiefOfStaff: IChiefOfStaff;
  politicalCommentator: IPoliticalCommentator;
  headOfHr: IHeadOfHr;
  professor: IProfessor;
  representative: IRepresentative;
  seniorRepresentative: ISeniorRepresentative;
  independentRepresentative: IIndependentRepresentative;
  senator: ISenator;
  seasonedSenator: ISeasonedSenator;
  independentSenator: IIndependentSenator;
  phoneBanker: IPhoneBanker;
  socialMediaManager: ISocialMediaManager;
  recruiter: IRecruiter;
  hrManager: IHrManager;
  adjunctInstructor: IAdjunctInstructor;
  professionalTrainer: IProfessionalTrainer;
  initiate: IInitiate;
  veteranInitiate: IVeteranInitiate;
  lobbyist: ILobbyist;
  politicalSpy: IPoliticalSpy;
  informant: IInformant;
  unknown: never;
}

export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];

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

export namespace IStaffer {
  export const isIntern = (staffer: IPossibleStaffer): staffer is IIntern => {
    return staffer.type === "intern";
  };

  export const isNewHire = (staffer: IPossibleStaffer): staffer is INewHire => {
    return staffer.type === "newHire";
  };

  export const isAccountant = (staffer: IPossibleStaffer): staffer is IAccountant => {
    return staffer.type === "accountant";
  };

  export const isSeasonedStaffer = (staffer: IPossibleStaffer): staffer is ISeasonedStaffer => {
    return staffer.type === "seasonedStaffer";
  };

  export const isChiefOfStaff = (staffer: IPossibleStaffer): staffer is IChiefOfStaff => {
    return staffer.type === "chiefOfStaff";
  };

  export const isPoliticalCommentator = (staffer: IPossibleStaffer): staffer is IPoliticalCommentator => {
    return staffer.type === "politicalCommentator";
  };

  export const isHeadOfHr = (staffer: IPossibleStaffer): staffer is IHeadOfHr => {
    return staffer.type === "headOfHr";
  };

  export const isProfessor = (staffer: IPossibleStaffer): staffer is IProfessor => {
    return staffer.type === "professor";
  };

  export const isRepresentative = (staffer: IPossibleStaffer): staffer is IRepresentative => {
    return staffer.type === "representative";
  };

  export const isSeniorRepresentative = (staffer: IPossibleStaffer): staffer is ISeniorRepresentative => {
    return staffer.type === "seniorRepresentative";
  };

  export const isIndependentRepresentative = (staffer: IPossibleStaffer): staffer is IIndependentRepresentative => {
    return staffer.type === "independentRepresentative";
  };

  export const isSenator = (staffer: IPossibleStaffer): staffer is ISenator => {
    return staffer.type === "senator";
  };

  export const isSeasonedSenator = (staffer: IPossibleStaffer): staffer is ISeasonedSenator => {
    return staffer.type === "seasonedSenator";
  };

  export const isIndependentSenator = (staffer: IPossibleStaffer): staffer is IIndependentSenator => {
    return staffer.type === "independentSenator";
  };

  export const isPhoneBanker = (staffer: IPossibleStaffer): staffer is IPhoneBanker => {
    return staffer.type === "phoneBanker";
  };

  export const isSocialMediaManager = (staffer: IPossibleStaffer): staffer is ISocialMediaManager => {
    return staffer.type === "socialMediaManager";
  };

  export const isRecruiter = (staffer: IPossibleStaffer): staffer is IRecruiter => {
    return staffer.type === "recruiter";
  };

  export const isHrManager = (staffer: IPossibleStaffer): staffer is IHrManager => {
    return staffer.type === "hrManager";
  };

  export const isAdjunctInstructor = (staffer: IPossibleStaffer): staffer is IAdjunctInstructor => {
    return staffer.type === "adjunctInstructor";
  };

  export const isProfessionalTrainer = (staffer: IPossibleStaffer): staffer is IProfessionalTrainer => {
    return staffer.type === "professionalTrainer";
  };

  export const isInitiate = (staffer: IPossibleStaffer): staffer is IInitiate => {
    return staffer.type === "initiate";
  };

  export const isVeteranInitiate = (staffer: IPossibleStaffer): staffer is IVeteranInitiate => {
    return staffer.type === "veteranInitiate";
  };

  export const isLobbyist = (staffer: IPossibleStaffer): staffer is ILobbyist => {
    return staffer.type === "lobbyist";
  };

  export const isPoliticalSpy = (staffer: IPossibleStaffer): staffer is IPoliticalSpy => {
    return staffer.type === "politicalSpy";
  };

  export const isInformant = (staffer: IPossibleStaffer): staffer is IInformant => {
    return staffer.type === "informant";
  };

  export const visit = <ReturnValue>(value: IPossibleStaffer, visitor: IVisit<IAllStaffers, ReturnValue>) => {
    if (isIntern(value)) {
      return visitor.intern(value);
    }

    if (isNewHire(value)) {
      return visitor.newHire(value);
    }

    if (isAccountant(value)) {
      return visitor.accountant(value);
    }

    if (isSeasonedStaffer(value)) {
      return visitor.seasonedStaffer(value);
    }

    if (isChiefOfStaff(value)) {
      return visitor.chiefOfStaff(value);
    }

    if (isPoliticalCommentator(value)) {
      return visitor.politicalCommentator(value);
    }

    if (isHeadOfHr(value)) {
      return visitor.headOfHr(value);
    }

    if (isProfessor(value)) {
      return visitor.professor(value);
    }

    if (isRepresentative(value)) {
      return visitor.representative(value);
    }

    if (isSeniorRepresentative(value)) {
      return visitor.seniorRepresentative(value);
    }

    if (isIndependentRepresentative(value)) {
      return visitor.independentRepresentative(value);
    }

    if (isSenator(value)) {
      return visitor.senator(value);
    }

    if (isSeasonedSenator(value)) {
      return visitor.seasonedSenator(value);
    }

    if (isIndependentSenator(value)) {
      return visitor.independentSenator(value);
    }

    if (isPhoneBanker(value)) {
      return visitor.phoneBanker(value);
    }

    if (isSocialMediaManager(value)) {
      return visitor.socialMediaManager(value);
    }

    if (isRecruiter(value)) {
      return visitor.recruiter(value);
    }

    if (isHrManager(value)) {
      return visitor.hrManager(value);
    }

    if (isAdjunctInstructor(value)) {
      return visitor.adjunctInstructor(value);
    }

    if (isProfessionalTrainer(value)) {
      return visitor.professionalTrainer(value);
    }

    if (isInitiate(value)) {
      return visitor.initiate(value);
    }

    if (isVeteranInitiate(value)) {
      return visitor.veteranInitiate(value);
    }

    if (isLobbyist(value)) {
      return visitor.lobbyist(value);
    }

    if (isPoliticalSpy(value)) {
      return visitor.politicalSpy(value);
    }

    if (isInformant(value)) {
      return visitor.informant(value);
    }

    return visitor.unknown(value);
  };
}
