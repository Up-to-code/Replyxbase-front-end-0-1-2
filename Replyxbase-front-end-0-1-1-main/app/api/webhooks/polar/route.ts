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

    if (event.type === "subscription.created" || event.type === "subscription.updated") {
      const subscription = event.data;
      const metadata = subscription.metadata || {};
      const organizationId = metadata.organizationId; // IMPORTANT: We need to ensure we pass this in checkout

      if (!organizationId) {
          // Fallback: If no metadata, try to find by customer email if user logic allows, 
          // or log error. For now, we assume metadata is passed.
          console.warn("No organizationId in subscription metadata", subscription);
          
          // Attempt to match by user email? 
          // Not safe for orgs. We must ensure checkout session has metadata.
          return NextResponse.json({ received: true });
      }

      // Map Polar Product ID to Plan ID
      // We need to fetch the plan from our DB using the polarProductId (which we added to actions but not DB schema directly... wait)
      // Actually, we mapped env vars in 'getAllPlans'. Ideally we should store polarProductId in DB Plan table 
      // OR we just map strictly by environment variables here too.
      // Let's use the Environment Variables mapping for now to match 'getAllPlans' logic.

      const starterId = process.env.POLAR_PRODUCT_STARTER_ID;
      const proId = process.env.POLAR_PRODUCT_PRO_ID;
      const enterpriseId = process.env.POLAR_PRODUCT_ENTERPRISE_ID;

      let planSlug = "starter"; // default?
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
           console.log(`Updated Organization ${organizationId} to plan ${planSlug}`);
      } else {
          console.error(`Plan not found for slug: ${planSlug}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
