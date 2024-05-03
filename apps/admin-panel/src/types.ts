import { Faculty, Group, TelegramUser } from "@repo/database";

export type FullGroupType = Group & {
  _count: {
    userWithGroup: number;
  };
  faculty: Faculty;
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
