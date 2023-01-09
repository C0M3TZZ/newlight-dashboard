<script>
	import { Button } from 'flowbite-svelte';
</script>

<Button on:click={async () => {
  await fetch('/api/guild')
}}>Click me.</Button>
