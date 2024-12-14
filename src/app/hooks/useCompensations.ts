import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { Compensation } from "@/types/compensation";

export const useCompensations = () => {
  const [compensationCurrency, setCompensationCurrency] = useLocalStorage<
    "eur" | "usd"
  >("compensationCurrency", "eur");
  const [compensationBase, setCompensationBase] = useLocalStorage<number>(
    "compensationBase",
    40
  );
  const [editingCompensationIndex, setEditingCompensationIndex] =
    useLocalStorage<number | undefined>("editingCompensationIndex", undefined);
  const [editingCompensation, setEditingCompensation] = useLocalStorage<
    Partial<Compensation> | undefined
  >("editingCompensation", undefined);
  const [compensations, setCompensations] = useLocalStorage<Compensation[]>(
    "compensations",
    []
  );

  return {
    compensationCurrency,
    setCompensationCurrency,
    compensationBase,
    setCompensationBase,
    editingCompensationIndex,
    setEditingCompensationIndex,
    editingCompensation,
    setEditingCompensation,
    compensations,
    setCompensations,
  };
};
