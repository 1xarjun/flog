export default function PostBody({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="h-full px-2 flex flex-col gap-2">
      <p className="text-[16px] truncate font-medium text-gray-800 py-2">
        {title}
      </p>
      <p className=" text-gray-700 line-clamp-5 text-sm">{description}</p>
    </div>
  );
}
