import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/hono";

const bulkDeleteRequest = client.api.categories["bulk-delete"].$post;

type ResponseType = InferResponseType<typeof bulkDeleteRequest>;
type RequestType = InferRequestType<typeof bulkDeleteRequest>["json"];

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"].$post({ json });

      if (!response.ok) {
        throw new Error("Failed to delete categories");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("categories deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to delete categories");
    },
  });
};
