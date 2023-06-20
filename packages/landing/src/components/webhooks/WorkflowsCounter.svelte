<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    
    let interval;
    let workflowsCount = "Loading...";

    function updateWorkflowsCount() {
        fetch("https://workflows.odzi.dog/api/v1/namespaces/default/workflows/count")
            .then((response) => response.json())
            .then((body) => {
                if (body.count) {
                    workflowsCount = body.count;
                };
            })
    };

    onMount(() => {
        updateWorkflowsCount();

        interval = setInterval(() => {
            updateWorkflowsCount();
        }, 2000);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<p class="text-4xl text-black font-bold">{ workflowsCount }</p>