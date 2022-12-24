/**
 * Copyright (c) 2022 - KM
 */

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
import { PlayerServiceFrontend } from "@pc2/api";
import * as React from "react";
import { getOrCreateBrowserRid, useHandlePlayerAndSocketRegistration } from "../../hooks/handlePlayerRegistration";
import { usePoliticalCapitalDispatch, usePoliticalCapitalSelector } from "../../store/createStore";
import { setPlayer } from "../../store/playerState";
import { checkIsError } from "../../utility/alertOnError";

export const RegisterPlayerModal: React.FC<{}> = ({}) => {
    const { isLoading } = useHandlePlayerAndSocketRegistration();

    const dispatch = usePoliticalCapitalDispatch();
    const player = usePoliticalCapitalSelector((s) => s.playerState.player);

    const [name, setName] = React.useState(player?.name ?? "");
    const onNameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => setName(event.currentTarget.value);

    const onConfirm = async () => {
        if (name === "") {
            return;
        }

        const newPlayer = checkIsError(
            await PlayerServiceFrontend.registerNewPlayer({ browserIdentifier: getOrCreateBrowserRid(), name }),
        );
        if (newPlayer === undefined) {
            return;
        }

        dispatch(setPlayer(newPlayer.player));
    };

    return (
        <Modal isOpen={player === undefined && !isLoading} onClose={() => {}}>
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
