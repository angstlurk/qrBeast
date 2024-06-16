import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { KeyPair, getSecureRandomBytes, keyPairFromSeed, sign } from '@ton/crypto';
import { toNano, beginCell, fromNano } from '@ton/core';
import { SampleJetton, storeMint, Mint, TokenTransfer, TokenBurn } from '../wrappers/Jetton';
import '@ton/test-utils';
import { buildOnchainMetadata } from '../utils';
import { JettonDefaultWallet } from '../wrappers/JettonWallet';
import { loadKeysFromEnv } from '../scripts/deployJetton';

const jettonParams = {
    name: 'QR beast Jetton',
    description: 'QR beast Jetton is a token for the QR beast project',
    symbol: 'QRBJ',
    image: '',
};

const generateKeys = async (): Promise<KeyPair> => {
    const seed = await getSecureRandomBytes(32);
    return keyPairFromSeed(seed);
};

const max_supply = toNano(100322689011);
const content = buildOnchainMetadata(jettonParams);

describe('Jetton', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let keypair: KeyPair;
    let jetton: SandboxContract<SampleJetton>;
    let jettonWallet: SandboxContract<JettonDefaultWallet>;

    beforeEach(async () => {
        keypair = loadKeysFromEnv();
        // keypair = await generateKeys();
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        let publicKey = beginCell().storeBuffer(keypair.publicKey).endCell().beginParse().loadUintBig(256);

        jetton = blockchain.openContract(await SampleJetton.fromInit(deployer.address, content, max_supply, publicKey));

        const deployResult = await jetton.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        const playerWallet = await jetton.getGetWalletAddress(deployer.address);
        jettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(playerWallet));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jetton.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and jetton are ready to use
    });

    it('Should mint with secret key', async () => {
        let signature = sign(
            beginCell()
                .store(
                    storeMint({
                        $$type: 'Mint',
                        amount: toNano(100),
                        receiver: deployer.address,
                    }),
                )
                .endCell()
                .hash(),
            keypair.secretKey,
        );

        const mintResult = await jetton.send(
            deployer.getSender(),
            { value: toNano('1') },
            {
                $$type: 'SignMint',
                data: { $$type: 'Mint', amount: toNano(100), receiver: deployer.address },
                signature: beginCell().storeBuffer(signature).endCell(),
            },
        );

        const result = await jettonWallet.getGetWalletData();

        expect(result.balance).toEqual(toNano(100));
        expect(mintResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: jetton.address,
            success: true,
        });
    });

    describe('TEP-74 contract', () => {
        let blockchain: Blockchain;
        let deployer: SandboxContract<TreasuryContract>;
        let keypair: KeyPair;
        let contract: SandboxContract<SampleJetton>;
        let jettonWallet: SandboxContract<JettonDefaultWallet>;

        const mint = async (amount: number, receiver: SandboxContract<TreasuryContract>) => {
            const mintAmount = toNano(amount);
            const Mint: Mint = {
                $$type: 'Mint',
                amount: mintAmount,
                receiver: receiver.address,
            };
            return await contract.send(receiver.getSender(), { value: toNano('1') }, Mint);
        };

        const closeMint = async () => {
            return await contract.send(deployer.getSender(), { value: toNano('1') }, 'Owner: MintClose');
        };

        const burn = async (amount: number, sender: SandboxContract<TreasuryContract>) => {
            const burnAmount = toNano(amount);
            return await contract.send(
                deployer.getSender(),
                { value: toNano('2') },
                {
                    $$type: 'TokenBurnNotification',
                    queryId: 0n,
                    amount: toNano(100),
                    owner: deployer.address,
                    response_destination: deployer.address,
                },
            );
        };

        beforeEach(async () => {
            keypair = await generateKeys();

            let publicKey = beginCell().storeBuffer(keypair.publicKey).endCell().beginParse().loadUintBig(256);

            blockchain = await Blockchain.create();
            deployer = await blockchain.treasury('deployer');
            contract = blockchain.openContract(
                await SampleJetton.fromInit(deployer.address, content, max_supply, publicKey),
            );

            const deployResult = await contract.send(
                deployer.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Deploy',
                    queryId: 0n,
                },
            );

            expect(deployResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                deploy: true,
                success: true,
            });

            const playerWallet = await contract.getGetWalletAddress(deployer.address);
            jettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(playerWallet));
        });

        it('should deploy', () => {
            // blockchain and token are ready to use
        });

        it('should mint successfully', async () => {
            const mintResult = await mint(100, deployer);

            expect(mintResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: true,
            });
        });

        it('should to mint increase total supply', async () => {
            const totalSupplyBefore = (await contract.getGetJettonData()).totalSupply;

            await mint(100, deployer);

            const totalSupplyAfter = (await contract.getGetJettonData()).totalSupply;

            expect(totalSupplyBefore).toEqual(0n);
            expect(totalSupplyAfter).toEqual(100000000000n);
        });

        it('should to mint increase wallet balance', async () => {
            await mint(100, deployer);

            const walletData = await jettonWallet.getGetWalletData();

            expect(walletData.owner).toEqualAddress(deployer.address);
            expect(walletData.balance).toBeGreaterThanOrEqual(toNano(100));
        });

        it('shouldn`t mint after close minting', async () => {
            const resultCloseMint = await closeMint();
            const resultMint = await mint(100, deployer);

            expect(resultCloseMint.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: true,
            });

            expect(resultMint.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: false,
            });
        });

        it('should update content', async () => {
            const newContent = buildOnchainMetadata({ ...jettonParams, name: 'New Name' });

            const result = await contract.send(
                deployer.getSender(),
                { value: toNano('1') },
                { $$type: 'TokenUpdateContent', content: newContent },
            );

            expect(result.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: true,
            });
        });

        it('shouldn`t update content not owner', async () => {
            const other = await blockchain.treasury('other');
            const newContent = buildOnchainMetadata({ ...jettonParams, name: 'New Name' });

            const result = await contract.send(
                other.getSender(),
                { value: toNano('1') },
                { $$type: 'TokenUpdateContent', content: newContent },
            );

            expect(result.transactions).toHaveTransaction({
                from: other.address,
                to: contract.address,
                success: false,
            });
        });

        it.skip('should burn tokens', async () => {
            await mint(100, deployer);
            const burnResult = await burn(100, deployer);

            const totalSupplyAfter = (await contract.getGetJettonData()).totalSupply;

            expect(burnResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: contract.address,
                success: true,
            });
            expect(totalSupplyAfter).toEqual(0n);
        });

        it('should burn tokens. Return cashback', async () => {
            await mint(100, deployer);
            const burnResult = await burn(100, deployer);

            const cachBackTransaction = burnResult.transactions[2];
            if (cachBackTransaction.description.type !== 'generic') {
                throw new Error('Generic transaction expected');
            }
            expect(Number(fromNano(cachBackTransaction.description.creditPhase?.credit.coins ?? 0))).toBeCloseTo(2, 1);
        });

        it.todo('should transfer from Non-Owner');

        it.todo('shouldn`t transfer with Insufficient Jettons');
    });

    describe('MemeJetton', () => {
        let blockchain: Blockchain;
        let deployer: SandboxContract<TreasuryContract>;
        let memeJetton: SandboxContract<SampleJetton>;
        let jettonWallet: SandboxContract<JettonDefaultWallet>;
        let keypair: KeyPair;

        beforeEach(async () => {
            keypair = await generateKeys();

            let publicKey = beginCell().storeBuffer(keypair.publicKey).endCell().beginParse().loadUintBig(256);

            blockchain = await Blockchain.create();
            deployer = await blockchain.treasury('deployer');

            memeJetton = blockchain.openContract(
                await SampleJetton.fromInit(deployer.address, content, max_supply, publicKey),
            );

            const deployResult = await memeJetton.send(
                deployer.getSender(),
                {
                    value: toNano('0.05'),
                },
                {
                    $$type: 'Deploy',
                    queryId: 0n,
                },
            );

            expect(deployResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: memeJetton.address,
                deploy: true,
                success: true,
            });

            const playerWallet = await memeJetton.getGetWalletAddress(deployer.address);
            jettonWallet = blockchain.openContract(await JettonDefaultWallet.fromAddress(playerWallet));
        });

        it('should deploy', async () => {
            // the check is done inside beforeEach
            // blockchain and memeJetton are ready to use
        });

        const mint = async (amount: number, receiver: SandboxContract<TreasuryContract>) => {
            const mintAmount = toNano(amount);
            const Mint: Mint = {
                $$type: 'Mint',
                amount: mintAmount,
                receiver: receiver.address,
            };
            return await memeJetton.send(receiver.getSender(), { value: toNano('1') }, Mint);
        };

        it('minting', async () => {
            const totalSupplyBefore = (await memeJetton.getGetJettonData()).totalSupply;

            const mintResult = await mint(100, deployer);

            expect(mintResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: memeJetton.address,
                success: true,
            });

            const totalSupplyAfter = (await memeJetton.getGetJettonData()).totalSupply;
            const walletData = await jettonWallet.getGetWalletData();

            // expect(totalSupplyBefore).toEqual(0n);
            // expect(totalSupplyAfter).toEqual(100000000000n);

            // expect(walletData.owner).toEqualAddress(deployer.address);
            // expect(walletData.balance).toBeGreaterThanOrEqual(mintAmount);
        });

        it('should transfer successfully', async () => {
            const sender = await blockchain.treasury('sender');
            const receiver = await blockchain.treasury('receiver');
            const initMintAmount = toNano(1000);
            const transferAmount = toNano(80);

            const mintMessage: Mint = {
                $$type: 'Mint',
                amount: initMintAmount,
                receiver: sender.address,
            };
            await memeJetton.send(deployer.getSender(), { value: toNano('0.25') }, mintMessage);

            const senderWalletAddress = await memeJetton.getGetWalletAddress(sender.address);
            const senderWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(senderWalletAddress));

            // Transfer tokens from sender's wallet to receiver's wallet // 0xf8a7ea5
            const transferMessage: TokenTransfer = {
                $$type: 'TokenTransfer',
                queryId: 0n,
                amount: transferAmount,
                destination: receiver.address,
                response_destination: sender.address,
                custom_payload: null,
                forward_ton_amount: toNano('0.1'),
                forward_payload: beginCell().storeUint(0, 1).storeUint(0, 32).endCell(),
            };
            const transferResult = await senderWallet.send(
                sender.getSender(),
                { value: toNano('0.5') },
                transferMessage,
            );
            expect(transferResult.transactions).toHaveTransaction({
                from: sender.address,
                to: senderWallet.address,
                success: true,
            });
            // printTransactionFees(transferResult.transactions);
            // prettyLogTransactions(transferResult.transactions);

            const receiverWalletAddress = await memeJetton.getGetWalletAddress(receiver.address);
            const receiverWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(receiverWalletAddress));

            const senderWalletDataAfterTransfer = await senderWallet.getGetWalletData();
            const receiverWalletDataAfterTransfer = await receiverWallet.getGetWalletData();

            expect(senderWalletDataAfterTransfer.balance).toEqual(initMintAmount - transferAmount); // check that the sender transferred the right amount of tokens
            expect(receiverWalletDataAfterTransfer.balance).toEqual(transferAmount); // check that the receiver received the right amount of tokens
            // const balance1 = (await receiverWallet.getGetWalletData()).balance;
            // console.log(fromNano(balance1));
        });

        it('Mint tokens then Burn tokens', async () => {
            const deployerWalletAddress = await memeJetton.getGetWalletAddress(deployer.address);
            const deployerWallet = blockchain.openContract(JettonDefaultWallet.fromAddress(deployerWalletAddress));

            const initMintAmount = toNano(100);
            const mintMessage: Mint = {
                $$type: 'Mint',
                amount: initMintAmount,
                receiver: deployer.address,
            };
            await memeJetton.send(deployer.getSender(), { value: toNano('10') }, mintMessage);
            let deployerBalance = (await deployerWallet.getGetWalletData()).balance;
            expect(deployerBalance).toEqual(0n + initMintAmount);

            let burnAmount = toNano(10);
            const burnMessage: TokenBurn = {
                $$type: 'TokenBurn',
                queryId: 0n,
                amount: burnAmount,
                response_destination: deployer.address,
                owner: deployer.address,
            };

            await deployerWallet.send(deployer.getSender(), { value: toNano('10') }, burnMessage);
            let deployerBalanceAfterBurn = (await deployerWallet.getGetWalletData()).balance;
            expect(deployerBalanceAfterBurn).toEqual(deployerBalance - burnAmount);
        });

        it('Should return value', async () => {
            const player = await blockchain.treasury('player');
            const mintAmount = 1119000n;
            const Mint: Mint = {
                $$type: 'Mint',
                amount: mintAmount,
                receiver: player.address,
            };
            await memeJetton.send(deployer.getSender(), { value: toNano('1') }, Mint);

            let totalSupply = (await memeJetton.getGetJettonData()).totalSupply;
            const messateResult = await memeJetton.send(player.getSender(), { value: 10033460n }, Mint);
            expect(messateResult.transactions).toHaveTransaction({
                from: player.address,
                to: memeJetton.address,
            });
            let totalSupply_later = (await memeJetton.getGetJettonData()).totalSupply;
            expect(totalSupply_later).toEqual(totalSupply);
        });

        it('Should mint with secret key', async () => {
            let signature = sign(
                beginCell()
                    .store(
                        storeMint({
                            $$type: 'Mint',
                            amount: toNano(100),
                            receiver: deployer.address,
                        }),
                    )
                    .endCell()
                    .hash(),
                keypair.secretKey,
            );

            const mintResult = await memeJetton.send(
                deployer.getSender(),
                { value: toNano('1') },
                {
                    $$type: 'SignMint',
                    data: { $$type: 'Mint', amount: toNano(100), receiver: deployer.address },
                    signature: beginCell().storeBuffer(signature).endCell(),
                },
            );

            const result = await jettonWallet.getGetWalletData();

            expect(result.balance).toEqual(toNano(100));
            expect(mintResult.transactions).toHaveTransaction({
                from: deployer.address,
                to: memeJetton.address,
                success: true,
            });
        });
    });
});
