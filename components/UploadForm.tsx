"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookUploadSchema, BookUploadFormValues } from "@/lib/schema";
import FileUploader from "./FileUploader";
import { Upload, ImageUp, Loader2, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import VoiceSelector from "./VoiceSelector";
import React from "react";
import { toast } from "sonner";
import { checkBookExists, createBook, saveBookSegments } from "@/lib/action/book.action";
import { useRouter } from "next/navigation";
import { ROUTE } from "@/route";
import { parsePDFFile } from "@/lib/utils";
import { upload } from "@vercel/blob/client";
import { useAuth } from "@clerk/nextjs";


export default function UploadForm() {
  const {userId} = useAuth();
  const router= useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(BookUploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "",
      cover: "",
      book: null as unknown as File,
    },
  });
  const onSubmit = async (values: BookUploadFormValues) => {
    if (!userId) {
      toast.error("You must be signed in to upload a book.");
      return;
    }
    setIsSubmitting(true);
    try{
      const existCheck = await checkBookExists(values.title);
      if(existCheck.success && existCheck.exists && existCheck.book){
        form.reset();
        toast.info("A book with this title already exists.");
        router.push(ROUTE.BOOK_DETAIL(existCheck.book.slug));
        return;
      }

      const fileTitle = values.title.replace(/\s+/g, '-').toLowerCase();
      const pdfFile = values.book;

      const parsePdf = await parsePDFFile(pdfFile);
      if(parsePdf.content.length === 0){
        toast.error("Failed to parse PDF file.");
        return;
      }

      const uploadPDFBolb = await upload(fileTitle,pdfFile,{
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf'
      });

      let coverUrl: string;
      if(values.cover instanceof File){
        // Handle cover image upload
        const coverFile = values.cover;
        const uploadCoverBolb = await upload(`${fileTitle}_cover.png`,coverFile,{
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: coverFile.type
      });
        coverUrl = uploadCoverBolb.url;
      }else{
        const response = await fetch(parsePdf.cover);
        const blob = await response.blob();
        const uploadCoverBolb = await upload(`${fileTitle}_cover.png`,blob,{
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: blob.type
        });
        coverUrl = uploadCoverBolb.url;
      }

      const book = await createBook({
        clerkId: userId,
        title: values.title,
        author: values.author,
        persona: values.persona,
        coverURL: coverUrl,
        fileURL: uploadPDFBolb.url,
        fileBlobKey: uploadPDFBolb.pathname,
        fileSize: pdfFile.size
      });
      if(!book.success || !book.book){
        toast.error(book.error ?? "Failed to create book record.");
        return;
      }
      const segments = await saveBookSegments(book.book._id, userId, parsePdf.content);
      if(!segments.success || segments.data?.segmentCreated === 0){
        toast.error(segments.error ?? "Failed to save book segments.");
        return;
      }
      form.reset();
      toast.success("Book uploaded and processed successfully!");
      router.push(ROUTE.HOME);
    }catch(e){
      toast.error(e instanceof Error ? e.message : "An unknown error occurred while uploading the book");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#f8f4e9] rounded-2xl p-10 flex flex-col items-center gap-6 max-w-sm w-full mx-4 text-center"
            style={{ boxShadow: "var(--shadow-soft-lg)" }}>
            <div className="relative flex items-center justify-center w-20 h-20">
              <Loader2 className="absolute w-20 h-20 animate-spin text-[#212a3b] opacity-20" />
              <BookOpen className="w-10 h-10 text-[#212a3b]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#212a3b]">Synthesizing your book</h2>
              <p className="text-sm text-[#3d485e] leading-relaxed">
                Please wait while we process your PDF and prepare your interactive literary experience.
              </p>
            </div>
          </div>
        </div>
      )}
     <fieldset disabled={isSubmitting} className="space-y-6 disabled:opacity-60 disabled:pointer-events-none">
     <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FileUploader control={form.control}
        name="book" label="Upload Book in PDF Format"
        accept="pdf"
        placeholder="Select a PDF file"
        hint="Only PDF files are accepted. Max size: 50MB."
        icon={Upload}/>
        <FileUploader control={form.control}
        name="cover"
        label="Upload Cover Image"
        accept="image"
        placeholder="Select an image file"
        hint="Only image files are accepted. Max size: 10MB."
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
        <Button type="submit" className="form-btn" disabled={isSubmitting}>
          Begin Synthesis
        </Button>
     </form>
     </fieldset>
    </>
  );
}
