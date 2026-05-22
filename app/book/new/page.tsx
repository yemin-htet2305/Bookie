import FileUploader from '@/components/FileUploader';
import UploadForm from '@/components/UploadForm';
import React from 'react'

function page() {
  return (
    <main className='wrapper container'>
        <div className="max-w-180 mx-auto mt-10 space-y-10">
            <section className="flex flex-col gap-5">
              <h1 className="book-title-lg">Create a New Book Summary</h1>
              <p className="subtitle">
                Upload a PDF to create a new ai-generated summary.
              </p>
            </section>
            <UploadForm />
          </div>
    </main>
  )
}

export default page;