<script lang="ts">
  import Icon from "@iconify/svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import LightSwitch from "./LightSwitch.svelte";
</script>

<div class="w-full border-b">
  <header
    class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-[var(--header-height-mobile)] md:h-[var(--header-height)] flex items-center justify-between"
  >
    <Icon icon="fa6-solid:explosion" class="w-8 h-8" />
    <ul class="flex gap-2">
      <LightSwitch />
      <Avatar.Root>
        <Avatar.Image src="https://github.com/shadcn.png" alt="Avatar" />
        <Avatar.Fallback>U</Avatar.Fallback>
      </Avatar.Root>
    </ul>
  </header>
</div>
