/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { toast } from "sonner";

type CancelBookFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number | null;
  onSuccess: () => void;
};

export function AlertDialogDelete({
  open,
  onOpenChange,
  productId,
  onSuccess,
}: CancelBookFormProps) {
  const handleCancleBoook = async () => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_NODE}/api/products/${productId}`
      );
      onOpenChange(false);
      toast.success(res.data.message);
      onSuccess?.();
    } catch (error: any) {
      console.error(error.response?.data.message);
      toast.error(error.response?.data.message);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณต้องการยกเลิก?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleCancleBoook}>
            ยืนยัน
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
