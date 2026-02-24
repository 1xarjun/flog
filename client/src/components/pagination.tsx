import { useState } from "react";

export default function Pagination() {
  const totalPages = 100;
  const [current, setCurrent] = useState(1);

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
    const pages = returnPaginationNumbers(current, 9);
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
            if (page) setCurrent(Number(page));
          } else {
            setCurrent(Number(c));
          }
        }}
        className={`px-2.5 py-1 rounded-xs border-t border-b border-r ${i === 0 ? "border-l" : ""} ${current === c ? "bg-white border border-green-500" : "bg-[#fbfbfb]"}  `}
        key={i}
      >
        {c}
      </button>
    ));
  }

  return (
    <div className="text-xs flex gap-2 text-gray-800">
      <button
        className="px-2.5 py-1 rounded-xs border bg-[#f9f9f9] disabled:hidden"
        disabled={current === 1}
        onClick={() => setCurrent((p) => p - 1)}
      >
        Prev
      </button>
      <div className="flex">{RenderButtons()}</div>
      <button
        className="px-2.5 py-1 rounded-xs border bg-[#f9f9f9] disabled:hidden"
        disabled={current === totalPages}
        onClick={() => setCurrent((p) => p + 1)}
      >
        Next
      </button>
    </div>
  );
}
