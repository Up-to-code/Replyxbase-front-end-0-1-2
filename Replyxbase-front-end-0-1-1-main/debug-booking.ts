
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bookingId = 'cmiuhyv3g0005novx9zop82m6';
  
  console.log(`Checking for booking with ID: ${bookingId}`);

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
        organization: true
    }
  });

  if (booking) {
    console.log('Booking found:');
    console.log(JSON.stringify(booking, null, 2));
    console.log(`Organization ID for this booking: ${booking.organizationId}`);
  } else {
    console.log('Booking NOT found in the database.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
