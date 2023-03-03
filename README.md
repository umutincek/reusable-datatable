# havas-assignment-datatable
Reusable Datatable Component for Havas CX Assignment with React and TypeScript

Project Usage

**Install Packages** 
yarn

**Run dev** 
yarn dev

**Docs**

  **Datatable Props**
  
    data: any[] --> Datatable body data source. (required)
    columns: Column[] --> Datatable columns. (required)
    pageSize: number --> Datatable pagination per page data count. (Default Value= 5)
    
    **Column Type**
      key: string --> Datatable column key. (required)
      title: string --> Datatable column header title. (required)
      render: (text: any, row: Record<string, any>) => React.ReactNode --> Datatable element set html element


