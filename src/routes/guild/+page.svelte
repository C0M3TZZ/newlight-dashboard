<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const guilds = $page.data.guilds;

	let message = null;

	if (guilds.length !== 0) {
		console.log(guilds[0]);
		if (guilds[0] != null) {
			if (browser) {
				goto(`/guild/${guilds[0].id}`);
			}
		} else {
      if (browser) {
        window.location.reload();
      }
		}
	} else {
		message = 'You are not in any server.';
	}
</script>
