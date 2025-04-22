import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className={
              currentPage === 1
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          // Show 5 pages max with current page in the middle when possible
          let pageNum;
          if (totalPages <= 5) {
            pageNum = i + 1;
          } else {
            const leftOffset = Math.min(2, currentPage - 1);
            pageNum = currentPage - leftOffset + i;
            if (pageNum > totalPages) pageNum = totalPages - (5 - i - 1);
            if (pageNum < 1) pageNum = i + 1;
          }

          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={currentPage === pageNum}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            className={
              currentPage === totalPages
                ? 'pointer-events-none opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
