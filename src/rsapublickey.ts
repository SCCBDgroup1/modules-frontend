import * as bcu from 'bigint-crypto-utils';

//RsaPublicKey interface
interface RsaPublicKeyInterface {
    e: bigint;
    n: bigint;
    n2: bigint;
    k?: bigint;
    encrypt(m: bigint): bigint;
    verify(c: bigint): bigint;
}

//RsaPublicKey model
export class RsaPublicKey implements RsaPublicKeyInterface {

    //variables
    e: bigint;
    n: bigint;
    n2: bigint;
    k?: bigint;

    //constuctor
    constructor(e: bigint, n: bigint, k?: bigint){
        this.k = k
        this.e=e;
        this.n=n;
        this.n2=this.n**2n;
    }

    encrypt(m: bigint){
        return bcu.modPow(m, this.e, this.n);
    }

    verify(s: bigint){
        return bcu.modPow(s, this.e, this.n);
    }
}