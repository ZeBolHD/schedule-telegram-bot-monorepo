import { createContext, useEffect, useState } from "react";

import { FullGroupType } from "@/types";
import getAllGroups from "@/actions/getAllGroups";

interface TableGroupsDataContextProps {
  groups: FullGroupType[] | null;
  isLoading: boolean;
  refetch: () => void;
}

const initialState: TableGroupsDataContextProps = {
  groups: null,
  isLoading: true,
  refetch: () => {},
};

const TableGroupsDataContext =
  createContext<TableGroupsDataContextProps>(initialState);

const TableGroupsDataContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [groups, setGroups] = useState<FullGroupType[] | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refetch = async () => {
    setIsLoading(true);
    const groups = await getAllGroups();
    setIsLoading(false);
    setGroups(groups);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <TableGroupsDataContext.Provider value={{ groups, isLoading, refetch }}>
      {children}
    </TableGroupsDataContext.Provider>
  );
};

export { TableGroupsDataContext, TableGroupsDataContextProvider };
