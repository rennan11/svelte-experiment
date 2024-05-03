export type Files = {
  id: string;
  folders: {
    id: string;
    name: string;
    size: string;
    lastModified: string;
  }[];
  files: {
    id: string;
    name: string;
    size: string;
    lastModified: string;
  }[];
  parentId?: string;
};

export type Object = {
  id: string;
  name: string;
  size: string;
  lastModified: string;
  type: "folder" | "file";
  parentId?: string;
};

const data: Files[] = [
  {
    id: "0",
    folders: [
      {
        id: "1",
        name: "Folder A",
        size: "5.2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
      {
        id: "2",
        name: "Folder C",
        size: "1.2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
      {
        id: "3",
        name: "Folder B",
        size: "2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
      {
        id: "4",
        name: "Folder Z",
        size: "3.9 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
    files: [
      {
        id: "6",
        name: "File 1.zip",
        size: "2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
  },
  {
    id: "1",
    folders: [
      {
        id: "5",
        name: "Folder D",
        size: "1.2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
    files: [
      {
        id: "7",
        name: "File 2.zip",
        size: "2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
      {
        id: "8",
        name: "File 3.zip",
        size: "2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
    parentId: "0",
  },
  {
    id: "2",
    folders: [],
    files: [
      {
        id: "9",
        name: "File 4.zip",
        size: "1.2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
    parentId: "1",
  },
  {
    id: "3",
    folders: [],
    files: [
      {
        id: "10",
        name: "File 5.zip",
        size: "2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
    parentId: "0",
  },
  {
    id: "4",
    folders: [],
    files: [
      {
        id: "11",
        name: "File 6.zip",
        size: "3.9 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
    parentId: "0",
  },
  {
    id: "5",
    folders: [],
    files: [
      {
        id: "12",
        name: "File 7.zip",
        size: "1.2 MB",
        lastModified: new Date().toLocaleDateString("pt-BR"),
      },
    ],
    parentId: "1",
  },
];

let id = 13;

export let length = data.length;

export const find = (index: string) => {
  return data.find((item) => item.id === index) || data[0];
};

export const addFile = (index: string, object: Omit<Object, "id">) => {
  const newId = String(id++);
  data
    .find((item) => item.id === index)
    ?.files.push({
      id: newId,
      ...object,
    });
};

export const removeFile = (index: number, id: string) => {
  data[index].files = data[index].files.filter((file) => file.id !== id);
};

export const removeFolder = (index: number, id: string) => {
  data[index].folders = data[index].folders.filter(
    (folder) => folder.id !== id
  );
};

export const remove = (type: "file" | "folder", id: string) => {
  const index = data.findIndex((item) => {
    if (type === "file") {
      return item.files.some((file) => file.id === id);
    } else {
      return item.folders.some((folder) => folder.id === id);
    }
  });

  if (type === "file") {
    removeFile(index, id);
  } else {
    removeFolder(index, id);
  }
};

export const createFolder = (index: number, name: string) => {
  const newId = String(id++);
  data[index].folders.push({
    id: newId,
    name,
    size: "0 KB",
    lastModified: new Date().toLocaleDateString("pt-BR"),
  });
  data.push({
    id: newId,
    folders: [],
    files: [],
    parentId: String(index),
  });
  length++;
};
