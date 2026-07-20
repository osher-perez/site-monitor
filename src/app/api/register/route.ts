import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('site_monitor');
    const usersCollection = db.collection('users');

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // שמירת המשתמש החדש
    const newUser = {
      email,
      password, // בפרודקשן מומלץ להצפין עם bcrypt
      name: name || '',
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    return NextResponse.json({
      message: 'User registered successfully',
      userId: result.insertedId,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}