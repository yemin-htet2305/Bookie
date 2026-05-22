"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookUploadSchema, BookUploadFormValues } from "@/lib/schema";
import FileUploader from "./FileUploader";
import { Upload,ImageUp } from "lucide-react";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import VoiceSelector from "./VoiceSelector";


export default function UploadForm() {
  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(BookUploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "Chris",
      cover: "",
      book: null as unknown as File,
    },
  });
  const onSubmit = async (values: BookUploadFormValues) => {
    console.log(values);
  };

  return (
    <>
     <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FileUploader control={form.control} 
        name="book" label="Upload Book in PDF Format" 
        accept="pdf"  
        placeholder="Select a PDF file"
        hint="Only PDF files are accepted. Max size: 10MB."
        icon={Upload}/>
        <FileUploader control={form.control} 
        name="cover" 
        label="Upload Cover Image" 
        accept="image"  
        placeholder="Select an image file"
        hint="Only image files are accepted. Max size: 5MB."
        icon={ImageUp}/>
        <Controller 
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Title</FieldLabel>
              <Input {...field} placeholder="Enter book title" />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller 
          name="author"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Author</FieldLabel>
              <Input {...field} placeholder="Enter author name" />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller 
          name="persona"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Persona</FieldLabel>
              <VoiceSelector value={field.value} onChange={field.onChange} />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Button type="submit" className="form-btn">
          Begin Synthesis
        </Button>
     </form>
    </>
  );
}
