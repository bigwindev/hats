import { createMessage, decrypt, encrypt, PrivateKey, readMessage } from "openpgp";
import { useCallback, useRef, useState } from "react";
import { IStoredKey } from "../../types/types";
import CopyToClipboard from "../Shared/CopyToClipboard";
import Modal from "../Shared/Modal";
import { usePrivateKey } from "./util";
import LockIcon from '../../assets//icons/lock.icon'

export default function Decrypt({ storedKey }: { storedKey: IStoredKey }) {
    const privateKey = usePrivateKey(storedKey)
    const [error, setError] = useState<string>()
    const [showKeyDetails, setShowKeyDetails] = useState(false)
    const encryptedMessageRef = useRef<HTMLTextAreaElement>(null)
    const decryptedMessageRef = useRef<HTMLTextAreaElement>(null)

    const _decrypt = useCallback(async () => {
        try {
            const armoredMessage = encryptedMessageRef.current!.value
            console.log({ armoredMessage, privateKey: privateKey?.armor() })
            const message = await readMessage({ armoredMessage })
            const { data: decrypted } = await decrypt({ message, decryptionKeys: privateKey })
            decryptedMessageRef.current!.value = decrypted
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }, [privateKey])

    const _encrypt = useCallback(async () => {
        try {
            const message = await createMessage({ text: decryptedMessageRef.current!.value })
            encryptedMessageRef.current!.value = await encrypt({ message, encryptionKeys: privateKey?.toPublic() })
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }, [privateKey])

    if (!privateKey) return <></>

    return <div className="decrypt-message">
        <div className="show-key-details">
            <button onClick={() => setShowKeyDetails(true)}>Show key details</button>
        </div>
        {error && <p>{error}</p>}
        {showKeyDetails && <Modal
            title={storedKey.alias}
            setShowModal={setShowKeyDetails}
            height="243px">
            <KeyDetails storedKey={storedKey} privateKey={privateKey} />
        </Modal>}
        <div className="encrypted-message">
            <p>Encrypted message</p>
            <textarea ref={encryptedMessageRef} cols={80} rows={15} />
            <button onClick={_decrypt}>Decrypt</button>
        </div>
        <div className="decrypted-message">
            <p>Decrypted message</p>
            <textarea ref={decryptedMessageRef} cols={80} rows={15} />
            <button onClick={_encrypt}>Encrypt</button>
        </div>
    </div>
}


function KeyDetails({ storedKey, privateKey }: {
    storedKey: IStoredKey
    privateKey: PrivateKey
}) {
    return <div className="key-details">
        <div className="row">
            <div className="row public-key">
                <p>Public Key</p>
                <CopyToClipboard value={privateKey.toPublic().armor()} />
            </div>
            <div className="row private-key">
                <p>Private Key</p>
                <CopyToClipboard value={privateKey.armor()} />
            </div>
        </div>
        {storedKey.passphrase && <div className="row">
            <p>Passphrase</p><CopyToClipboard value={storedKey.passphrase} />
        </div>}
    </div>
}