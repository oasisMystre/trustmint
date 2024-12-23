export default function ShimNewTokenItem() {
  return (
    <tr className="border-y dark:border-dark-50">
      <td className="border-r dark:border-dark-50">
        <div className="flex items-center space-x-2">
          <div className="size-12 rounded-full bg-white animate-pulse dark:bg-dark-50" />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-24 h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
              <div className="w-4 h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
            </div>
            <div className="w-24 h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
          </div>
        </div>
      </td>
      <td>
        <div className="h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
      </td>
      <td>
        <div className="h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
      </td>
      <td>
        <div className="flex flex-col space-y-1">
          <div className="h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
          <div className="flex space-x-2">
            <div className="flex-1 h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
            <div className="flex-1 h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
          </div>
        </div>
      </td>
      <td>
        <div className="flex flex-col space-y-1">
          <div className="h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
          <div className="flex space-x-2">
            <div className="flex-1 h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
            <div className="flex-1 h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
          </div>
        </div>
      </td>
      <td>
        <div className="h-4 bg-white animate-pulse rounded dark:bg-dark-50" />
      </td>
    </tr>
  );
}
