"use client";

import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-secondary-50 flex items-center justify-center px-4">
			<div className="max-w-md w-full text-center">
				{/* 404 Illustration */}
				<div className="mb-8">
					<span className="text-9xl font-bold text-primary-200">404</span>
				</div>

				{/* Message */}
				<h1 className="text-2xl font-bold text-secondary-900 mb-2">
					Page Not Found
				</h1>
				<p className="text-secondary-600 mb-8">
					Sorry, we couldn&apos;t find the page you&apos;re looking for. 
					It might have been moved or doesn&apos;t exist.
				</p>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link
						href="/"
						className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
					>
						<Home className="h-5 w-5" />
						Go Home
					</Link>
					<Link
						href="/products"
						className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-secondary-300 bg-white text-secondary-700 font-medium hover:bg-secondary-50 transition-colors"
					>
						<Search className="h-5 w-5" />
						Browse Products
					</Link>
				</div>

				{/* Back Link */}
				<div className="mt-8">
					<button
						onClick={() => typeof window !== "undefined" && window.history.back()}
						className="inline-flex items-center gap-1 text-sm text-secondary-500 hover:text-primary-600 transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Go back to previous page
					</button>
				</div>
			</div>
		</div>
	);
}
