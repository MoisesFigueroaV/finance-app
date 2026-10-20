"use client";

import dynamic from "next/dynamic";

const NewAccountSheet = dynamic(
  () => import("@/features/accounts/components/new-account-sheet").then((mod) => mod.NewAccountSheet),
  { ssr: false }
);

const EditAccountSheet = dynamic(
  () => import("@/features/accounts/components/edit-account-sheet").then((mod) => mod.EditAccountSheet),
  { ssr: false }
);

export const SheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};
