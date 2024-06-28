"use client";

import { useEffect, useState } from "react";
import { SignUpModal } from "../modals/signup-modal";

export const ModalProviders = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SignUpModal />
    </>
  );
};
