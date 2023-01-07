<script>
  import { createPicker } from 'picmo';
	import { createEventDispatcher, onMount } from 'svelte';
  let element;

  const dispatch = createEventDispatcher();

  onMount(async () => {
    const picker = createPicker({
      rootElement: element,
      emojisPerRow: 6,
      theme: 'auto'
    });

    picker.addEventListener('emoji:select', (selection) => {
      dispatch('emojiSelect', selection);
    });
  });
</script>

<div bind:this={element}>
  
</div>

