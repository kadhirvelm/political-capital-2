/**
 * Copyright (c) 2023 - KM
 */

import { Avatar } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IActivePlayer, IActiveStaffer, IAvatarSet, IPlayer } from "@pc2/api";
import * as React from "react";
import styles from "./StafferName.module.scss";

const avatar = (avatarSet: IAvatarSet) => {
    if (avatarSet === "robots") {
        return 1;
    }

    if (avatarSet === "monsters") {
        return 2;
    }

    if (avatarSet === "cats") {
        return 4;
    }

    if (avatarSet === "humans") {
        return 5;
    }

    return 5;
};

export const PlayerName: React.FC<{ player: IPlayer; activePlayer: IActivePlayer }> = ({ player, activePlayer }) => {
    const avatarSet = avatar(activePlayer.avatarSet);

    return (
        <Avatar
            className={styles.avatar}
            size="xl"
            name={player.name}
            showBorder
            src={`https://robohash.org/${player.name}?set=set${avatarSet}`}
        />
    );
};

export const StafferName: React.FC<{ staffer: IActiveStaffer; showType?: boolean; avatarExclusive?: boolean }> = ({
    staffer,
    showType,
    avatarExclusive,
}) => {
    const avatarSet = avatar(staffer.avatarSet);

    if (avatarExclusive) {
        return (
            <Avatar
                className={styles.avatar}
                size="md"
                name={staffer.stafferDetails.displayName}
                showBorder
                src={`https://robohash.org/${staffer.stafferDetails.displayName}?set=set${avatarSet}`}
            />
        );
    }

    return (
        <div className={styles.nameContainer}>
            <Avatar
                className={styles.avatar}
                size="md"
                name={staffer.stafferDetails.displayName}
                showBorder
                src={`https://robohash.org/${staffer.stafferDetails.displayName}?set=set${avatarSet}`}
            />
            <div>{staffer.stafferDetails.displayName}</div>
            {showType && <div>, {DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>}
        </div>
    );
};
