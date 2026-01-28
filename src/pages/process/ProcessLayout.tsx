import { Outlet, useParams } from "react-router-dom";
import Header from "@/components/Header";
import type { ReactNode } from "react";
import type { Process } from "@/features/process/Process";
import useProcessStore from "@/features/process/store/useProcessStore";
import { useEffect } from "react";

export interface ProcessContextType {
  header: ReactNode;
  process?: Process;
}

export default function ProcessLayout() {
  const { processId } = useParams<{ processId: string }>();
  const { selectedProcess, selectProcess, getProcessById } = useProcessStore();

  const process =
    selectedProcess?.id === processId
      ? selectedProcess
      : getProcessById(processId!);

  useEffect(() => {
    if (process && selectedProcess?.id !== process.id) {
      selectProcess(process);
    }
  }, [process, selectedProcess, selectProcess]);

  return (
    <>
      <Outlet context={{ process }} />
    </>
  );
}
