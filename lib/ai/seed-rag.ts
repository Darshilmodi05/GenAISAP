import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from './embeddings';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 

const supabase = createClient(supabaseUrl, supabaseKey);

const mockData = [
  {
    content: "Institutional Protocol: All fiscal reconciliations for Company Code 1000 must be finalized by the 5th working day of the following month. The primary ledger is FICO_ALPHA.",
    metadata: { source: "CORPORATE_BYLAWS", module: "FICO" }
  },
  {
    content: "S/4HANA Alert: Revenue drift exceeding 2% in regional sector APJ triggers an automated audit sequence in the ACDOCA table.",
    metadata: { source: "SAP_TELEMETRY", module: "FICO" }
  },
  {
    content: "Inventory Management: Warehouse Cluster-B (MM_CORE) maintains a safety stock baseline of 500 units for high-velocity SKUs.",
    metadata: { source: "MM_OPERATIONS", module: "MM" }
  }
];

async function seed() {
  console.log('--- Initiating Neural Seed ---');
  
  for (const item of mockData) {
    console.log(`Vectorizing: ${item.content.substring(0, 40)}...`);
    const vector = await generateEmbedding(item.content);
    
    const { error } = await supabase.from('documents').insert({
      content: item.content,
      metadata: item.metadata,
      embedding: vector
    });
    
    if (error) {
      console.error('Seed Failure:', error.message);
    } else {
      console.log('Injected Successfully.');
    }
  }
  
  console.log('--- Seed Complete ---');
}

seed().catch(console.error);
