"use client";

import { useState } from "react";
import { ButtonAction } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LeadWizard } from "./LeadWizard";

type TriggerProps = {
  variant?:
    | "primary"
    | "brand"
    | "dark"
    | "white"
    | "outline"
    | "outlineLight"
    | "ghost";
  size?: "md" | "lg";
  withArrow?: boolean;
  className?: string;
};

export function EnquiryDialog({
  label = "Get a Quote",
  productId,
  productName,
  trigger,
}: {
  label?: string;
  productId?: string;
  productName?: string;
  trigger?: TriggerProps;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ButtonAction
        onClick={() => setOpen(true)}
        variant={trigger?.variant ?? "primary"}
        size={trigger?.size ?? "md"}
        withArrow={trigger?.withArrow ?? true}
        className={trigger?.className}
      >
        {label}
      </ButtonAction>

      <Modal open={open} onClose={() => setOpen(false)} label="Request a quote">
        <LeadWizard productId={productId} productName={productName} />
      </Modal>
    </>
  );
}
