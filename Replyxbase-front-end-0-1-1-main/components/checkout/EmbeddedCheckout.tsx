"use client";

import { useEffect } from "react";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";
import { Modal } from "@/components/ui/Modal";


// ... imports
interface EmbeddedCheckoutProps {
  open: boolean;
  onClose: () => void;
  checkoutUrl: string;
}

export default function EmbeddedCheckout({
  open,
  onClose,
  checkoutUrl,
}: EmbeddedCheckoutProps) {
  useEffect(() => {
    let checkoutInstance: any = null;

    if (open && checkoutUrl) {
      PolarEmbedCheckout.create(checkoutUrl, "light").then((checkout) => {
        checkoutInstance = checkout;
        
        checkout.addEventListener("success", (event: any) => {
          console.log("Checkout successful", event);
          window.location.href = "/dashboard?success=true";
        });

        checkout.addEventListener("close", () => {
          console.log("Checkout closed");
          onClose();
        });
      }).catch(err => {
        console.error("Failed to create checkout", err);
      });
    }

    return () => {
      if (checkoutInstance) {
        checkoutInstance.close();
      }
    };
  }, [open, checkoutUrl, onClose]);

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-xl p-0 overflow-hidden">
        <div /> 
    </Modal>
  );
}
