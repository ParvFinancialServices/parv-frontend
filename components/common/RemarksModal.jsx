"use client";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NotebookPenIcon, Trash2 } from "lucide-react";
import { useAddLeadRemark, useAddLoanRemark, useDeleteLeadRemark, useDeleteLoanRemark } from "@/hooks/useLead";
import api from "@/api/api";
import toast from "react-hot-toast";

export default function RemarksModal({
  remarks,
  itemId,
  itemType = "lead",
  user,
  triggerLabel = "Remarks",
  fetchData,
  showAddRemark = true,
}) {
  const [open, setOpen] = useState(false);
  const [newRemark, setNewRemark] = useState("");
  const [localRemarks, setLocalRemarks] = useState(Array.isArray(remarks) ? remarks : []);
  const [loadingRemarks, setLoadingRemarks] = useState(false);
  const [remarksLoaded, setRemarksLoaded] = useState(remarks !== undefined);
  const inputRef = useRef(null);
  const addLeadRemarkMutation = useAddLeadRemark();
  const addLoanRemarkMutation = useAddLoanRemark();
  const deleteLeadRemarkMutation = useDeleteLeadRemark();
  const deleteLoanRemarkMutation = useDeleteLoanRemark();
  const addRemarkMutation = itemType === "loan" ? addLoanRemarkMutation : addLeadRemarkMutation;
  const deleteRemarkMutation = itemType === "loan" ? deleteLoanRemarkMutation : deleteLeadRemarkMutation;

  useEffect(() => {
    const normalizedRemarks = Array.isArray(remarks) ? remarks : [];
    setLocalRemarks((prev) => {
      if (
        prev.length === normalizedRemarks.length &&
        normalizedRemarks.every((item, index) => item === prev[index])
      ) {
        return prev;
      }
      return normalizedRemarks;
    });
    if (remarks !== undefined) {
      setRemarksLoaded(true);
    }
  }, [remarks]);

  const loadLoanRemarks = async () => {
    if (!itemId || itemType !== "loan") return;
    setLoadingRemarks(true);
    try {
      const response = await api.get(`/loans/${itemId}`);
      if (response?.data?.success) {
        setLocalRemarks(Array.isArray(response.data.data?.remarks) ? response.data.data.remarks : []);
      }
    } catch (error) {
      console.error("Failed to load loan remarks", error);
    } finally {
      setLoadingRemarks(false);
      setRemarksLoaded(true);
    }
  };

  const handleDelete = (remarkId, remarkIndex) => {
    if (!itemId) return;

    const payload =
      itemType === "loan"
        ? { loanId: itemId, remarkIndex }
        : { leadId: itemId, remarkId };

    deleteRemarkMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response?.success) {
          setLocalRemarks((prev) =>
            itemType === "loan"
              ? prev.filter((_, index) => index !== remarkIndex)
              : prev.filter((remark) => remark?._id !== remarkId)
          );
          if (typeof fetchData === "function") {
            fetchData();
          }
        }
      },
    });
  };

  useEffect(() => {
    if (open && itemType === "loan" && !remarksLoaded) {
      loadLoanRemarks();
    }
  }, [open, itemType, itemId, remarksLoaded]);

  const handleAdd = () => {
    if (!newRemark.trim() || !showAddRemark) return;
    const remarkData = {
      text: newRemark,
      createdBy: user?.full_name || user?.username || "System",
      userId: user?.username || user?.id || "system",
    };

    const payload =
      itemType === "loan"
        ? { loanId: itemId, remarkData }
        : { leadId: itemId, remarkData };

    addRemarkMutation.mutate(payload, {
      onSuccess: (response) => {
        setNewRemark("");
        if (response?.success) {
          const updatedRemarks = Array.isArray(response?.data?.remarks)
            ? response.data.remarks
            : localRemarks;
          setLocalRemarks(updatedRemarks);
        }
        if (typeof fetchData === "function") {
          fetchData();
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <DialogTrigger asChild>
          <button className="flex items-center gap-1 px-2 cursor-pointer py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors">
            <NotebookPenIcon className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium">{triggerLabel}</span>
          </button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Remarks</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {showAddRemark ? (
            <>
              <div className="flex flex-col gap-2 sm:flex-row items-stretch sm:items-center">
                <Input
                  ref={inputRef}
                  placeholder="Add a remark..."
                  value={newRemark}
                  onChange={(e) => setNewRemark(e.target.value)}
                  disabled={addRemarkMutation.isPending}
                />
                <Button
                  className="w-full sm:w-auto"
                  onClick={handleAdd}
                  disabled={addRemarkMutation.isPending || !newRemark.trim()}
                >
                  {addRemarkMutation.isPending ? "Adding..." : "Add Remark"}
                </Button>
              </div>

              <Separator />
            </>
          ) : null}

          <ScrollArea className="h-60 pr-2">
            {loadingRemarks ? (
              <p className="text-sm text-muted-foreground text-center mt-6">
                Loading remarks...
              </p>
            ) : !Array.isArray(localRemarks) || localRemarks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center mt-6">
                No remarks yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {localRemarks.map((remark, index) => (
                  <li
                    key={remark?._id || index}
                    className="border rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="flex justify-between items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500">
                        {remark?.createdBy}({remark?.userId})
                      </span>
                      <span className="text-xs text-gray-500">
                        {remark?.createdAt ? new Date(remark.createdAt).toLocaleString() : ""}
                      </span>
                      <button
                        type="button"
                        disabled={deleteRemarkMutation.isPending}
                        onClick={() => handleDelete(remark?._id, index)}
                        title="Delete remark"
                        className="text-slate-500 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm mt-1">{remark?.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
