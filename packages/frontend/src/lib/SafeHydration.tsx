import { PropsWithChildren } from "react";

export const SafeHydration = ({ children }: PropsWithChildren) => {
    if (typeof window === "undefined") {
        return children;
    }

    return children;
};
