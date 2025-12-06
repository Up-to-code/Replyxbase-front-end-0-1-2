import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authClient } from "@/lib/auth-client";
import { getOrganizations, getActiveOrganization } from "@/app/actions/organization";
import type { Organization } from "@/components/layout/AppLayout/types";

interface OrganizationState {
  organizations: Organization[];
  activeOrganization: Organization | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadOrganizations: () => Promise<void>;
  loadActiveOrganization: () => Promise<void>;
  setActiveOrganization: (orgId: string) => Promise<void>;
  createOrganization: (data: { name: string; slug: string }) => Promise<Organization | null>;
  updateOrganizationStatus: (orgId: string, status: string) => void;
  refresh: () => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>()(
  persist(
    (set, get) => ({
      organizations: [],
      activeOrganization: null,
      isLoading: false,
      error: null,

      loadOrganizations: async () => {
        set({ isLoading: true, error: null });
        try {
          const organizations = await getOrganizations();
          set({ organizations, isLoading: false });
          
          // If no active org and we have organizations, set first one as active
          const { activeOrganization } = get();
          if (!activeOrganization && organizations.length > 0) {
            await get().setActiveOrganization(organizations[0].id);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load organizations";
          set({ error: errorMessage, isLoading: false });
          console.error("Failed to load organizations:", error);
        }
      },

      loadActiveOrganization: async () => {
        set({ isLoading: true, error: null });
        try {
          const activeOrg = await getActiveOrganization();
          set({ activeOrganization: activeOrg, isLoading: false });
          
          // If no active org, try to load organizations and set first one
          if (!activeOrg) {
            await get().loadOrganizations();
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to load active organization";
          set({ error: errorMessage, isLoading: false });
          console.error("Failed to load active organization:", error);
        }
      },

      setActiveOrganization: async (orgId: string) => {
        set({ isLoading: true, error: null });
        try {
          await authClient.organization.setActive({
            organizationId: orgId,
          });
          
          // Find the organization in the list and set it as active
          const { organizations } = get();
          const org = organizations.find((o) => o.id === orgId) || null;
          set({ activeOrganization: org, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to set active organization";
          set({ error: errorMessage, isLoading: false });
          console.error("Failed to set active organization:", error);
        }
      },

      createOrganization: async (data: { name: string; slug: string }) => {
        try {
          const response = await authClient.organization.create({
            name: data.name,
            slug: data.slug,
          });
          
          // @ts-ignore - Response type mismatch with generated client
          const newOrg = response?.data || response?.organization || null;
          
          if (newOrg) {
            // Add to organizations list
            const { organizations } = get();
            set({ organizations: [...organizations, newOrg] });
            
            // Set as active
            await get().setActiveOrganization(newOrg.id);
          }
          
          set({ isLoading: false });
          return newOrg;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create organization";
          set({ error: errorMessage, isLoading: false });
          console.error("Failed to create organization:", error);
          return null;
        }
      },

      updateOrganizationStatus: (orgId: string, status: string) => {
        const { organizations, activeOrganization } = get();
        
        // Update organization in list
        const updatedOrgs = organizations.map(org => {
          if (org.id === orgId) {
            // Parse existing metadata or create new
            let metadataObj: any = {};
            if (org.metadata) {
              try {
                metadataObj = typeof org.metadata === 'string' ? JSON.parse(org.metadata) : org.metadata;
              } catch {
                metadataObj = {};
              }
            }
            metadataObj.status = status;
            
            return {
              ...org,
              metadata: JSON.stringify(metadataObj),
            };
          }
          return org;
        });
        
        // Update active organization if it's the one being updated
        let updatedActiveOrg = activeOrganization;
        if (activeOrganization?.id === orgId) {
          let metadataObj: any = {};
          if (activeOrganization.metadata) {
            try {
              metadataObj = typeof activeOrganization.metadata === 'string' 
                ? JSON.parse(activeOrganization.metadata) 
                : activeOrganization.metadata;
            } catch {
              metadataObj = {};
            }
          }
          metadataObj.status = status;
          
          updatedActiveOrg = {
            ...activeOrganization,
            metadata: JSON.stringify(metadataObj),
          };
        }
        
        set({ 
          organizations: updatedOrgs,
          activeOrganization: updatedActiveOrg,
        });
      },

      refresh: async () => {
        await Promise.all([
          get().loadOrganizations(),
          get().loadActiveOrganization(),
        ]);
      },
    }),
    {
      name: "organization-storage",
      partialize: (state) => ({
        organizations: state.organizations,
        activeOrganization: state.activeOrganization,
      }),
    }
  )
);

