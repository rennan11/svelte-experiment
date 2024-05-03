<script lang="ts">
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
    type ReadOrWritable,
  } from "svelte-headless-table";
  import { writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DataTableCheckbox from "$lib/components/DataTableCheckbox.svelte";

  import {
    addSelectedRows,
    addSortBy,
    addTableFilter,
  } from "svelte-headless-table/plugins";
  import DataTableName from "$lib/components/DataTableName.svelte";
  import Icon from "@iconify/svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { createEventDispatcher } from "svelte";
  import type { Object } from "../../routes/drive/data";
  import { toast } from "svelte-sonner";

  const dispatch = createEventDispatcher();

  export let data: ReadOrWritable<Array<Object>> = writable([]);

  const table = createTable(data, {
    filter: addTableFilter({
      fn: ({ filterValue, value }) => value.includes(filterValue),
    }),
    sort: addSortBy(),
    select: addSelectedRows(),
  });

  const columns = table.createColumns([
    table.column({
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select;
        return createRender(DataTableCheckbox, {
          checked: allPageRowsSelected,
        });
      },
      accessor: "id",
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);

        return createRender(DataTableCheckbox, {
          checked: isSelected,
        });
      },
      plugins: {
        sort: {
          disable: true,
        },
        filter: {
          exclude: true,
        },
      },
    }),
    table.column({
      accessor: (item) => item,
      header: "Name",
      cell: ({ value }) => {
        return createRender(DataTableName, {
          name: value.name,
          type: value.type,
        });
      },
      plugins: {
        sort: {
          compareFn: (a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          },
        },
      },
    }),
    table.column({
      accessor: "size",
      header: "Size",
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
    table.column({
      accessor: "lastModified",
      header: "Last Modified",
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
    table.column({
      header: "",
      accessor: (item) => item,
      plugins: {
        sort: {
          disable: true,
        },
      },
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    rows,
    pluginStates,
  } = table.createViewModel(columns);

  const { selectedDataIds } = pluginStates.select;
  selectedDataIds.subscribe((value) => {
    dispatch("selected", Object.keys(value));
  });

  export const deselectedAll = () => {
    pluginStates.select.selectedDataIds.set({});
  };
</script>

<svelte:head>
  <title>Drive</title>
  <meta name="description" content="Drive" />
</svelte:head>

<div class="rounded-md border">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        {#key headerRow.id}
          <Subscribe rowAttrs={headerRow.attrs()}>
            <Table.Row>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe
                  attrs={cell.attrs()}
                  let:attrs
                  props={cell.props()}
                  let:props
                >
                  <Table.Head {...attrs}>
                    {#if cell.id === "Name"}
                      <Button variant="ghost" on:click={props.sort.toggle}>
                        <Render of={cell.render()} />
                        {#if props.sort.order === "asc"}
                          <Icon
                            icon="fa6-solid:sort-up"
                            class="ml-2 text-blue-500"
                          />
                        {:else if props.sort.order === "desc"}
                          <Icon
                            icon="fa6-solid:sort-down"
                            class="ml-2 text-blue-500"
                          />
                        {:else}
                          <Icon
                            icon="fa6-solid:sort"
                            class="ml-2 text-blue-500"
                          />
                        {/if}
                      </Button>
                    {:else}
                      <Render of={cell.render()} />
                    {/if}
                  </Table.Head>
                </Subscribe>
              {/each}
            </Table.Row>
          </Subscribe>
        {/key}
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row
            {...rowAttrs}
            data-state={$selectedDataIds[row.id] && "selected"}
          >
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                {#if cell.id === "Name"}
                  <Table.Cell
                    {...attrs}
                    on:click={() => dispatch("folder", row.original)}
                  >
                    <Render of={cell.render()} />
                  </Table.Cell>
                {:else if cell.id === "id"}
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                {:else if cell.id === ""}
                  <Table.Cell {...attrs}>
                    <div class="flex items-center">
                      {#if row.original.type !== "folder"}
                        <Button
                          size="icon"
                          variant="ghost"
                          on:click={() =>
                            toast.success("File Downloaded!", {
                              description:
                                "Your file has been downloaded successfully.",
                            })}
                        >
                          <Icon
                            icon="fa-solid:download"
                            class="text-blue-500"
                          />
                        </Button>
                      {:else}
                        <div class="h-10 w-10"></div>
                      {/if}
                      <Button size="icon" variant="ghost">
                        <Icon icon="fa-solid:edit" class="text-orange-500" />
                      </Button><Button
                        size="icon"
                        variant="ghost"
                        on:click={() => dispatch("delete", row.original)}
                      >
                        <Icon icon="fa-solid:trash" class="text-red-500" />
                      </Button>
                    </div>
                  </Table.Cell>
                {:else}
                  <Table.Cell {...attrs}>
                    <Render of={cell.render()} />
                  </Table.Cell>
                {/if}
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
