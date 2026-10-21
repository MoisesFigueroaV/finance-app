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

const NewCategorySheet = dynamic(
  () => import("@/features/categories/components/new-categories-sheet").then((mod) => mod.NewCategoriesSheet),
  { ssr: false }
);

const EditCategorySheet = dynamic(
  () => import("@/features/categories/components/edit-categories-sheet").then((mod) => mod.EditCategoriesSheet),
  { ssr: false }
);

export const SheetProvider = () => {
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />
    </>
  );
};
