/**
 * Copyright (c) 2022 - KM
 */

"use client";

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
    useToast,
} from "@chakra-ui/react";
import { PlayerServiceFrontend } from "@pc2/api";
import { getOrCreateBrowserRid } from "../../hooks/handlePlayerRegistration";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { setPlayer } from "../../store/playerState";
import { checkIsError } from "../../utility/alertOnError";
import { FC, useState, ChangeEvent } from "react";

export const RegisterPlayerModal: FC<{}> = ({}) => {
    const toast = useToast();
    const dispatch = usePoliticalCapitalDispatch();

    const isConnectedToServer = usePoliticalCapitalSelector((s) => s.playerState.isConnectedToServer);
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);

    const [name, setName] = useState(player?.name ?? "");
    const onNameUpdate = (event: ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);

    const onConfirm = async () => {
        if (name === "") {
            return;
        }

        const newPlayer = checkIsError(
            await PlayerServiceFrontend.registerNewPlayer({ browserIdentifier: getOrCreateBrowserRid(), name }),
            toast,
        );
        if (newPlayer === undefined) {
            return;
        }

        dispatch(setPlayer(newPlayer.player));
    };

    return (
        <Modal isOpen={player === undefined && isConnectedToServer} onClose={() => {}}>
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
