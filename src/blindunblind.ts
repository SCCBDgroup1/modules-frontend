import * as bcu from 'bigint-crypto-utils';
import { RsaPublicKey } from './rsapublickey';

export async function blinding (m: bigint, publicKey: RsaPublicKey): Promise<bigint> {
    let coprimes;
    do 
    {
        publicKey.k = bcu.randBetween(publicKey.n,0n);
        coprimes= bcu.gcd(publicKey.k, publicKey.n);
    } 
    while (coprimes!==1n);
    const blindedMsg = publicKey.encrypt(publicKey.k) * m % publicKey.n;

    return blindedMsg;
}

export async function unblinding (m: bigint, publicKey: RsaPublicKey): Promise<bigint> {

    if (publicKey.k === undefined) {
        throw new Error("You have to blind before unblind");
    }
    const rInv:bigint= bcu.modInv(publicKey.k, publicKey.n);

    const finalResult: bigint= m*rInv % publicKey.n; 

    return finalResult;
}