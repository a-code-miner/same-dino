// app/unauthorized/page.js

import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="bg-red-500/10 p-8 rounded-lg text-center">
        <h1 className="text-4xl text-red-700 mb-4">دسترسی غیرمجاز!</h1>
        <h4 className="text-xl text-red-700">
          شما اجازه ورود به این صفحه را ندارید!
        </h4>
      </div>
      <Link
        href="/"
        className="text-blue-600 mt-6 bg-gray-200 px-4 py-2 rounded-lg transition hover:bg-gray-300"
      >
        بازگشت به صفحه ورود
      </Link>
    </div>
  );
}
