import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function PaginationN({
  totalPages,
  hasNext,
  hasPrev,
  current,
}: {
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
  current: number;
}) {
  const navigate = useNavigate();
  // const current = useStore((s) => s.currentPage);
  // const setCurrentPage = useStore((s) => s.actions.setCurrentPage);

  function returnPaginationNumbers(current: number, total: number) {
    const start = 1;
    const end = total;
    const arr: number[] & string[] = [];

    for (let i = 1; i <= total; i++) {
      if (
        i === start ||
        i === end ||
        (i >= current - 2 && i <= current + 2) ||
        (Math.abs(current - i) === 3 && (i === start + 1 || i === end - 1))
      ) {
        arr.push(i);
      }
    }

    if (arr.includes(current + 2) && end - (current + 2) - 1 >= 2) {
      const index = arr.findIndex((a) => a === current + 2);
      arr.splice(index + 1, 0, "...");
    }
    if (arr.includes(current - 2) && current - 2 - start - 1 >= 2) {
      const index = arr.findIndex((a) => a === current - 2);
      arr.splice(index, 0, "...");
    }
    return arr;
  }

  function RenderButtons() {
    const pages = returnPaginationNumbers(current, totalPages!);
    return pages.map((c: number | string, i: number) => (
      <button
        onClick={() => {
          if (c === "...") {
            const page =
              i < current
                ? prompt("enter page no: ", (pages[i + 1] - 1).toString())
                : i > current
                  ? prompt("enter page no: ", (i + 1).toString())
                  : null;
            // if (page) setCurrentPage(Number(page));
            if (page) navigate(`?page=${page}`);
          } else {
            // setCurrentPage(Number(c));
            navigate(`?page=${c}`);
          }
        }}
        className={`px-2.5 py-1 overflow-hidden border-t border-b border-r ${i === 0 ? "border-l rounded-l" : ""} ${i === pages.length - 1 ? "rounded-r" : ""} ${current === c ? "bg-white border border-green-500" : "bg-[#fbfbfb]"}  transition-colors duration-300`}
        key={i}
      >
        {c}
      </button>
    ));
  }

  return (
    <div className="text-xs flex gap-2">
      <button
        className="[&_svg]:h-4 py-1 pr-2 flex items-center rounded overflow-hidden border bg-[#f9f9f9] disabled:opacity-70 disabled:cursor-not-allowed transition-opacity duration-300"
        disabled={!hasPrev}
        onClick={() => navigate(`?page=${current - 1}`)}
      >
        <ChevronLeft />
        <p>Prev</p>
      </button>
      <div className="flex">{RenderButtons()}</div>
      <button
        className="[&_svg]:h-4 py-1 pl-2 flex items-center rounded overflow-hidden border bg-[#f9f9f9] disabled:opacity-70 disabled:cursor-not-allowed transition-opacity duration-300"
        disabled={!hasNext}
        onClick={() => navigate(`?page=${current + 1}`)}
      >
        <p>Next</p>
        <ChevronRight />
      </button>
    </div>
  );
}
