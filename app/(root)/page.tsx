import HeroSection from '@/components/HeroSection'
import { sampleBooks } from '@/lib/constant'
import BookCard from '@/components/BookCard'
import { getAllBooks } from '@/lib/action/book.action';

export default async function page() {
  const {success, data} = await getAllBooks();

  const books = success ? data?? [] : [];
  return (
    <>
      <main className='wrapper container'>
        <HeroSection />
        <div className='library-books-grid mt-15'>
          {books.map((book) => (
            <BookCard key={book._id} id={book._id} title={book.title} author={book.author}
            slug={book.slug} cover={book.coverURL} />
          ))}
        </div>
      </main>
    </>
  )
}
