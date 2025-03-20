interface SearchResultCardProps {
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

export default function SearchResultCard({
  title,
  date,
  description,
  imageUrl,
}: SearchResultCardProps) {
  return (
    <div className="flex bg-white p-4 rounded-lg shadow-md gap-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-24 h-36 object-cover rounded-lg"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-gray-500 text-sm">{date}</p>
          <p className="text-gray-700 mt-2 line-clamp-2">{description}</p>
        </div>
      </div>
    </div>
  );
}
