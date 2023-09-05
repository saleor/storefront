'use client'

import { clsx } from 'clsx';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export function AddButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit"
      disabled={pending}
      className={clsx(pending && "cursor-not-allowed", "items-center max-w-md w-full px-6 py-3 font-medium leading-6 text-base shadow rounded-md text-white bg-slate-700 hover:bg-slate-600 transition ease-in-out duration-150")}
    >
      {pending ? (
        <div className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <span>Add to cart</span>
      )}
    </button>

  )
}