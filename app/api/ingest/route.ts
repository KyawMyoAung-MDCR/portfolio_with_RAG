import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

import fs from 'fs';
import path from 'path';
import PDFParser from 'pdf2json';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

const EMBEDDING_DIMENSION = 3072;


interface PdfTextRun {
  T: string; // URI-encoded text
}

interface PdfTextItem {
  R: PdfTextRun[];
}

interface PdfPage {
  Texts: PdfTextItem[];
}

interface PdfData {
  Pages: PdfPage[];
}

function splitText(text: string, size = 1000) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

function extractPdfText(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdf = new PDFParser();

    pdf.on('pdfParser_dataError', err => reject(err));

    pdf.on('pdfParser_dataReady', (data: PdfData) => {
      let text = '';
      for (const page of data.Pages) {
        for (const item of page.Texts) {
          for (const r of item.R) {
            text += decodeURIComponent(r.T) + ' ';
          }
        }
        text += '\n';
      }
      resolve(text);
    });

    pdf.loadPDF(filePath);
  });
}


async function embedInBatches(chunks: string[], batchSize = 5) {
  const results: { chunk: string; vector: number[] }[] = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    const embedded = await Promise.all(
      batch.map(async chunk => {
        try {
          const embed = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: chunk,
            config: {
              taskType: 'RETRIEVAL_DOCUMENT', 
              outputDimensionality: EMBEDDING_DIMENSION, 
            },
          });
          const vector = embed.embeddings?.[0]?.values;
          return vector ? { chunk, vector } : null;
        } catch (e) {
          console.error('EMBED ERROR for chunk:', e);
          return null;
        }
      })
    );

    results.push(...embedded.filter((r): r is { chunk: string; vector: number[] } => r !== null));
  }

  return results;
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'my-data.pdf');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    const pdfText = await extractPdfText(filePath);

    if (!pdfText.trim()) {
      return NextResponse.json({ error: 'Empty PDF' }, { status: 400 });
    }

    const chunks = splitText(pdfText);

    const del = await supabase
      .from('documents')
      .delete()
      .gte('created_at', '1970-01-01T00:00:00Z');

    if (del.error) {
      console.error('DELETE ERROR:', del.error);
      return NextResponse.json(
        { error: 'Failed to clear old documents', detail: del.error.message },
        { status: 500 }
      );
    }

    
    const embeddedChunks = await embedInBatches(chunks, 5);

    let inserted = 0;

    for (const { chunk, vector } of embeddedChunks) {
      const result = await supabase.from('documents').insert([
        { content: chunk, embedding: vector },
      ]);

      if (result.error) {
        console.error('INSERT ERROR:', result.error); 
        continue;
      }

      inserted++;
    }

    return NextResponse.json({
      success: true,
      chunks: chunks.length,
      inserted,
    });
  } catch (error) {
    console.error('INGEST ROUTE ERROR:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}