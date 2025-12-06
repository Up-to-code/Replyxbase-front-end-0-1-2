import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { agentId, name, email, phone, date, time } = body;

    if (!agentId || !name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Get Agent to find Organization
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
      select: { organizationId: true }
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // 2. Find or Create Customer
    let customer = await prisma.customer.findFirst({
      where: {
        organizationId: agent.organizationId,
        OR: [
          { email: email },
          { phone: phone } // Optional: strict check might require phone to be present
        ]
      }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          organizationId: agent.organizationId,
          fullName: name,
          email: email,
          phone: phone || '',
          status: 'lead',
          notes: 'Source: website_widget'
        }
      });
    }

    // 3. Create Booking
    // Parse date/time string to DateTime object if needed, or store as string if schema allows
    // Schema has `date: DateTime`, `startTime: String`
    // We'll assume `date` comes in as "15 October 2023" or similar, need to parse it.
    // For simplicity in this demo, we'll try to parse it, or default to now if invalid.
    
    let parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      // Try to parse "Day Month Year" manually or just use now
      parsedDate = new Date(); 
    }

    const booking = await prisma.booking.create({
      data: {
        organizationId: agent.organizationId,
        customerId: customer.id,
        date: parsedDate,
        startTime: time,
        endTime: time, // Placeholder
        duration: 30,
        serviceType: 'Consultation',
        status: 'pending',
        source: 'website_widget'
      }
    });

    return NextResponse.json({ success: true, bookingId: booking.id });

  } catch (error) {
    console.error('Booking Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
