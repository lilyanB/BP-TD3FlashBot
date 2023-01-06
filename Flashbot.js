const PRIVATE_KEY = process.env.PRIVATE_KEY;

// 1. Import everything
import { ethers } from 'ethers'
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'
/*
Mainnet
const provider = new providers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/cmHEQqWnoliAP0lgTieeUtwHi0KxEOlh')
const wsProvider = new providers.WebSocketProvider('wss://eth-mainnet.g.alchemy.com/v2/cmHEQqWnoliAP0lgTieeUtwHi0KxEOlh')
*/

// 2. Setup a standard provider in goerli

const provider = await new ethers.getDefaultProvider("goerli");
/* const provider = new providers.JsonRpcProvider(
	'https://eth-goerli.g.alchemy.com/v2/kWBvEiso-d70OEPlThp6oJknYBr6XMlO'
) */

/* const providerRPC = {
	goerli: {
	  name: 'goerli',
	  rpc: 'http://127.0.0.1:8545',
	  chainId: 5,
	},
  };
  const provider = new ethers.providers.StaticJsonRpcProvider(
	providerRPC.goerli.rpc,
	{
	  chainId: providerRPC.goerli.chainId,
	  name: providerRPC.goerli.name,
	}
  ); */

// 3. The unique ID for flashbots to identify you and build trust over time
const authSigner = await new ethers.Wallet(
	'0x2000000000000000000000000000000000000000000000000000000000000000',
	provider
  );
// The address of the authSigner is 0x09Dad4e56b1B2A7eeD9C41691EbDD4EdF0D80a46

const start = async () => {
	// 4. Create the flashbots provider
	const flashbotsProvider = await FlashbotsBundleProvider.create(
		provider,
		authSigner,
		"https://relay-goerli.flashbots.net",
		"goerli"
	  );

	const wallet = await new ethers.Wallet(PRIVATE_KEY);
	const blockNumber = await provider.getBlockNumber()
	// 5. Setup the transactions to send and sign
	const signedTransactions = await flashbotsProvider.signBundle([
		{ // Both transactions are the same but one is type 1 and the other type 2 after the gas changes
			signer: wallet,
			transaction: {
				to: "0xc6b2B7BbF1a9B99b67D296B070BC6db25C253904",
				gasPrice: 10,
				gasLimit: 21000,
				chainId: 5,
				value: 1000,
			},
		},
		// we need this second tx because flashbots only accept bundles that use at least 42000 gas.
		{
			signer: wallet,
			transaction: {
				to: "0xc6b2B7BbF1a9B99b67D296B070BC6db25C253904",
				gasPrice: 10,
				gasLimit: 21000,
				chainId: 5,
				value: 2000,
			},
		},
		{
			signer: wallet,
			transaction: {
			  to: "0xc6b2B7BbF1a9B99b67D296B070BC6db25C253904",
			  gasPrice: 10,
			  gasLimit: 21000,
			  chainId: 5,
			  value: 3000,
			},
		  },
		  ]);

	// 6. We run a simulation for the next block number with the signed transactions
	console.log(new Date())
    console.log('Starting to run the simulation...')
	const simulation = await flashbotsProvider.simulate(
		signedTransactions,
		blockNumber + 3,
	)
	console.log(new Date())

	// 7. Check the result of the simulation
	if (simulation.firstRevert) {
		console.log(`Simulation Error: ${simulation.firstRevert.error}`)
	} else {
		console.log(
			`Simulation Success: ${blockNumber}`
		)
	}

	// 8. Send 10 bundles to get this working for the next blocks in case flashbots doesn't become the block producer
	/* for (var i = 1; i <= 10; i++) {
		const bundleSubmission = await flashbotsProvider.sendRawBundle(
			signedTransactions,
			blockNumber + i
		)
		console.log('bundle submitted, waiting', bundleSubmission.bundleHash)

		const waitResponse = await bundleSubmission.wait()
		console.log(`Wait Response: ${FlashbotsBundleResolution[waitResponse]}`)
		if (
			waitResponse === FlashbotsBundleResolution.BundleIncluded ||
			waitResponse === FlashbotsBundleResolution.AccountNonceTooHigh
		) {
            console.log('Bundle included!')
			process.exit(0)
		} else {
			console.log({
				bundleStats: await flashbotsProvider.getBundleStats(
					simulation.bundleHash,
					blockNumber + 1,
				),
				userStats: await flashbotsProvider.getUserStats(),
			})
		}
	}
	console.log('bundles submitted') */

	const bundleSubmission = await flashbotsProvider.sendRawBundle(
		signedTransactions,
		blockNumber + 3
	  );
  	console.log(`submitted for block #  ${blockNumber + 3}`);
}

start()
