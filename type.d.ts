import { FieldValues } from "react-hook-form";
import {LucideIcon} from "lucide-react";
export interface BookCardProps{
    id: string;
    title: string;
    author: string;
    slug: string;
    cover: string;
};
export type FileType = "image" | "pdf";
export interface FileUploaderProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  accept?: FileType;
  placeholder?: string;
  hint?: string;
  icon: LucideIcon;
};