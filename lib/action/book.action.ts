'use server';
import { connectdb } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/type";
import { generateSlug, serialzeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/bookSegment.model";

export const getAllBooks = async () => {
    try{
        await connectdb();
        const books = await Book.find({}).lean();
        return {
            success: true,
            data: books.map(serialzeData)
        }
    }catch(e){
        console.error("Error fetching all books:", e);
        return {
            success: false,
            error: e instanceof Error ? e.message : "An unknown error occurred while fetching books"
        }
    }
}

export const checkBookExists = async (title: string) => {
    try{
        await connectdb();
        const slug = generateSlug(title);
        const existingBook = await Book.findOne({slug}).lean();
        if(existingBook){
            return {
                success: true,
                exists: true,
                book: serialzeData(existingBook),
                alreadyExists: true
            }
        }
        return {
            success: true,
            exists: false,
            book: null,
            alreadyExists: false
        }

    }catch(e){
        console.error("Error checking book existence:", e);
        return {
            success: false,
            exists: false,
            error: e instanceof Error ? e.message : "An unknown error occurred while checking book existence"
        }
    }
}
export const createBook = async (data: CreateBook) => {
    try{
        await connectdb();
        const slug = generateSlug(data.title);
        const existingBook = await Book.findOne({slug});
        if(existingBook){
            return {
                success: true,
                book: serialzeData(existingBook),
                alreadyExists: true
            }
        }
        //Todo check user's subscription and limit number of books they can upload

        const newBook = await Book.create({...data,slug});
        return {
            success: true,
            book: serialzeData(newBook),
            alreadyExists: false
        }

    }catch(e){
        return{
            success: false,
            error: e instanceof Error ? e.message : "An unknown error occurred"
        }
    }
}
export const saveBookSegments = async (bookId:string, clerkId:string,segments: TextSegment[]) => {
    try{
        await connectdb();

        console.log('Saving segments...');
        const segmentsToInsert = segments.map(({text, segmentIndex, pageNumber, wordCount}) => ({
            bookId,
            clerkId,
            content: text,
            segmentIndex,
            pageNumber,
            wordCount
        }));
        await BookSegment.insertMany(segmentsToInsert);
        await Book.findByIdAndUpdate(bookId, { $set: { totalSegments: segments.length } });
        console.log('Segments saved successfully');
        return {
            success: true,
            data: {
                segmentCreated: segments.length
            }
        }
    }catch(e){
        await BookSegment.deleteMany({bookId});
        await Book.findByIdAndDelete(bookId);
        return{
            success: false,
            error: e instanceof Error ? e.message : "An unknown error occurred while saving segments"
        }
    }
}