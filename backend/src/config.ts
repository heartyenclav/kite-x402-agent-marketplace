import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  port: z.coerce.number().default(4001),
  kiteNetwork: z.enum(['mainnet', 'testnet']).default('testnet'),
  kiteRpcUrl: z.string().url().default('https://rpc-testnet.gokite.ai'),
  kiteChainId: z.coerce.number().default(2368),
  facilitatorUrl: z.string().url().default('https://facilitator.pieverse.io/v2'),
  payToAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).default('0x71C8343e393746677722F7885C6894b34F080094'),
  simulationMode: z
    .string()
    .optional()
    .transform((val) => val === undefined || val.toLowerCase() === 'true'),
  defaultPriceUsd: z.coerce.number().min(0.0001).default(0.002),
});

export const config = configSchema.parse({
  port: process.env.PORT,
  kiteNetwork: process.env.KITE_NETWORK,
  kiteRpcUrl: process.env.KITE_RPC_URL,
  kiteChainId: process.env.KITE_CHAIN_ID,
  facilitatorUrl: process.env.FACILITATOR_URL,
  payToAddress: process.env.PAY_TO_ADDRESS,
  simulationMode: process.env.SIMULATION_MODE,
  defaultPriceUsd: process.env.DEFAULT_PRICE_USD,
});
