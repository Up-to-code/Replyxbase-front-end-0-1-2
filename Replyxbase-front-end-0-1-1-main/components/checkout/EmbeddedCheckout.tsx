"use client";

import { useEffect } from "react";
import { PolarEmbedCheckout } from "@polar-sh/checkout";
import { Modal } from "@/components/ui/Modal";


interface EmbeddedCheckoutProps {
  open: boolean;
  onClose: () => void;
  clientSecret: string;
}

export default function EmbeddedCheckout({
  open,
  onClose,
  clientSecret,
}: EmbeddedCheckoutProps) {
  // const { theme } = useTheme(); // Removed as per request

  useEffect(() => {
    if (open && clientSecret) {
      PolarEmbedCheckout.init({
        clientSecret,
        theme: "light", // Defaulting to light since next-themes is removed
        onSuccess: (data: any) => {
          console.log("Checkout successful", data);
          window.location.href = "/dashboard?success=true";
        },
        onClose: () => {
          console.log("Checkout closed");
          onClose();
        },
      });
    }
  }, [open, clientSecret, onClose]);

  return (
    <Modal open={open} onClose={onClose} className="sm:max-w-xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
        <div data-polar-checkout />
    </Modal>
  );
}
