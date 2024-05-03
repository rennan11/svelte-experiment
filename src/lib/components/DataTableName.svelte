<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  export let type: string;
  export let name: string;
</script>

{#if type === "folder"}
  <Button size="sm" variant="link" class="text-blue-500">
    {name}
  </Button>
{:else}
  <div class="px-3">{name}</div>
{/if}
