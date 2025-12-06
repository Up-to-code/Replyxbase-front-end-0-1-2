import { NextRequest, NextResponse } from "next/server";
import { Webhooks } from "@polar-sh/sdk";
import prisma from "@/lib/prisma";
import { polar } from "@/app/actions/settings/billing"; // Reuse Polar instance if possible, or create new simple check

// If polar instance isn't exported or usable, we can just use Webhooks utility
// from @polar-sh/sdk directly for signature verification.

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headers = req.headers;
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("POLAR_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
  }

  const signature = headers.get("polar-webhook-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    // Verify signature
    try {
        Webhooks.validateSignature(body, webhookSecret, signature);
    } catch (e) {
        console.error("Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log("Received Polar Webhook:", event.type);

    if (event.type.startsWith("subscription.")) {
      const subscription = event.data;
      const metadata = subscription.metadata || {};
      const organizationId = metadata.organizationId;

      if (!organizationId) {
          console.warn(`No organizationId in subscription metadata for event ${event.type}`);
          return NextResponse.json({ received: true });
      }

      if (["subscription.created", "subscription.updated", "subscription.active"].includes(event.type)) {
           await handleSubscriptionActive(organizationId, subscription);
      } else if (["subscription.revoked", "subscription.canceled"].includes(event.type)) {
           await handleSubscriptionEnded(organizationId, subscription);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleSubscriptionActive(organizationId: string, subscription: any) {
    const starterId = process.env.POLAR_PRODUCT_STARTER_ID;
    const proId = process.env.POLAR_PRODUCT_PRO_ID;
    const enterpriseId = process.env.POLAR_PRODUCT_ENTERPRISE_ID;

    let planSlug = "starter"; 
    if (subscription.product_id === starterId) planSlug = "starter";
    else if (subscription.product_id === proId) planSlug = "pro";
    else if (subscription.product_id === enterpriseId) planSlug = "enterprise";
    
    // Find the plan in our DB by slug
    const plan = await prisma.plan.findUnique({
        where: { slug: planSlug }
    });

    if (plan) {
         await prisma.organization.update({
             where: { id: organizationId },
             data: {
                 planId: plan.id,
                 polarSubscriptionId: subscription.id,
                 polarCustomerId: subscription.customer_id,
                 subscriptionStatus: subscription.status,
                 currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end) : null
             }
         });
         console.log(`Updated Organization ${organizationId} to plan ${planSlug} (${subscription.status})`);
    } else {
        console.error(`Plan not found for slug: ${planSlug} (Product ID: ${subscription.product_id})`);
    }
}

async function handleSubscriptionEnded(organizationId: string, subscription: any) {
    // Determine if we should revert to a free plan or just mark as canceled
    // For 'canceled', they might still have access until period end, but Polar usually sends 'subscription.updated' for status change?
    // If event is specifically 'revoked', it's immediate. 'canceled' might just mean no renew.
    // We will update status. If revoked, we might want to remove planId or set to free immediately.
    
    // Check if we have a free plan or just set to null/default
    // For now, update status and let the app logic handle access control based on Plan + Status + PeriodEnd
    
    await prisma.organization.update({
        where: { id: organizationId },
        data: {
            subscriptionStatus: subscription.status,
            // If revoked, maybe active plan is null? 
            // Only strictly needed if we want to lock them out immediately.
            // keeping planId allows them to see what they *had* or renew easily.
            currentPeriodEnd: subscription.current_period_end ? new Date(subscription.current_period_end) : null
        }
    });
    console.log(`Organization ${organizationId} subscription ended: ${subscription.status}`);
}
