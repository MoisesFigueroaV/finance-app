import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/hono";

// Extraemos los tipos de respuesta y petición de la ruta específica
type ResponseType = InferResponseType<
  typeof client.api.accounts[":id"]["$delete"]
>;
type RequestType = InferRequestType<
  typeof client.api.accounts[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      // Pasamos los parámetros respetando la firma exacta de Hono RPC
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  return mutation;
};
