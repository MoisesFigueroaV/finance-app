import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>Nueva Cuenta</SheetTitle>
          <SheetDescription>
            Crea una nueva cuenta para rastrear tus transacciones.
          </SheetDescription>
        </SheetHeader>

      </SheetContent>
    </Sheet>
  );
};
