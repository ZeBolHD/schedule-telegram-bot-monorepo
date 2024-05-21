"use client";

import { useState } from "react";
import { useQuery } from "react-query";
import { RowSelectionState, Updater } from "@tanstack/react-table";

import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFetchBlock from "@/components/ErrorBlock";

import GroupAddSchedule from "./components/GroupAddSchedule";
import GroupFilters from "./components/GroupFilters";
import GroupTable from "./components/Table";
import getAllGroups from "@/actions/getAllGroups";
import { GetAllGroupsQuery, GroupFiltersType } from "@/types";
import { useSession } from "next-auth/react";
import GroupCreate from "./components/GroupCreate";

const GroupsPage = () => {
  const [groupsQuery, setGroupsQuery] = useState<GetAllGroupsQuery>({
    page: 1,
    pageSize: 10,
  });

  const session = useSession();

  const { data, refetch, isLoading } = useQuery(
    ["groups", groupsQuery, session.data?.accessToken],
    () => getAllGroups(groupsQuery, session.data?.accessToken!),
    {
      enabled: !!session.data?.accessToken,
      initialData: {
        groups: [],
        count: 0,
        page: 0,
        pageSize: 0,
        pageCount: 0,
      },
    },
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const onRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    setRowSelection(updater);
  };

  const resetRowSelection = () => {
    setRowSelection({});
  };

  const getSelectedGroups = () => {
    const keys = Object.keys(rowSelection);

    if (!data) {
      return [];
    }

    return keys.map((key) => data.groups[Number(key)]);
  };

  const selectedGroups = getSelectedGroups();

  const isAnyGroupSelected = selectedGroups.length > 0;

  const setPage = (page: number) => {
    setGroupsQuery((prev) => ({ ...prev, page }));
  };

  if (!data || isLoading || !session.data?.accessToken) {
    return <LoadingSpinner size={100} />;
  }

  if (!data) {
    return <ErrorFetchBlock onRefetch={refetch} />;
  }

  return (
    <div className="w-full h-full p-10">
      <div className="flex items-center justify-end">
        <GroupFilters setGroupsQuery={setGroupsQuery} />
        <GroupAddSchedule
          groups={selectedGroups}
          disabled={!isAnyGroupSelected}
          resetRowSelection={resetRowSelection}
        />
        <GroupCreate />
      </div>
      <GroupTable
        groups={data.groups}
        onRowSelectionChange={onRowSelectionChange}
        rowSelection={rowSelection}
        page={data.page}
        setPage={setPage}
        pageCount={data.pageCount}
      />
    </div>
  );
};

export default GroupsPage;
