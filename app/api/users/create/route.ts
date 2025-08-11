import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Schema for validating user creation data
const createUserSchema = z.object({
  name: z.string().min(1, 'Namn krävs'),
  email: z.string().email('Ogiltig e-postadress'),
  role: z.enum(['CUSTOMER', 'ADMIN'], { 
    errorMap: () => ({ message: 'Roll måste vara CUSTOMER eller ADMIN' })
  }),
  password: z.string().min(8, 'Lösenord måste vara minst 8 tecken')
    .regex(/[a-z]/, 'Lösenord måste innehålla minst en liten bokstav')
    .regex(/[A-Z]/, 'Lösenord måste innehålla minst en stor bokstav')
    .regex(/\d/, 'Lösenord måste innehålla minst en siffra')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Lösenord måste innehålla minst ett specialtecken'),
  sendWelcomeEmail: z.boolean().optional().default(false)
});

// POST - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Obehörig åtkomst' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = createUserSchema.parse(body);

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'En användare med denna e-postadress finns redan' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    // TODO: Send welcome email if requested
    if (validatedData.sendWelcomeEmail) {
      // This could be integrated with your email service
      console.log(`Welcome email should be sent to ${newUser.email}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Användare skapad framgångsrikt',
      user: newUser
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Ogiltiga data', 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Ett fel uppstod när användaren skulle skapas' },
      { status: 500 }
    );
  }
}
