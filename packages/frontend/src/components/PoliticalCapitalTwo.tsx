/**
 * Copyright (c) 2022 - KM
 */

import * as React from "react";
import { useHandlePlayerRegistration } from "../hooks/handlePlayerRegistration";
import { PlayerModal } from "./PlayerModal";

export const PoliticalCapitalTwo: React.FC<{}> = () => {
    const { browserIdentifier, isLoading, player } = useHandlePlayerRegistration();

    const onCreateNewPlayer = () => window.location.reload();

    const maybeRenderWelcomePlayer = () => {
        if (player === undefined) {
            return undefined;
        }

        return <div>Welcome {player.name}!</div>;
    };

    return (
        <div>
            <div>Political capital two</div>
            {maybeRenderWelcomePlayer()}
            <PlayerModal
                isOpen={player === undefined && !isLoading}
                browserIdentifier={browserIdentifier}
                onCreate={onCreateNewPlayer}
            />
        </div>
    );
};
