"use client";

import { useContext, useEffect, useState } from "react";
import {
  ColumnFiltersState,
  RowSelectionState,
  Updater,
} from "@tanstack/react-table";
import { Faculty } from "@prisma/client";

import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFetchBlock from "@/components/ErrorBlock";
import { TableGroupsDataContext } from "@/context/TableGroupsDataContext";
import getAllFaculties from "@/actions/getAllFaculties";

import GroupCreate from "./components/GroupCreate";
import GroupAddSchedule from "./components/GroupAddSchedule";
import GroupFilters from "./components/GroupFilters";
import GroupTable from "./components/Table";

const GroupsPage = () => {
  const { groups, isLoading, refetch } = useContext(TableGroupsDataContext);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [faculties, setFaculties] = useState<Faculty[]>([]);

  const fetchFaculties = async () => {
    const faculties = await getAllFaculties();

    if (faculties === null) {
      return;
    }

    setFaculties(faculties);
  };

  const onRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    setRowSelection(updater);
  };

  const resetRowSelection = () => {
    setRowSelection({});
  };

  const getSelectedGroups = () => {
    const keys = Object.keys(rowSelection);

    if (!groups) {
      return [];
    }

    return keys.map((key) => groups[Number(key)]);
  };

  const selectedGroups = getSelectedGroups();

  const isAnyGroupSelected = selectedGroups.length > 0;

  useEffect(() => {
    fetchFaculties();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size={100} />;
  }

  if (groups === null) {
    return <ErrorFetchBlock onRefetch={refetch} />;
  }

  return (
    <div className="w-full h-full p-10">
      <div className="flex items-center justify-end">
        <GroupFilters
          faculties={faculties}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        />
        <GroupAddSchedule
          groups={selectedGroups}
          disabled={!isAnyGroupSelected}
          resetRowSelection={resetRowSelection}
        />
        <GroupCreate faculties={faculties} />
      </div>
      <GroupTable
        groups={groups}
        onRowSelectionChange={onRowSelectionChange}
        rowSelection={rowSelection}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
};

export default GroupsPage;
