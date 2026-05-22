import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import { sampleBooks } from '@/lib/constant'
import BookCard from '@/components/BookCard'

export default function page() {
  return (
    <>
      <main className='wrapper container'>
        <HeroSection />
        <div className='library-books-grid mt-15'>
          {sampleBooks.map((book) => (
            <BookCard key={book._id} id={book._id} title={book.title} author={book.author}
            slug={book.slug} cover={book.coverURL} />
          ))}
        </div>
      </main>
    </>
  )
}
