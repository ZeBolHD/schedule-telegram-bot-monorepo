import { Faculty, Group as PrismaGroup, TelegramUser } from "@repo/database";

export type Group = PrismaGroup & {
  userCount: number;
  facultyName: string;
};

export type GroupApiResponse = {
  groups: Group[];
  count: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export type FullTelegramUserType = TelegramUser & {
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
  content: string;
}

export interface News {
  heading: string;
  content: string;
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
