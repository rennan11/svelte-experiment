<script lang="ts">
  import * as Card from "$lib/components/ui/card";
  import DataTable from "$lib/components/DataTable.svelte";
  import {
    addFile,
    createFolder,
    find,
    remove,
    type Files,
    type Object,
  } from "./data";
  import { writable } from "svelte/store";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Dialog from "$lib/components/ui/dialog";
  import { toast } from "svelte-sonner";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Icon from "@iconify/svelte";

  let unselected: () => void;

  const convertData = (file: Files) => {
    let all: Array<Object> = [];
    console.log(file);
    if (file.parentId) {
      all.push({
        id: file.parentId,
        name: "..",
        type: "folder",
        lastModified: "",
        size: "",
        parentId: file.parentId,
      });
    }
    all = all.concat(
      file.folders.map((folder) => ({
        ...folder,
        type: "folder",
      }))
    );
    all = all.concat(
      file.files.map((file) => ({
        ...file,
        type: "file",
      }))
    );
    return all;
  };

  let page = 0;
  let data = writable(convertData(find(String(page))));
  let localData = convertData(find(String(page)));
  let selectedFiles: Object[] = [];
  let selectedFolders: Object[] = [];

  const handleFolder = (file: Object) => {
    console.log(file);
    if (file.type === "folder") {
      if (file.parentId) {
        data.set(convertData(find(file.parentId)));
        localData = convertData(find(file.parentId));
        page = Number(file.parentId);
      } else {
        data.set(convertData(find(file.id)));
        localData = convertData(find(file.id));
        page = Number(file.id);
      }
    }
  };

  const onSelected = (detail: string[]) => {
    const objects = localData;
    let files = [];
    let folders = [];
    for (const index of detail) {
      if (objects[Number(index)] && objects[Number(index)].type === "file") {
        files.push(objects[Number(index)]);
      } else if (
        objects[Number(index)] &&
        objects[Number(index)].type === "folder"
      ) {
        folders.push(objects[Number(index)]);
      }
    }
    selectedFiles = files;
    selectedFolders = folders;
  };

  let multiDownloadOpen = false;
  let multiDeleteOpen = false;
  let deleteOpen = false;
  let toDelete: Object | null = null;
  let listDelete: Object[] = [];
  let uploadOpen = false;
  let createFolderOpen = false;

  const downloadMultiFiles = () => {
    multiDownloadOpen = false;
    toast.success("Files Downloaded!", {
      description: "Your files have been downloaded successfully.",
    });
    unselected();
  };

  const openDeleteDialog = (detail: Object) => {
    deleteOpen = true;
    toDelete = detail;
  };

  const openDeleteDialogMulti = () => {
    listDelete = selectedFiles.concat(selectedFolders);
    multiDeleteOpen = true;
  };

  const handleDelete = () => {
    const detail = toDelete;
    if (detail) {
      remove(detail.type, detail.id);
      data.set(convertData(find(String(page))));
      localData = convertData(find(String(page)));
    }
  };

  const handleDeleteMulti = () => {
    for (const detail of listDelete) {
      remove(detail.type, detail.id);
    }
    data.set(convertData(find(String(page))));
    localData = convertData(find(String(page)));
    multiDeleteOpen = false;
    unselected();
  };

  let fileName = "";
  let folderName = "";

  const refresh = () => {
    data.set(convertData(find(String(page))));
    localData = convertData(find(String(page)));
  };
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>List of Files</Card.Title>
    <Card.Description>Navigate through your files</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="flex mb-2 justify-between items-center">
      <div class="flex justify-start gap-2 items-center">
        {#if selectedFiles.length > 0 || selectedFolders.length > 0}
          <Button on:click={() => openDeleteDialogMulti()} size="icon"
            ><Icon icon="fa-solid:trash" /></Button
          >
        {/if}
        {#if selectedFiles.length > 0}
          <Button on:click={() => (multiDownloadOpen = true)} size="icon"
            ><Icon icon="fa-solid:download" /></Button
          >
        {/if}
      </div>
      <div class="flex justify-end gap-2">
        <Button on:click={() => (uploadOpen = true)} size="icon"
          ><Icon icon="fa-solid:upload" /></Button
        >
        <Button
          on:click={() => (unselected(), (createFolderOpen = true))}
          size="icon"><Icon icon="fa-solid:folder-plus" /></Button
        >
        <Button on:click={() => (unselected(), refresh())} size="icon"
          ><Icon icon="fa-solid:sync" /></Button
        >
      </div>
    </div>
    <DataTable
      {data}
      on:folder={({ detail }) => handleFolder(detail)}
      on:selected={({ detail }) => onSelected(detail)}
      on:delete={({ detail }) => openDeleteDialog(detail)}
      bind:deselectedAll={unselected}
    />
  </Card.Content>
  <Card.Footer>
    <div class="w-full flex justify-end">
      <div>{selectedFiles.concat(selectedFolders).length} Objects Selected</div>
    </div>
  </Card.Footer>
</Card.Root>

<Dialog.Root bind:open={multiDownloadOpen}>
  <Dialog.Trigger />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Multi Download Files</Dialog.Title>
      <Dialog.Description>
        <div class="text-center text-white text-base mt-2">
          <div class="mb-2">You about to download the following files:</div>
          {#each selectedFiles as selected}
            <div>{selected.name}</div>
          {/each}
        </div>
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button
        variant="destructive"
        on:click={() => (unselected(), (multiDownloadOpen = false))}
      >
        Cancel
      </Button>
      <Button on:click={downloadMultiFiles}>Download All</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={deleteOpen}>
  <Dialog.Trigger />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you Sure?</Dialog.Title>
      <Dialog.Description>
        <div class="text-center text-white text-base mt-2">
          <div class="mb-2">You about to delete the following object:</div>
          <div>{toDelete?.name}</div>
        </div>
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="destructive" on:click={() => (deleteOpen = false)}>
        Cancel
      </Button>
      <Button on:click={() => (handleDelete(), (deleteOpen = false))}
        >Delete</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={multiDeleteOpen}>
  <Dialog.Trigger />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Are you Sure?</Dialog.Title>
      <Dialog.Description>
        <div class="text-center text-white text-base mt-2">
          <div class="mb-2">You about to delete the following object:</div>
          {#each listDelete as selected}
            <div>{selected.name}</div>
          {/each}
        </div>
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button
        variant="destructive"
        on:click={() => (unselected(), (multiDeleteOpen = false))}
      >
        Cancel
      </Button>
      <Button on:click={() => (handleDeleteMulti(), (multiDeleteOpen = false))}
        >Delete All</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={uploadOpen}>
  <Dialog.Trigger />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Upload a new file</Dialog.Title>
      <Dialog.Description>
        <div class="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label for="picture">File</Label>
          <Input id="picture" type="file" bind:value={fileName} />
        </div>
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button
        variant="destructive"
        on:click={() => {
          uploadOpen = false;
        }}
      >
        Cancel
      </Button>
      <Button
        on:click={() => {
          addFile(String(page), {
            name: fileName.split("\\").pop() || "test",
            size: "1MB",
            lastModified: new Date().toLocaleDateString("pt-BR"),
            type: "file",
          });
          refresh();
          uploadOpen = false;
        }}>Upload</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={createFolderOpen}>
  <Dialog.Trigger />
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Create a new Folder</Dialog.Title>
      <Dialog.Description>
        <div class="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label for="picture">Folder</Label>
          <Input id="picture" type="text" bind:value={folderName} />
        </div>
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button
        variant="destructive"
        on:click={() => {
          createFolderOpen = false;
        }}
      >
        Cancel
      </Button>
      <Button
        on:click={() => {
          createFolder(page, folderName);
          refresh();
          createFolderOpen = false;
        }}>Create</Button
      >
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
