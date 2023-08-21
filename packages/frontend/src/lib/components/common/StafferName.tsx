/*
 * Copyright 2023 KM.
 */

import { Avatar } from "@chakra-ui/react";
import { DEFAULT_STAFFER, type IActivePlayer, type IActiveStaffer, type IAvatarSet, type IPlayer } from "@pc2/api";
import { getGameModifiers } from "../../selectors/gameModifiers";
import { usePoliticalCapitalSelector } from "../../store/createStore";
import { descriptionOfStaffer } from "../../utility/stafferDescriptions";
import styles from "./StafferName.module.scss";
import { type FC } from "react";

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

export const PlayerName: FC<{ activePlayer: IActivePlayer; player: IPlayer; sizeOverride?: "lg" }> = ({
  player,
  activePlayer,
  sizeOverride,
}) => {
  const avatarSet = avatar(activePlayer.avatarSet);

  return (
    <Avatar
      className={styles.avatar}
      name={player.name}
      showBorder
      size={sizeOverride ?? "xl"}
      src={`https://robohash.org/${player.name}?set=set${avatarSet}`}
    />
  );
};

export const PCAvatar: FC<{ sizeOverride?: "lg" }> = ({ sizeOverride }) => {
  return (
    <Avatar
      className={styles.avatar}
      name="Political Capital 2"
      showBorder
      size={sizeOverride ?? "xl"}
      src={`https://api.dicebear.com/5.x/lorelei-neutral/svg?seed=Political%20Capital%202`}
    />
  );
};

export const AnonymousAvatar: FC<{ sizeOverride?: "lg" }> = ({ sizeOverride }) => {
  return (
    <Avatar
      className={styles.avatar}
      name="Anonymous"
      showBorder
      size={sizeOverride ?? "xl"}
      src={`http://${window.location.hostname}:3002/anonymous.png`}
    />
  );
};

export const StafferName: FC<{
  avatarExclusive?: boolean;
  showDescription?: boolean;
  showType?: boolean;
  staffer: IActiveStaffer;
}> = ({ staffer, showType, showDescription, avatarExclusive }) => {
  const avatarSet = avatar(staffer.avatarSet);
  const resolvedGameModifiers = usePoliticalCapitalSelector(getGameModifiers);

  if (avatarExclusive) {
    return (
      <Avatar
        className={styles.avatar}
        name={staffer.stafferDetails.displayName}
        showBorder
        size="md"
        src={`https://robohash.org/${staffer.stafferDetails.displayName}?set=set${avatarSet}`}
      />
    );
  }

  return (
    <div className={styles.nameContainer}>
      <Avatar
        className={styles.avatar}
        name={staffer.stafferDetails.displayName}
        showBorder
        size="md"
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
