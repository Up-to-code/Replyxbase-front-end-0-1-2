import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

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
    verifySignature(body, signature, webhookSecret);

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
    if (error instanceof Error && error.message === "Signature mismatch") {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
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

  const plan = await prisma.plan.findUnique({
    where: { slug: planSlug },
  });

  if (plan) {
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        planId: plan.id,
        polarSubscriptionId: subscription.id,
        polarCustomerId: subscription.customer_id,
        subscriptionStatus: subscription.status,
        currentPeriodEnd: subscription.current_period_end
          ? new Date(subscription.current_period_end)
          : null,
      },
    });
    console.log(`Updated Organization ${organizationId} to plan ${planSlug} (${subscription.status})`);
  } else {
    console.error(`Plan not found for slug: ${planSlug} (Product ID: ${subscription.product_id})`);
  }
}

async function handleSubscriptionEnded(organizationId: string, subscription: any) {
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      subscriptionStatus: subscription.status,
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end)
        : null,
    },
  });
  console.log(`Organization ${organizationId} subscription ended: ${subscription.status}`);
}

function verifySignature(body: string, signature: string, secret: string) {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(body).digest("hex");

  // Check if signature includes hex digest
  if (!signature.includes(digest)) {
    // Fallback: Try base64
    const hmac64 = crypto.createHmac("sha256", secret);
    const digest64 = hmac64.update(body).digest("base64");
    if (!signature.includes(digest64)) {
      throw new Error("Signature mismatch");
    }
  }
}
