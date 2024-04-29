import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AppTable } from "./AppTable";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="pt-4">
      <QueryClientProvider client={queryClient}>
        <AppTable />
      </QueryClientProvider>
    </div>
  );
}

export default App;
