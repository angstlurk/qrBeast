import { beginCell, toNano } from '@ton/core';
import { SampleJetton } from '../wrappers/Jetton';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils';
import { KeyPair } from '@ton/crypto';
import dotenv from 'dotenv';

const jettonParams = {
    name: 'QR beast Jetton',
    description: 'QR beast Jetton is a token for the QR beast project',
    symbol: 'QRBJ',
    image: '',
};

export const max_supply = toNano(100322689011);

export const loadKeysFromEnv = (): KeyPair => {
    dotenv.config();

    const privateKey = Buffer.from(process.env.PRIVATE_KEY ?? '', 'hex');
    const publicKey = Buffer.from(process.env.PUBLIC_KEY ?? '', 'hex');

    return { secretKey: privateKey, publicKey: publicKey };
};

export async function run(provider: NetworkProvider) {
    const keypair = loadKeysFromEnv();
    const sender = provider.sender();
    if (sender.address === undefined) throw new Error('sender address is undefined');
    let publicKey = beginCell().storeBuffer(keypair.publicKey).endCell().beginParse().loadUintBig(256);
    const jetton = provider.open(
        await SampleJetton.fromInit(sender.address, buildOnchainMetadata(jettonParams), max_supply, publicKey),
    );

    await jetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(jetton.address);

    // run methods on `jetton`
}
