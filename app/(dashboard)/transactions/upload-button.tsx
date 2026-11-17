import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

import { Button } from "@/components/ui/button";

export type CSVResults = {
  data: string[][];
  errors: unknown[];
  meta: Record<string, unknown>;
};

type Props = {
  onUpload: (results: CSVResults) => void;
};

type RenderProps = {
  getRootProps: () => Record<string, unknown>;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: RenderProps) => (
        <Button
          type="button"
          size="sm"
          className="w-full lg:w-auto"
          {...getRootProps()}
        >
          <Upload className="size-4 mr-2" />
          Import
        </Button>
      )}
    </CSVReader>
  );
};
