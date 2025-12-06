import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Props for the Pagination component.
 */
export interface PaginationProps {
  // Required props
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  
  // Optional props
  /** Items per page */
  pageSize?: number;
  /** Total number of items */
  totalItems?: number;
  /** Whether to show page numbers */
  showPageNumbers?: boolean;
  /** Whether to show page size selector */
  showPageSize?: boolean;
  /** Whether to show total items count */
  showTotalItems?: boolean;
  /** Number of sibling pages to show */
  siblingCount?: number;
  /** Additional CSS classes */
  className?: string;
  /** Visual variant */
  variant?: 'default' | 'compact' | 'minimal';
  /** Size of the pagination controls */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Pagination component with support for different variants and sizes.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  showPageNumbers = true,
  showPageSize = false,
  showTotalItems = false,
  siblingCount = 1,
  className = '',
  variant = 'default',
  size = 'md'
}) => {
  const t = useTranslations("Dashboard.CRM.Pagination");

  // Don't render if no pages
  if (totalPages <= 1) return null;

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const buttonSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const generatePaginationRange = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + first + last + current
    const totalBlocks = totalNumbers + 2; // totalNumbers + dots

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - siblingCount);
      const endPage = Math.min(totalPages - 1, currentPage + siblingCount);

      const pages: (number | string)[] = [1];

      if (startPage > 2) {
        pages.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);

      return pages;
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const pages = generatePaginationRange();

  const handlePageSizeChange = (newSize: number) => {
    // This would typically be handled by parent component
    // Page size change logic would go here
  };

  const renderPageInfo = () => {
    if (!showTotalItems || !totalItems || !pageSize) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
      <div className="text-slate-600 text-sm">
        {t("showing", { start: startItem, end: endItem, total: totalItems.toLocaleString() })}
      </div>
    );
  };

  const renderPageSizeSelector = () => {
    if (!showPageSize) return null;

    const pageSizes = [10, 25, 50, 100];

  };

  // Minimal variant - just previous/next
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        {renderPageInfo()}
        <div className="flex items-center gap-2">
          {renderPageSizeSelector()}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonSizeClasses[size]} ${sizeClasses[size]}`}
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <span className="text-slate-600 px-2">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonSizeClasses[size]} ${sizeClasses[size]}`}
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  // Compact variant - limited page numbers
  if (variant === 'compact') {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        {renderPageInfo()}
        <div className="flex items-center gap-2">
          {renderPageSizeSelector()}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonSizeClasses[size]} ${sizeClasses[size]}`}
          >
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          
          <div className="flex items-center gap-1">
            {pages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className={`flex items-center justify-center text-slate-400 ${buttonSizeClasses[size]}`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page as number)}
                  className={`flex items-center justify-center rounded-xl border-2 font-medium transition-colors ${buttonSizeClasses[size]} ${
                    currentPage === page
                      ? 'border-[#005bbc] bg-[#005bbc] text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  } ${sizeClasses[size]}`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonSizeClasses[size]} ${sizeClasses[size]}`}
          >
            <ChevronRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    );
  }

  // Default variant - full featured
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      {renderPageInfo()}
      
      <div className="flex items-center gap-2">
        {renderPageSizeSelector()}
        
        <nav className="flex items-center gap-1" aria-label="Pagination">
          {/* Previous button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center rounded-l-xl border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonSizeClasses[size]} ${sizeClasses[size]} rtl:rotate-180`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {showPageNumbers && (
            <div className="flex items-center gap-1">
              {pages.map((page, index) => {
                if (page === '...') {
                  return (
                    <span
                      key={`dots-${index}`}
                      className={`flex items-center justify-center text-slate-400 ${buttonSizeClasses[size]} ${sizeClasses[size]}`}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page as number)}
                    className={`flex items-center justify-center rounded-xl border-2 font-medium transition-colors ${buttonSizeClasses[size]} ${
                      currentPage === page
                      ? 'border-[#005bbc] bg-[#005bbc] text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    } ${sizeClasses[size]}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
          )}

          {/* Next button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center rounded-r-xl border-2 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${buttonSizeClasses[size]} ${sizeClasses[size]} rtl:rotate-180`}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      </div>
    </div>
  );
};