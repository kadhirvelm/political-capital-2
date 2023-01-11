/**
 * Copyright (c) 2022 - KM
 */

// NOTE: this is a generated file, please run yarn convert in the api package to regenerate it.

import {
    IIntern,
    INewHire,
    ISeasonedStaffer,
    IPoliticalCommentator,
    IHeadOfHr,
    IProfessor,
    IRepresentative,
    ISeniorRepresentative,
    IIndependentRepresentative,
    ISenator,
    ISeasonedSenator,
    IIndependentSenator,
    IPhoneBanker,
    ISocialMediaManager,
    IRecruiter,
    IHrManager,
    IAdjunctInstructor,
    IProfessionalTrainer,
    IInitiate,
    IVeteranInitiate,
    IPoliticalSpy,
    IInformationBroker,
    IInformant,
} from "./IStaffer";
import { IVisit } from "./IVisit";

export interface IAllStaffers {
    intern: IIntern;
    newHire: INewHire;
    seasonedStaffer: ISeasonedStaffer;
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
    politicalSpy: IPoliticalSpy;
    informationBroker: IInformationBroker;
    informant: IInformant;
    unknown: never;
}

export type IPossibleStaffer = IAllStaffers[keyof IAllStaffers];

export const DEFAULT_STAFFER: Omit<IAllStaffers, "unknown"> = {
    intern: {
        displayName: "Intern",
        upgradedFrom: [],
        costToAcquire: 0,
        timeToAcquire: 15,
        type: "intern",
    },
    newHire: {
        displayName: "New hire",
        upgradedFrom: ["intern"],
        costToAcquire: 0,
        timeToAcquire: 15,
        payout: 0.15,
        type: "newHire",
    },
    seasonedStaffer: {
        displayName: "Seasoned staffer",
        upgradedFrom: ["newHire"],
        costToAcquire: 0,
        timeToAcquire: 15,
        payout: 0.25,
        limitPerParty: 2,
        type: "seasonedStaffer",
    },
    politicalCommentator: {
        displayName: "Political commentator",
        upgradedFrom: ["seasonedStaffer"],
        costToAcquire: 10,
        timeToAcquire: 28,
        payout: 2,
        limitPerParty: 1,
        type: "politicalCommentator",
    },
    headOfHr: {
        displayName: "Head of hr",
        upgradedFrom: ["seasonedStaffer"],
        costToAcquire: 30,
        timeToAcquire: 28,
        recruitCapacity: 3,
        limitPerParty: 1,
        type: "headOfHr",
    },
    professor: {
        displayName: "Professor",
        upgradedFrom: ["seasonedStaffer"],
        costToAcquire: 30,
        timeToAcquire: 28,
        trainingCapacity: 3,
        limitPerParty: 1,
        type: "professor",
    },
    representative: {
        displayName: "Representative",
        upgradedFrom: [],
        costToAcquire: 10,
        timeToAcquire: 30,
        votes: 1,
        limitPerParty: 5,
        type: "representative",
    },
    seniorRepresentative: {
        displayName: "Senior representative",
        upgradedFrom: ["representative"],
        costToAcquire: 15,
        timeToAcquire: 20,
        votes: 2,
        limitPerParty: 5,
        type: "seniorRepresentative",
    },
    independentRepresentative: {
        displayName: "Independent representative",
        upgradedFrom: ["representative"],
        costToAcquire: 15,
        timeToAcquire: 20,
        votes: 1,
        isIndependent: true,
        limitPerParty: 5,
        type: "independentRepresentative",
    },
    senator: {
        displayName: "Senator",
        upgradedFrom: ["seniorRepresentative"],
        costToAcquire: 20,
        timeToAcquire: 20,
        votes: 3,
        type: "senator",
    },
    seasonedSenator: {
        displayName: "Seasoned senator",
        upgradedFrom: ["senator"],
        costToAcquire: 25,
        timeToAcquire: 20,
        votes: 4,
        type: "seasonedSenator",
    },
    independentSenator: {
        displayName: "Independent senator",
        upgradedFrom: ["senator"],
        costToAcquire: 25,
        timeToAcquire: 20,
        votes: 3,
        isIndependent: true,
        type: "independentSenator",
    },
    phoneBanker: {
        displayName: "Phone banker",
        upgradedFrom: [],
        costToAcquire: 5,
        timeToAcquire: 28,
        payout: 0.4,
        limitPerParty: 5,
        type: "phoneBanker",
    },
    socialMediaManager: {
        displayName: "Social media manager",
        upgradedFrom: ["phoneBanker"],
        costToAcquire: 5,
        timeToAcquire: 28,
        payout: 0.8,
        type: "socialMediaManager",
    },
    recruiter: {
        displayName: "Recruiter",
        upgradedFrom: [],
        costToAcquire: 5,
        timeToAcquire: 28,
        recruitCapacity: 1,
        limitPerParty: 3,
        type: "recruiter",
    },
    hrManager: {
        displayName: "Hr manager",
        upgradedFrom: ["recruiter"],
        costToAcquire: 5,
        timeToAcquire: 28,
        recruitCapacity: 2,
        type: "hrManager",
    },
    adjunctInstructor: {
        displayName: "Adjunct instructor",
        upgradedFrom: [],
        costToAcquire: 5,
        timeToAcquire: 28,
        trainingCapacity: 1,
        limitPerParty: 3,
        type: "adjunctInstructor",
    },
    professionalTrainer: {
        displayName: "Professional trainer",
        upgradedFrom: ["adjunctInstructor"],
        costToAcquire: 5,
        timeToAcquire: 28,
        trainingCapacity: 2,
        type: "professionalTrainer",
    },
    initiate: {
        displayName: "Initiate",
        upgradedFrom: [],
        costToAcquire: 10,
        timeToAcquire: 21,
        shadowGovernment: true,
        type: "initiate",
    },
    veteranInitiate: {
        displayName: "Veteran initiate",
        upgradedFrom: ["initiate"],
        costToAcquire: 10,
        timeToAcquire: 21,
        shadowGovernment: true,
        limitPerParty: 1,
        type: "veteranInitiate",
    },
    politicalSpy: {
        displayName: "Political spy",
        upgradedFrom: ["veteranInitiate"],
        costToAcquire: 5,
        timeToAcquire: 30,
        shadowGovernment: true,
        limitPerParty: 1,
        type: "politicalSpy",
    },
    informationBroker: {
        displayName: "Information broker",
        upgradedFrom: ["veteranInitiate"],
        costToAcquire: 0,
        timeToAcquire: 15,
        shadowGovernment: true,
        limitPerParty: 1,
        payout: 1,
        type: "informationBroker",
    },
    informant: {
        displayName: "Informant",
        upgradedFrom: ["veteranInitiate"],
        costToAcquire: 80,
        timeToAcquire: 30,
        shadowGovernment: true,
        limitPerParty: 0,
        type: "informant",
    },
};

export namespace IStaffer {
    export const isIntern = (staffer: IPossibleStaffer): staffer is IIntern => {
        return staffer.type === "intern";
    };

    export const isNewHire = (staffer: IPossibleStaffer): staffer is INewHire => {
        return staffer.type === "newHire";
    };

    export const isSeasonedStaffer = (staffer: IPossibleStaffer): staffer is ISeasonedStaffer => {
        return staffer.type === "seasonedStaffer";
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

    export const isPoliticalSpy = (staffer: IPossibleStaffer): staffer is IPoliticalSpy => {
        return staffer.type === "politicalSpy";
    };

    export const isInformationBroker = (staffer: IPossibleStaffer): staffer is IInformationBroker => {
        return staffer.type === "informationBroker";
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

        if (isSeasonedStaffer(value)) {
            return visitor.seasonedStaffer(value);
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

        if (isPoliticalSpy(value)) {
            return visitor.politicalSpy(value);
        }

        if (isInformationBroker(value)) {
            return visitor.informationBroker(value);
        }

        if (isInformant(value)) {
            return visitor.informant(value);
        }

        return visitor.unknown(value);
    };
}
