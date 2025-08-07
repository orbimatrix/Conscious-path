import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log('Webhook body:', body);

  // Handle the webhook
  switch (eventType) {
    case 'user.created':
      try {
        const userData = evt.data;
        await db.insert(users).values({
          clerkId: userData.id,
          fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email_addresses?.[0]?.email_address || '',
          username: userData.username || '',
        });
        console.log('User created in database:', userData.id);
      } catch (error) {
        console.error('Error creating user:', error);
        return new Response('Error creating user', { status: 500 });
      }
      break;

    case 'user.updated':
      try {
        const userData = evt.data;
        await db.update(users)
          .set({
            fullName: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email_addresses?.[0]?.email_address || '',
            username: userData.username || '',
          })
          .where(eq(users.clerkId, userData.id));
        console.log('User updated in database:', userData.id);
      } catch (error) {
        console.error('Error updating user:', error);
        return new Response('Error updating user', { status: 500 });
      }
      break;

   

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  return new Response('', { status: 200 });
} 