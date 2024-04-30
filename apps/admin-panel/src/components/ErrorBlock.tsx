interface ErrorBlockProps {
  onRefetch: () => void;
}

const ErrorFetchBlock = ({ onRefetch }: ErrorBlockProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-96 p-10 bg-white rounded-md text-black text-center flex flex-col justify-between">
        <h2 className="text-xl">Error while fetching groups</h2>
        <button
          type="button"
          className="mt-10 w-full p-3 bg-red-500 text-white rounded-md hover:bg-red-400"
          onClick={onRefetch}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFetchBlock;
