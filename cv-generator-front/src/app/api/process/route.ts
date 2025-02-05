import { validateFile } from '@/utils/validateFile';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const link = formData.get('link');
    const file = formData.get('file');
    const gender = formData.get('gender');
    const offerContent = formData.get('offerContent');

    if (!link || !file || !gender || !offerContent) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    let content = '';
    if (file instanceof File) {
      const validationError = validateFile(file);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
      content = await file.text();
    }

    const response = await fetch('http://localhost:3003/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        link,
        gender,
        fileContent: content,
        offerContent
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message || error }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json({ success: true, externalResponse: result });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
