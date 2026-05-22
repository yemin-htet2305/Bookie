"use client";
import { useRef } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {  X } from "lucide-react";
import { FileType, FileUploaderProps } from "@/type";

const ACCEPT_MAP: Record<FileType, string> = {
  image: "image/*",
  pdf: "application/pdf",
};

const VALID_TYPES: Record<FileType, (file: File) => boolean> = {
  image: (f) => f.type.startsWith("image/"),
  pdf: (f) => f.type === "application/pdf",
};
    

export default function FileUploader<T extends FieldValues>({
  control,
  name,
  label = "Upload File",
  accept = "pdf",
  placeholder = "",
  hint= "",
  icon: Icon,
}: FileUploaderProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isValid = VALID_TYPES[accept];

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={null as never}
      render={({ field: { value, onChange, ref, name: fieldName, onBlur }, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <Input
            ref={(el) => {
              ref(el);
              inputRef.current = el;
            }}
            type="file"
            name={fieldName}
            onBlur={onBlur}
            accept={ACCEPT_MAP[accept]}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (file && !isValid(file)) return;
              onChange(file);
            }}
          />
          <div
            className="upload-dropzone border-dashed border-2 rounded-md p-4 text-center cursor-pointer"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file && isValid(file)) onChange(file);
            }}
          >
            {value ? (
              <div className="flex flex-col items-center w-full px-4">
                <p className="upload-dropzone-text line-clamp-1">{(value as File).name}</p>
                <button
                  type="button"
                  className="upload-dropzone-remove mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <>
                <Icon className="upload-dropzone-icon mx-auto" />
                {placeholder && <p className="upload-dropzone-subtext">{placeholder}</p>}
                {hint && <p className="upload-dropzone-hint">{hint}</p>}
              </>
            )}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
