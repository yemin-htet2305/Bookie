import { BookCardProps } from '@/type'
import Image from 'next/image'
import React from 'react'

export default function BookCard({ id, title, author, slug, cover }: BookCardProps) {
  return (  
    <article className='book-card'>
        <figure className='book-cover'>
            <div className='book-card-cover-wrapper'>
                <Image width={133} height={200} 
                src={cover} alt={`${title} cover`} 
                className='book-card-cover'/>
            </div>
        </figure>
        <figcaption className='book-card-meta'>
            <h3 className='book-card-title'>{title}</h3>
            <p className='book-card-author'>by {author}</p>
        </figcaption>
    </article>
  )
}
