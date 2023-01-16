/**
 * Copyright (c) 2022 - KM
*/

// NOTE: this is a generated file, please run yarn convert in the api package to regenerate it.

import {
	IIntern,
	INewHire,
	IAccountant,
	ISeasonedStaffer,
	IChiefOfStaff,
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
	ILobbyist,
	IPoliticalSpy,
	IInformant,
} from "./IStaffer";
import { IVisit } from "./IVisit";

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
	intern: {
		displayName: "Intern",
	    upgradedFrom: [],
	    costToAcquire: 0,
	    timeToAcquire: 18,
	    type: "intern",
	},
	newHire: {
		displayName: "New hire",
	    upgradedFrom: ["intern"],
	    costToAcquire: 0,
	    timeToAcquire: 18,
	    payout: 0.15,
	    type: "newHire",
	},
	accountant: {
		displayName: "Accountant",
	    upgradedFrom: ["newHire"],
	    costToAcquire: 10,
	    timeToAcquire: 18,
	    limitPerParty: 1,
	    type: "accountant",
	},
	seasonedStaffer: {
		displayName: "Seasoned staffer",
	    upgradedFrom: ["newHire"],
	    costToAcquire: 0,
	    timeToAcquire: 18,
	    payout: 0.25,
	    limitPerParty: 2,
	    type: "seasonedStaffer",
	},
	chiefOfStaff: {
		displayName: "Chief of staff",
	    upgradedFrom: ["seasonedStaffer"],
	    costToAcquire: 10,
	    timeToAcquire: 36,
	    limitPerParty: 1,
	    type: "chiefOfStaff",
	},
	politicalCommentator: {
		displayName: "Political commentator",
	    upgradedFrom: ["seasonedStaffer"],
	    costToAcquire: 30,
	    timeToAcquire: 36,
	    payout: 1.3,
	    limitPerParty: 1,
	    type: "politicalCommentator",
	},
	headOfHr: {
		displayName: "Head of hr",
	    upgradedFrom: ["seasonedStaffer"],
	    costToAcquire: 30,
	    timeToAcquire: 36,
	    recruitCapacity: 3,
	    limitPerParty: 1,
	    type: "headOfHr",
	},
	professor: {
		displayName: "Professor",
	    upgradedFrom: ["seasonedStaffer"],
	    costToAcquire: 30,
	    timeToAcquire: 36,
	    trainingCapacity: 3,
	    limitPerParty: 1,
	    type: "professor",
	},
	representative: {
		displayName: "Representative",
	    upgradedFrom: [],
	    costToAcquire: 10,
	    timeToAcquire: 36,
	    votes: 1,
	    limitPerParty: 5,
	    type: "representative",
	},
	seniorRepresentative: {
		displayName: "Senior representative",
	    upgradedFrom: ["representative"],
	    costToAcquire: 10,
	    timeToAcquire: 18,
	    votes: 2,
	    limitPerParty: 5,
	    type: "seniorRepresentative",
	},
	independentRepresentative: {
		displayName: "Independent representative",
	    upgradedFrom: ["representative"],
	    costToAcquire: 10,
	    timeToAcquire: 18,
	    votes: 1,
	    isIndependent: true,
	    limitPerParty: 5,
	    type: "independentRepresentative",
	},
	senator: {
		displayName: "Senator",
	    upgradedFrom: ["seniorRepresentative"],
	    costToAcquire: 10,
	    timeToAcquire: 18,
	    votes: 3,
	    type: "senator",
	},
	seasonedSenator: {
		displayName: "Seasoned senator",
	    upgradedFrom: ["senator"],
	    costToAcquire: 15,
	    timeToAcquire: 18,
	    votes: 4,
	    type: "seasonedSenator",
	},
	independentSenator: {
		displayName: "Independent senator",
	    upgradedFrom: ["senator"],
	    costToAcquire: 15,
	    timeToAcquire: 18,
	    votes: 3,
	    isIndependent: true,
	    type: "independentSenator",
	},
	phoneBanker: {
		displayName: "Phone banker",
	    upgradedFrom: [],
	    costToAcquire: 10,
	    timeToAcquire: 18,
	    payout: 0.4,
	    limitPerParty: 3,
	    type: "phoneBanker",
	},
	socialMediaManager: {
		displayName: "Social media manager",
	    upgradedFrom: ["phoneBanker"],
	    costToAcquire: 20,
	    timeToAcquire: 36,
	    payout: 0.8,
	    limitPerParty: 2,
	    type: "socialMediaManager",
	},
	recruiter: {
		displayName: "Recruiter",
	    upgradedFrom: [],
	    costToAcquire: 10,
	    timeToAcquire: 36,
	    recruitCapacity: 1,
	    limitPerParty: 2,
	    type: "recruiter",
	},
	hrManager: {
		displayName: "Hr manager",
	    upgradedFrom: ["recruiter"],
	    costToAcquire: 20,
	    timeToAcquire: 36,
	    recruitCapacity: 2,
	    limitPerParty: 1,
	    type: "hrManager",
	},
	adjunctInstructor: {
		displayName: "Adjunct instructor",
	    upgradedFrom: [],
	    costToAcquire: 10,
	    timeToAcquire: 36,
	    trainingCapacity: 1,
	    limitPerParty: 2,
	    type: "adjunctInstructor",
	},
	professionalTrainer: {
		displayName: "Professional trainer",
	    upgradedFrom: ["adjunctInstructor"],
	    costToAcquire: 20,
	    timeToAcquire: 36,
	    trainingCapacity: 2,
	    limitPerParty: 1,
	    type: "professionalTrainer",
	},
	initiate: {
		displayName: "Initiate",
	    upgradedFrom: [],
	    costToAcquire: 10,
	    timeToAcquire: 18,
	    shadowGovernment: true,
	    type: "initiate",
	},
	veteranInitiate: {
		displayName: "Veteran initiate",
	    upgradedFrom: ["initiate"],
	    costToAcquire: 10,
	    timeToAcquire: 18,
	    shadowGovernment: true,
	    limitPerParty: 1,
	    type: "veteranInitiate",
	},
	lobbyist: {
		displayName: "Lobbyist",
	    upgradedFrom: ["veteranInitiate"],
	    costToAcquire: 15,
	    timeToAcquire: 36,
	    shadowGovernment: true,
	    limitPerParty: 1,
	    type: "lobbyist",
	},
	politicalSpy: {
		displayName: "Political spy",
	    upgradedFrom: ["veteranInitiate"],
	    costToAcquire: 15,
	    timeToAcquire: 36,
	    shadowGovernment: true,
	    limitPerParty: 1,
	    type: "politicalSpy",
	},
	informant: {
		displayName: "Informant",
	    upgradedFrom: ["veteranInitiate"],
	    costToAcquire: 15,
	    timeToAcquire: 36,
	    shadowGovernment: true,
	    limitPerParty: 1,
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
