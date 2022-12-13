/**
 * Copyright (c) 2022 - KM
 */

import { IPlayer, PlayerServiceFrontend } from "@pc2/api";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import * as React from "react";
import { checkIsError } from "../utility/alertOnError";

export const PlayerModal: React.FC<{
    isOpen: boolean;
    browserIdentifier: string;
    onCreate: (newPlayer: IPlayer) => void;
}> = ({ browserIdentifier, isOpen, onCreate }) => {
    const [name, setName] = React.useState("");

    const onNameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);

    const onConfirm = async () => {
        if (name === "") {
            return;
        }

        const newPlayer = checkIsError(await PlayerServiceFrontend.registerNewPlayer({ browserIdentifier, name }));
        if (newPlayer === undefined) {
            return;
        }

        onCreate(newPlayer.player);
    };

    return (
        <Modal isOpen={isOpen} onClose={() => {}}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New player</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <div>Name</div>
                    <Input onChange={onNameUpdate} value={name} />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="green" disabled={name === ""} onClick={onConfirm}>
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
