import { beginCell, toNano } from '@ton/core';
import { sign, signVerify } from '@ton/crypto';
import { SampleJetton, storeMint, storeSignMint } from '../wrappers/Jetton';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../utils';
import { loadKeysFromEnv, max_supply } from './deployJetton';

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
        await SampleJetton.fromInit(sender.address, buildOnchainMetadata(jettonParams), max_supply, publicKey),
    );

    const signature = sign(
        beginCell()
            .store(
                storeMint({
                    $$type: 'Mint',
                    amount: toNano(100),
                    receiver: sender.address,
                }),
            )
            .endCell()
            .hash(),
        keypair.secretKey,
    );

    await jetton.send(
        provider.sender(),
        {
            value: toNano('1'),
        },
        {
            $$type: 'SignMint',
            data: { $$type: 'Mint', amount: 100n, receiver: sender.address },
            signature: beginCell().storeBuffer(signature).endCell(),
        },
    );
}
