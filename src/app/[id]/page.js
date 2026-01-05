import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { id } = await params;

  // Simple authentication check
  if (id !== "d5299930-7f88-4059-9a9a-c6071c575555") {
    notFound();
  }

  // Read data
  const dataPath = path.join(process.cwd(), "src", "data", "loves.json");
  let couples = [];

  try {
    const fileContent = await fs.readFile(dataPath, "utf8");
    couples = JSON.parse(fileContent);
    // Sort by most recent first
    couples.reverse();
  } catch (error) {
    console.error("Error reading loves.json", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative overflow-hidden bg-slate-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-300/30 blur-3xl animate-pulse"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-rose-300/20 blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-200/30 blur-3xl"></div>
      </div>

      <div className="w-full max-w-5xl z-10">
        <div className="text-center mb-10 mt-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600 mb-2 drop-shadow-sm">
            Cupid's Logbook 📖
          </h1>
          <p className="text-rose-400 font-medium">
            History of Love Calculations
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-pink-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">
                List of love compatibility calculations
              </caption>
              <thead className="bg-pink-50/80 border-b border-pink-200">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-sm font-bold text-pink-600 uppercase tracking-wider"
                  >
                    Date & Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-sm font-bold text-pink-600 uppercase tracking-wider"
                  >
                    Couples
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-center text-sm font-bold text-pink-600 uppercase tracking-wider"
                  >
                    Love %
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-5 text-left text-sm font-bold text-pink-600 uppercase tracking-wider w-1/3"
                  >
                    Meter
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-100/50">
                {couples.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center text-gray-500"
                    >
                      No calculations recorded yet.
                    </td>
                  </tr>
                ) : (
                  couples.map((couple, index) => (
                    <tr
                      key={couple.key || index}
                      className="hover:bg-white/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                        <div className="flex flex-col">
                          <span>
                            {new Date(couple.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-pink-400">
                            {new Date(couple.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2 text-gray-700 font-bold">
                          <span
                            className="truncate max-w-[150px]"
                            title={couple.names[0]}
                          >
                            {couple.names[0]}
                          </span>
                          <span className="text-pink-500 animate-pulse">
                            ❤️
                          </span>
                          <span
                            className="truncate max-w-[150px]"
                            title={couple.names[1]}
                          >
                            {couple.names[1]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-lg font-black bg-white border border-pink-200/50 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 shadow-sm">
                          {couple.percentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-pink-400 via-rose-400 to-rose-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${couple.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
