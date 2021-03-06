import {RsaPublicKey} from "./rsapublickey";
import * as bc from 'bigint-conversion'

const API_URL_KEYS = 'http://localhost:4000/api/rsa/pubKey';
const API_URL_PAILLIER_KEYS = 'http://localhost:4000/api/paillier/pubKey';

export const serverPubKeyPromise: Promise<RsaPublicKey> = new Promise(resolve => {
    fetch(API_URL_KEYS).then((response: Response) => {
        console.log(response.body)
        response.json().then(jsonData => {
            const pubKey = new RsaPublicKey(bc.hexToBigint(jsonData.e), bc.hexToBigint(jsonData.n))
            resolve(pubKey)
        })
    })
})

export const serverPaillierPubKeyPromise: Promise<RsaPublicKey> = new Promise(resolve => {
    fetch(API_URL_PAILLIER_KEYS).then((response: Response) => {
        console.log(response.body)
        response.json().then(jsonData => {
            const pubKey = new RsaPublicKey(bc.hexToBigint(jsonData.e), bc.hexToBigint(jsonData.n))
            resolve(pubKey)
        })
    })
})