import { beginCell, toNano } from '@ton/core';
import { SampleJetton } from '../wrappers/Jetton';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils';
import { loadKeysFromEnv } from './deployJetton';

const jettonParams = {
    name: 'QR beast Jetton',
    description: 'QR beast Jetton is a token for the QR beast project',
    symbol: 'QRBJ',
    image: '',
};

export async function run(provider: NetworkProvider) {
    const keypair = loadKeysFromEnv();
    const sender = provider.sender();
    if (sender.address === undefined) throw new Error('sender address is undefined');
    let publicKey = beginCell().storeBuffer(keypair.publicKey).endCell().beginParse().loadUintBig(256);
    const jetton = provider.open(
        await SampleJetton.fromInit(sender.address, buildOnchainMetadata(jettonParams), 1_000_000_000n, publicKey),
    );

    const result = await jetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        { $$type: 'Mint', amount: 1000n, receiver: sender.address },
    );
}
