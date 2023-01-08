<script>
	import { slide } from 'svelte/transition';
	import { Toast } from 'flowbite-svelte';
	import { toasts, addToast } from '$lib/toastManager.js';
	import Icon from '@iconify/svelte';

	const toastType = {
		success: {
			color: 'green',
			icon: 'line-md:confirm'
		},
		error: {
			color: 'red',
			icon: 'line-md:alert-circle'
		},
		info: {
			color: 'blue',
			icon: 'line-md:question-circle'
		},
		warning: {
			color: 'yellow',
			icon: 'line-md:alert'
		}
	};
</script>

<center class="fixed z-50 right-1/2 translate-x-1/2 mt-4 flex gap-2 flex-col">
	{#each $toasts as toast, index}
		<Toast color={toastType[toast.type].color} transition={slide} bind:open={toast.show}>
			<svelte:fragment slot="icon" >
				<Icon icon={toastType[toast.type].icon} class="text-xl" />
			</svelte:fragment>
			{toast.message}
		</Toast>
	{/each}
</center>
