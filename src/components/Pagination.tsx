"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const router = useRouter();

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const onPageChange = (page: number) => {
    router.push(window.location.pathname + "?" + `page=${page.toString()}`);
  };

  const onSkipForward = () => {
    if (currentPage + 10 <= totalPages) {
      onPageChange(currentPage + 10);
    } else {
      onPageChange(totalPages);
    }
  };

  const onSkipBackward = () => {
    if (currentPage - 10 >= 1) {
      onPageChange(currentPage - 10);
    } else {
      onPageChange(1);
    }
  };

  const getPageRange = () => {
    const range = [];
    const delta = 2; // Number of pages to show before and after current page

    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    return range;
  };

  const pageRange = getPageRange();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      {/* Skip Backward Button */}
      <button
        onClick={onSkipBackward}
        className=" flex items-center px-4 py-1 rounded border border-white hover:bg-gray-100 hover:border-gray-200 transition duration-200"
        title="Skip 10 Pages Back"
      >
        <ChevronsLeft className="h-5 w-5" /> 10
      </button>

      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center py-1 px-2 border border-white hover:bg-gray-100 hover:border-gray-200 rounded cursor-pointer"
        title="Previous Page"
      >
        <ChevronLeft className="h-5 w-5" /> Previous
      </button>

      {/* Page Numbers with Ellipsis */}
      {currentPage > 3 && (
        <span className="hover:bg-gray-100 py-1 px-2 border border-white hover:border-gray-200 rounded cursor-pointer">
          ...
        </span>
      )}

      {pageRange.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-1 rounded text-sm font-semibold ${
            page === currentPage ? "border border-gray-200" : ""
          } transition duration-200`}
          title={`Page ${page}`}
        >
          {page}
        </button>
      ))}
      {currentPage < totalPages - 2 && (
        <span className="px-2 text-gray-600">...</span>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center py-1 px-2 border border-white hover:bg-gray-100 hover:border-gray-200 rounded cursor-pointer"
        title="Next Page"
      >
        Next
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Skip Forward Button */}
      <button
        onClick={onSkipForward}
        className=" flex items-center px-4 py-1 rounded border border-white hover:bg-gray-100 hover:border-gray-200 transition duration-200"
        title="Skip 10 Pages Forward"
      >
        10
        <ChevronsRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;
