import { Outlet, useParams } from "react-router-dom";
import Header from "@/components/Header";
import SmartText from "@/components/SmartText";
import type { ReactNode } from "react";
import type { Process } from "@/features/process/Process";
import useProcessStore from "@/features/process/store/useProcessStore";

export interface ProcessContextType {
  header: ReactNode;
  process?: Process;
}

export default function ProcessLayout() {
    const { processId } = useParams<{ processId: string }>();
    const { selectedProcess, selectProcess, getProcessById } = useProcessStore();

    let process = selectedProcess;
    if (!process || process.id !== processId) {
      process = getProcessById(processId!);
      if (process) selectProcess(process); // optional: Store synchronisieren
    }
 
  const header = (
    <Header
      title={
        process?.title ? (
          <SmartText variant="h2" className="truncate">
            {process.title}
          </SmartText>
        ) : (
          "Oh, da ist was mit dem Titel schief gelaufen"
        )
      }
    />
  );

  return (
    <>
      {header}
      <Outlet context={{ header, process }} />
    </>
  );
}
