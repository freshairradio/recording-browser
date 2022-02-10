<script>
	let results = null;
	let controller = null;

	async function fetchResults(f) {
		if (f.length < 3) {
			return;
		}
		if (controller) {
			controller.abort();
		}
		controller = new AbortController();
		results = null;
		await fetch(`/recordings.json?prefix=${f}`, { signal: controller.signal })
			.then((r) => r.json())
			.then((js) => (results = js));
		controller = null;
	}
	$: console.log(results);
	let filter = '';
	$: fetchResults(filter);
</script>

<input
	type="text"
	name="filter"
	id="filter"
	bind:value={filter}
	class="max-w-4xl mx-auto p-4 shadow-lg mb-8 block w-full sm:text-lg border-gray-300 rounded-2xl"
	placeholder="Filter by date (e.g. 2022-01-02)"
/>
<div class="bg-white shadow overflow-hidden sm:rounded-md max-w-4xl mx-auto">
	{#if filter.length < 3}
		<h2 class="p-4 text-xl text-gray-400 text-center">Type at least 3 characters...</h2>
	{:else if results}
		<ul role="list" class="divide-y divide-gray-200">
			{#each results as file}
				<li>
					<div class="block hover:bg-gray-50">
						<div class="flex items-center px-4 py-4 sm:px-6">
							<div class="min-w-0 flex-1 flex items-center">
								<div class="min-w-0 flex-1  md:grid md:grid-cols-2 md:gap-4">
									<div>
										<p class="text-sm font-medium text-indigo-600 truncate">{file.name}</p>
										<p class="mt-2 flex items-center text-sm text-gray-500">
											<span class="truncate">{file.size}</span>
										</p>
									</div>
								</div>
							</div>
							<a href={file.download} download={file.name}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
							</a>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<h2 class="p-4 text-xl text-gray-400 text-center">Loading...</h2>
	{/if}
</div>
