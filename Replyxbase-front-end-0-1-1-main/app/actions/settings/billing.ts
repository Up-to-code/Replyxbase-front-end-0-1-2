"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server: process.env.NODE_ENV === "development" ? "sandbox" : "production",
});

export interface BillingInfo {
  currentPlan: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    orgLimit: number;
    agentLimit: number;
    features: Record<string, any>;
  } | null;
  nextBillingDate: Date | null;
  billingHistory: Array<{
    id: string;
    invoice: string;
    date: Date;
    amount: number;
    status: string;
  }>;
  paymentMethods: Array<{
    id: string;
    type: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
  }>;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  orgLimit: number;
  agentLimit: number;
  features: Record<string, any>;
  isActive: boolean;
}

export async function getBillingInfo(organizationId: string): Promise<{
  success: boolean;
  data?: BillingInfo;
  error?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify user is a member of the organization
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: organizationId,
    },
  });

  if (!membership) {
    return { success: false, error: "You must be a member of this organization" };
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        plan: true,
      },
    });

    if (!organization) {
      return { success: false, error: "Organization not found" };
    }

    const currentPlan = organization.plan
      ? {
          id: organization.plan.id,
          name: organization.plan.name,
          slug: organization.plan.slug,
          price: organization.plan.price,
          currency: organization.plan.currency,
          orgLimit: organization.plan.orgLimit,
          agentLimit: organization.plan.agentLimit,
          features: (organization.plan.features as Record<string, any>) || {},
        }
      : null;

    const nextBillingDate = organization.plan
      ? new Date(organization.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
      : null;

    const billingHistory: BillingInfo["billingHistory"] = [];
    const paymentMethods: BillingInfo["paymentMethods"] = [];

    return {
      success: true,
      data: {
        currentPlan,
        nextBillingDate,
        billingHistory,
        paymentMethods,
      },
    };
  } catch (error) {
    console.error("Failed to get billing info:", error);
    return { success: false, error: "Failed to get billing information" };
  }
}

export async function getAllPlans(): Promise<{
  success: boolean;
  data?: Plan[];
  error?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const plans = await prisma.plan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    const formattedPlans: Plan[] = plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      price: plan.price,
      currency: plan.currency,
      orgLimit: plan.orgLimit,
      agentLimit: plan.agentLimit,
      features: (plan.features as Record<string, any>) || {},
      isActive: plan.isActive,
    }));

    return {
      success: true,
      data: formattedPlans,
    };
  } catch (error) {
    console.error("Failed to get plans:", error);
    return { success: false, error: "Failed to get plans" };
  }
}

export async function upgradePlan(data: {
  organizationId: string;
  planId: string;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify user is a member of the organization
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: data.organizationId,
      OR: [
        { role: "admin" },
        { role: "owner" },
      ],
    },
  });

  if (!membership) {
    return { success: false, error: "Only admin or owner can upgrade plan" };
  }

  try {
    // Verify plan exists and is active
    const plan = await prisma.plan.findUnique({
      where: { id: data.planId },
    });

    if (!plan || !plan.isActive) {
      return { success: false, error: "Plan not found or inactive" };
    }

    // Update organization plan
    await prisma.organization.update({
      where: { id: data.organizationId },
      data: { planId: data.planId },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to upgrade plan:", error);
    return { success: false, error: "Failed to upgrade plan" };
  }
}

export async function getUserBillingInfo(): Promise<{
  success: boolean;
  data?: BillingInfo;
  error?: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        plan: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const currentPlan = user.plan
      ? {
          id: user.plan.id,
          name: user.plan.name,
          slug: user.plan.slug,
          price: user.plan.price,
          currency: user.plan.currency,
          orgLimit: user.plan.orgLimit,
          agentLimit: user.plan.agentLimit,
          features: (user.plan.features as Record<string, any>) || {},
        }
      : null;

    const nextBillingDate = user.plan
      ? new Date(user.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
      : null;

    const billingHistory: BillingInfo["billingHistory"] = [];
    const paymentMethods: BillingInfo["paymentMethods"] = [];

    return {
      success: true,
      data: {
        currentPlan,
        nextBillingDate,
        billingHistory,
        paymentMethods,
      },
    };
  } catch (error) {
    console.error("Failed to get billing info:", error);
    return { success: false, error: "Failed to get billing information" };
  }
}

export async function createCheckoutSession(priceId: string): Promise<{
    success: boolean;
    url?: string;
    clientSecret?: string;
    error?: string;
}> {
    console.log("createCheckoutSession called for priceId:", priceId);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    console.log("Session in createCheckoutSession:", session?.user?.id);

    if (!session?.user) {
        console.error("No session found in createCheckoutSession");
        return { success: false, error: "Unauthorized" };
    }

    try {
        console.log("Creating checkout link with customerEmail:", session.user.email);
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const successUrl = `${baseUrl}/dashboard?success=true`;
        console.log("Success URL:", successUrl);

        // SDK expects 'products' array based on validation error
        const result = await polar.checkouts.create({
            products: [priceId],
            successUrl: successUrl,
            customerEmail: session.user.email,
        });

        console.log("Checkout URL generated:", result.url);
        // The embedded checkout requires the client secret. 
        // Assuming the SDK returns it as 'clientSecret' or similar. 
        // Based on Polar docs, the response contains client_secret.
        return { 
            success: true, 
            url: result.url,
            clientSecret: result.clientSecret 
        };
    } catch (error) {
        console.error("Failed to create checkout session:", error);
        return { success: false, error: "Failed to create checkout session" };
    }
}
