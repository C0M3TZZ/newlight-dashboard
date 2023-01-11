<script>
  	import { browser } from '$app/environment';

    /** @type {import('./$types').PageData} */
    export let data;

  	if (!data.user) {
		if (browser) {
			window.location.href = '/';
		}
	}
</script>
<slot></slot>
