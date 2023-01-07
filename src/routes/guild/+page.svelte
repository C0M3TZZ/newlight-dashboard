<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const guilds = $page.data.guilds;
	const user = $page.data.user;

	let message = null;

	if (guilds.length !== 0) {
		console.log(guilds[0]);
		if (guilds[0] != null) {
			if (browser) {
				goto(`/guild/${guilds[0].id}`);
			}
		} else {
      if (browser) {
				if (user) {
					window.location.reload();
				} else {
					goto('/');
				}
      }
		}
	} else {
		message = 'You are not in any server.';
	}
</script>
