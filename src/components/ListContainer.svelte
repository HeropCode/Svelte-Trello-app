<script>
  import { onMount } from 'svelte'
  import Sortable from 'sortablejs'

  import { mergedLists, reorderList } from '~/store/list'
  import List from '~/components/List.svelte'
  import CreateList from '~/components/CreateList.svelte'

  let listsEl // SortableJS에서 사용할 List 목록 요소를 지정합니다.
  let sortableLists // List 정렬를 위한 SortableJS 인스턴스를 지정합니다.

  function listSortHandler(event) {
    console.log(event)
    reorderList({
      oldIndex: event.oldIndex,
      newIndex: event.newIndex
    })
  }

  onMount(() => {
    sortableLists = new Sortable(listsEl, {
      // 아래 옵션에 대한 자세한 설명은 List 컴포넌트를 참고하세요.
      group: 'My Lists',
      handle: '.list',
      draggable: '.list', // CreateList 컴포넌트는 정렬되면 안되기 때문에, 정렬 가능한 요소의 선택자를 지정합니다.
      delay: 30,
      animation: 0,
      forceFallback: true,
      onEnd: listSortHandler
    })
  })
</script>

<div class="list-container">
  <div bind:this={listsEl}
       class="lists">
    {#each $mergedLists as list (list.id)}
      <!-- List 컴포넌트 내부에서 sortableLists가 변경되기 때문에 bind로 연결합니다. -->
      <List {list}
            bind:sortableLists={sortableLists} />
    {/each}
    <CreateList />
  </div>
</div>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: 100vh;
    background: orange;
    .lists {
      width: 100%;
      height: 100%;
      padding: 30px;
      box-sizing: border-box;
      // List를 수평 정렬시키기 위해서 사용합니다.
      white-space: nowrap;
      // inline-block의 띄어쓰기 공간을 초기화하기 위해 사용합니다.
      font-size: 0;
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
</style>
