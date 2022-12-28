/**
 * Copyright (c) 2022 - KM
 */

import { IPartTimeInstructor } from "@pc2/api";
import * as React from "react";
import { IUserFacingResolveEvents } from "../../store/gameState";

export const TrainerActivation: React.FC<{
    trainer: IPartTimeInstructor;
    resolveGameEvents: IUserFacingResolveEvents[];
}> = ({ trainer, resolveGameEvents }) => {
    return (
        <div>
            {trainer.trainingCapacity} trainer {resolveGameEvents.length}
        </div>
    );
};
