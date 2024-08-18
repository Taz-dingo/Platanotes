import Link from "next/link";
import React from "react";

type CategoriesProps = {
  categories: string[];
};

export default function Categories({ categories }: CategoriesProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={`/${category}`}
              className="text-blue-600 hover:underline"
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
