/**
 * Copyright (c) 2023 - KM
 */

import { Avatar } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IActivePlayer, IActiveStaffer, IAvatarSet, IPlayer } from "@pc2/api";
import * as React from "react";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
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

export const PlayerName: React.FC<{ player: IPlayer; activePlayer: IActivePlayer; sizeOverride?: "lg" }> = ({
    player,
    activePlayer,
    sizeOverride,
}) => {
    const avatarSet = avatar(activePlayer.avatarSet);

    return (
        <Avatar
            className={styles.avatar}
            size={sizeOverride ?? "xl"}
            name={player.name}
            showBorder
            src={`https://robohash.org/${player.name}?set=set${avatarSet}`}
        />
    );
};

export const PCAvatar: React.FC<{ sizeOverride?: "lg" }> = ({ sizeOverride }) => {
    return (
        <Avatar
            className={styles.avatar}
            size={sizeOverride ?? "xl"}
            name="Political Capital 2"
            showBorder
            src={`https://api.dicebear.com/5.x/fun-emoji/svg?seed=Political Capital 2`}
        />
    );
};

export const AnonymousAvatar: React.FC<{ sizeOverride?: "lg" }> = ({ sizeOverride }) => {
    return (
        <Avatar
            className={styles.avatar}
            size={sizeOverride ?? "xl"}
            name="Anonymous"
            showBorder
            src={`https://api.dicebear.com/5.x/identicon/svg?seed=Anonymous`}
        />
    );
};

export const StafferName: React.FC<{
    staffer: IActiveStaffer;
    showType?: boolean;
    showDescription?: boolean;
    avatarExclusive?: boolean;
}> = ({ staffer, showType, showDescription, avatarExclusive }) => {
    const avatarSet = avatar(staffer.avatarSet);
    const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

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
            <div className={styles.detailsContainer}>
                <div className={styles.nameAndType}>
                    {staffer.stafferDetails.displayName}
                    {showType && <div>, {DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>}
                </div>
                {showDescription && (
                    <div className={styles.description}>
                        {descriptionOfStaffer(resolvedGameModifiers)[staffer.stafferDetails.type]}
                    </div>
                )}
            </div>
        </div>
    );
};
