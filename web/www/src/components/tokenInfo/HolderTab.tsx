import { MdFilterListAlt } from "react-icons/md";

export default function HolderTab() {
  return (
    <div className="flex-1 w-full max-h-xl overflow-scroll">
      <table className="w-full max-h-xl overflow-scroll">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Address</th>
            <th>Percentage</th>
            <th>Amount</th>
            <th>Value</th>
            <th>Tnxs</th>
          </tr>
        </thead>
        <tbody className="text-xs md:text-sm">
          {Array.from({ length: 100 }).map((_, index) => (
            <tr key={index}>
              <td className="inline-flex items-center space-x-2">
                {index + 1}
              </td>
              <td className="font-mono">29k...wJi</td>
              <td className="font-mono">
                26.77<span className="font-sans">%</span>
              </td>
              <td>267.8M</td>
              <td className="font-mono">$16.9k</td>
              <td>
                <MdFilterListAlt className="text-black/50 dark:text-white/50" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
