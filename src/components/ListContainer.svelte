<script>
  import { mergedLists } from '~/store/list'
  import List from '~/components/List.svelte'
  import CreateList from '~/components/CreateList.svelte'
</script>

<div class="list-container">
  <div class="list-container__inner">
    {#each $mergedLists as list (list.id)}
      <List {list} />
    {/each}
    <CreateList />
  </div>
</div>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: 100vh;
    background: orange;
    .list-container__inner {
      width: 100%;
      height: 100%;
      padding: 30px;
      box-sizing: border-box;
      white-space: nowrap;
      font-size: 0;
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
</style>
