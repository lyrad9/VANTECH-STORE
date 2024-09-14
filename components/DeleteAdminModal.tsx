"use client";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  // CredenzaOverlay
} from "@/components/ui/credenza";
import { useRouter } from "next/navigation";
import { deleteProductAction} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useShallow } from "zustand/react/shallow";
import { Info } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { desktop } from "@/components/ui/credenza";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useModal } from "@/lib/DeleteStore";
import { useDeleteAdminModal } from "@/lib/DeleteStore";
import { useServerAction } from "zsa-react";
import { deleteAdminAction } from "@/lib/actions";
import { toast } from "sonner";
export const DeleteAdminModal = () => {
const deleteAdmin = useServerAction(deleteAdminAction,{
  onSuccess: () => {
    toast.success("deletion admin successfully!")
    router.refresh()
    onClose()
  },
  onError: (err) => {
  //  toast.error(err.err.message)
     toast.error("an error occurred while deleting admin")
  }
})
  const { idAdmin } = useDeleteAdminModal(
    useShallow((s) => ({
     idAdmin:s.adminId
    }))
  );
  const { isOpen, onClose } = useModal(
    useShallow((s) => ({
      isOpen: s.isOpen,
      onClose: s.onClose,
    }))
  );
  console.log(idAdmin);
  console.log(isOpen);
  const isDesktop = useMediaQuery(desktop);
  const router = useRouter();


  return (
    <Credenza open={isOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="text-blue-500 text-2xl">Delete Admin</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="p-0 text-muted-foreground">
          <div
            className={clsx("flex flex-col ", {
              "items-center justify-center text-center px-2": isDesktop === false,
            })}
          >
            <p className="">Are you sure you want to delete this admin?</p>
            <p className="items-center text-sm text-destructive flex gap-1 ">
              <Info size={16} />
              <span className="text-left"> this person will be permanently deleted as admin</span>
            </p>
          </div>
        </CredenzaBody>
        <CredenzaFooter>
          <div className="flex items-center justify-center gap-2 flex-wrap">
         
            {/* <CredenzaClose asChild>
            <Button variant={"outline"}>cancel</Button>
          </CredenzaClose> */}
          <Button
              disabled={deleteAdmin.isPending}
              onClick={async () => {
                if (!idAdmin ) return null;
                await Promise.all([
                  deleteAdmin.execute({idAdmin }),
                ]);
              }}
              className={clsx("order-last", { " px-16": isDesktop === false })}
              variant={"defaultBtn"}
            >
              {" "}
              {deleteAdmin.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span>Delete</span>
              )}
            </Button>
            <Button
              className={clsx("", { " px-16": isDesktop === false })}
              onClick={onClose}
              variant={"outline"}
            >
              cancel
            </Button>
         
          </div>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
