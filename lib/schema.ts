import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
} from "./constant";

const fileSchema = (
  acceptedTypes: string[],
  maxSize: number,
  label: string
) =>
  z.custom<File>(
    (val) => val instanceof File,
    { message: `${label} is required` }
  ).refine(
    (file) => file.size <= maxSize,
    { message: `${label} must be under ${maxSize / (1024 * 1024)}MB` }
  ).refine(
    (file) => acceptedTypes.includes(file.type),
    { message: `${label} must be ${acceptedTypes.join(" or ")}` }
  );

const imageSchema = (acceptedTypes: string[], maxSize: number, label: string) =>
  z.union([
    z.string().url({ error: `${label} must be a valid URL` }),
    z.custom<File>((val) => val instanceof File, {
      message: `${label} must be a file or a valid image URL`,
    })
      .refine((file) => file.size <= maxSize, {
        message: `${label} must be under ${maxSize / (1024 * 1024)}MB`,
      })
      .refine((file) => acceptedTypes.includes(file.type), {
        message: `${label} must be ${acceptedTypes.join(" or ")}`,
      }),
  ]);

export const BookUploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be under 200 characters"),
  author: z.string().min(1, "Author is required").max(100, "Author must be under 100 characters"),
  persona: z.string().min(1, "Persona is required").max(100, "Persona must be under 100 characters"),
  cover: imageSchema(ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE, "Cover image"),
  book: fileSchema(ACCEPTED_PDF_TYPES, MAX_FILE_SIZE, "Book PDF"),
});

export type BookUploadFormValues = z.infer<typeof BookUploadSchema>;
