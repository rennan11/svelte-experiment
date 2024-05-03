<script>
  import "../app.css";
  import Topbar from "$lib/components/Topbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import SideMenu from "$lib/components/SideMenu.svelte";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner";
</script>

<Toaster />
<ModeWatcher />
<div class="app">
  <Topbar />
  <div class="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex">
    <SideMenu />
    <div
      class="pt-4 px-2 w-full h-[calc(100vh-var(--header-height)-var(--footer-height))]"
    >
      <slot />
    </div>
  </div>
  <Footer />
</div>
