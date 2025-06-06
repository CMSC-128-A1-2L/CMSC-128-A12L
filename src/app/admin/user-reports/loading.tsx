import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}
