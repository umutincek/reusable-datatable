import DataTable from "./components/DataTable/DataTable";
import { Column } from "./types/types.ts";
import data from "./data/mock-data.json";

function App() {
  const columns: Column[] = [
    { key: "id", title: "ID" },
    {
      key: "firstName",
      title: "First Name",
    },
    {
      key: "lastName",
      title: "Last Name",
    },
    {
      key: "gender",
      title: "Gender",
      render: (text: string) => <h3>{text}</h3>,
    },
    {
      key: "email",
      title: "E-Mail",
    },
    {
      key: "jobTitle",
      title: "Job Title",
    },
  ];

  return (
    <div className="App">
      <DataTable data={data} columns={columns} pageSize={10} />
    </div>
  );
}

export default App;
