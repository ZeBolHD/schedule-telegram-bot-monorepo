import { Group as PrismaGroup, TelegramUser as PrismaTelegramUser } from "@repo/database";

export type Group = PrismaGroup & {
  userCount: number;
  facultyName: string;
};

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
}

export type GroupApiResponse = {
  groups: Group[];
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type TelegramUser = PrismaTelegramUser & {
  groups: string[];
};

export type GroupCreateType = {
  code: string;
  grade: string;
  facultyId: string;
  studyType: string;
};

export interface Announcement {
  heading: string;
  text: string;
}

export interface News {
  heading: string;
  text: string;
  images: FileList;
}

export type Media = {
  type: string;
  media: string;
  caption?: string;
  parse_mode?: string;
};

export type GroupFiltersType = {
  facultyId?: string | number;
  studyType?: string | number;
  grade?: string | number;
};

export type GetAllGroupsQuery = GroupFiltersType & {
  page?: number;
  pageSize?: number;
};

export type Teacher = {
  id: number;
  name: string;
  place: string;
  contact?: string;
  departmentId: number;
  departmentName: string;
  createdAt: Date;
};

export type GetAllTeachersQuery = {
  page?: number;
  pageSize?: number;
  departmentId?: number;
  createdAt?: "desc" | "asc";
};

export type GetAllTeachersResponse = {
  teachers: Teacher[];
  departmentName: string;
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type Department = {
  id: number;
  name: string;
};

export type DocumentCategory = {
  id: number;
  name: string;
};

export type Document = {
  id: number;
  name: string;
  fileId: string;
  categoryId: number;
};

export type DocumentCategoryWithDocuments = DocumentCategory & {
  documents: Document[];
};

export type Admin = {
  id: number;
  name: string;
  role: Role;
};
