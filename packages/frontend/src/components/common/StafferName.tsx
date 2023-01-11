/**
 * Copyright (c) 2023 - KM
 */

import { Avatar } from "@chakra-ui/react";
import { DEFAULT_STAFFER, IActiveStaffer } from "@pc2/api";
import * as React from "react";
import styles from "./StafferName.module.scss";

export const StafferName: React.FC<{ staffer: IActiveStaffer; showType?: boolean }> = ({ staffer, showType }) => {
    return (
        <div className={styles.nameContainer}>
            <Avatar
                size="md"
                name={staffer.stafferDetails.displayName}
                showBorder
                src={`https://robohash.org/${staffer.stafferDetails.displayName}?set=set${staffer.avatarSet}`}
            />
            <div>{staffer.stafferDetails.displayName}</div>
            {showType && <div>, {DEFAULT_STAFFER[staffer.stafferDetails.type].displayName}</div>}
        </div>
    );
};
