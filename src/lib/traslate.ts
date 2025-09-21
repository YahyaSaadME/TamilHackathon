// translation.ts - Client-side translation using TFLite model
/* eslint-disable @typescript-eslint/no-explicit-any */

let tf: any = null;
let tflite: any = null;
let AutoTokenizer: any = null;
let AutoConfig: any = null;
let interpreter: any = null;
let tokenizer: any = null;
let config: any = null;
let DECODER_START: number;
let EOS_ID: number;
let PAD_ID: number;
const MAX_SRC_LEN = 128;
const MAX_TGT_LEN = 128;

export function getModelDownloadStatus() {
  return {
    progress: interpreter ? 100 : 0,
    downloaded: !!interpreter,
    error: '',
  };
}

export function isModelLoaded() {
  return !!interpreter;
}

async function loadLibraries() {
  console.log('[Libraries] Starting to load libraries...');
  if (!tf) {
    console.log('[Libraries] Importing @tensorflow/tfjs...');
    tf = await import('@tensorflow/tfjs');
    console.log('[Libraries] @tensorflow/tfjs loaded');
  }
  if (!tflite) {
    console.log('[Libraries] Importing @tensorflow/tfjs-tflite...');
    tflite = await import('@tensorflow/tfjs-tflite');
    console.log('[Libraries] @tensorflow/tfjs-tflite loaded');
  }
  if (!AutoTokenizer || !AutoConfig) {
    console.log('[Libraries] Importing @xenova/transformers...');
    const transformers = await import('@xenova/transformers');
    AutoTokenizer = transformers.AutoTokenizer;
    AutoConfig = transformers.AutoConfig;
    console.log('[Libraries] @xenova/transformers loaded');
  }
  console.log('[Libraries] All libraries loaded');
}

async function loadResources() {
  console.log('[Resources] Starting to load resources...');
  try {
    await loadLibraries();
    console.log('[Resources] Libraries loaded successfully');
  } catch (libErr) {
    console.error('[Resources] Error loading libraries:', libErr);
    throw libErr;
  }

  if (!tokenizer) {
    try {
      console.log('[Tokenizer] Starting to load tokenizer...');
      tokenizer = await AutoTokenizer.from_pretrained('Helsinki-NLP/opus-mt-en-fr');
      console.log('[Tokenizer] Tokenizer loaded successfully');
    } catch (tokErr) {
      console.error('[Tokenizer] Error loading tokenizer:', tokErr);
      throw tokErr;
    }
  }

  if (!config) {
    try {
      console.log('[Config] Starting to load config...');
      config = await AutoConfig.from_pretrained('Helsinki-NLP/opus-mt-en-fr');
      console.log('[Config] Config loaded successfully');
    } catch (cfgErr) {
      console.error('[Config] Error loading config:', cfgErr);
      throw cfgErr;
    }
  }

  DECODER_START = config.decoder_start_token_id || tokenizer.bos_token_id;
  EOS_ID = tokenizer.eos_token_id;
  PAD_ID = tokenizer.pad_token_id || 0;
  console.log('[Resources] DECODER_START:', DECODER_START, 'EOS_ID:', EOS_ID, 'PAD_ID:', PAD_ID);

  if (!interpreter) {
    try {
      console.log('[TFLite] Checking if model file is accessible...');
      const response = await fetch('/models/opus_mt_en_fr_flex_quant.tflite');
      if (!response.ok) {
        throw new Error(`Model file not accessible: ${response.status} ${response.statusText}`);
      }
      const contentLength = response.headers.get('content-length');
      console.log('[TFLite] Model file accessible, size:', contentLength, 'bytes');
      console.log('[TFLite] Starting to load model...');
      interpreter = await tflite.loadTFLiteModel('/models/opus_mt_en_fr_flex_quant.tflite');
      console.log('[TFLite] Model loaded successfully');
    } catch (modelErr) {
      console.error('[TFLite] Error loading model:', modelErr);
      throw modelErr;
    }
  }

  console.log('[Resources] All resources loaded successfully');
}

function padTrunc(arr: number[], length: number, padVal = 0): number[] {
  arr = arr.slice(0, length);
  while (arr.length < length) arr.push(padVal);
  return arr;
}

function buildEncoderInputs(text: string) {
  const enc = tokenizer(text, { return_tensors: null, add_special_tokens: true });
  const inputIds = padTrunc(enc.input_ids, MAX_SRC_LEN, PAD_ID);
  const attnMask = padTrunc(enc.attention_mask, MAX_SRC_LEN, 0);
  return {
    input_ids: tf.tensor([inputIds], [1, MAX_SRC_LEN], 'int32'),
    attention_mask: tf.tensor([attnMask], [1, MAX_SRC_LEN], 'int32'),
  };
}

function buildDecoderInputs(decTokens: number[]) {
  const decIds = padTrunc(decTokens, MAX_TGT_LEN, PAD_ID);
  const decMask = new Array(Math.min(decTokens.length, MAX_TGT_LEN)).fill(1);
  const paddedMask = padTrunc(decMask, MAX_TGT_LEN, 0);
  return {
    decoder_input_ids: tf.tensor([decIds], [1, MAX_TGT_LEN], 'int32'),
    decoder_attention_mask: tf.tensor([paddedMask], [1, MAX_TGT_LEN], 'int32'),
  };
}

export async function translateEnToFr(text: string): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("Translation only works in browser/client-side.");
  }

  await loadResources();
  const { input_ids, attention_mask } = buildEncoderInputs(text);
  const decTokens = [DECODER_START];

  for (let step = 1; step <= MAX_TGT_LEN; step++) {
    const { decoder_input_ids, decoder_attention_mask } = buildDecoderInputs(decTokens);

    const outputs = interpreter.predict({
      'serving_default_input_ids:0': input_ids,
      'serving_default_attention_mask:0': attention_mask,
      'serving_default_decoder_input_ids:0': decoder_input_ids,
      'serving_default_decoder_attention_mask:0': decoder_attention_mask,
    });

    const logits = outputs.arraySync()[0]; // [MAX_TGT_LEN, vocab]
    const lastLogits = logits[decTokens.length - 1];
    const nextId = lastLogits.indexOf(Math.max(...lastLogits));

    decTokens.push(nextId);
    if (nextId === EOS_ID) break;
  }

  // Strip start + EOS
  const outIds = decTokens.slice(1);
  const eosIndex = outIds.indexOf(EOS_ID);
  const finalIds = eosIndex > -1 ? outIds.slice(0, eosIndex) : outIds;

  return tokenizer.decode(finalIds, { skip_special_tokens: true });
}

// Clear cache function for debugging
export async function clearModelCache(): Promise<void> {
  interpreter = null;
  console.log('[Cache] Model cache cleared');
}