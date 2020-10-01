<script>
  import { onMount } from 'svelte'
  import Sortable from 'sortablejs'

  import { lists } from '~/store/list'
  import List from '~/components/List.svelte'
  import CreateList from '~/components/CreateList.svelte'

  let listsEl // SortableJS에서 사용할 List 목록 요소를 지정합니다.
  let sortableLists // List 정렬를 위한 SortableJS 인스턴스를 지정합니다.

  // lists 스토어의 값($lists)이 변경되면 아래 반응성 구문이 실행됩니다.
  $: {
    console.log($lists)
  }

  onMount(() => {
    sortableLists = new Sortable(listsEl, {
      // 아래 옵션에 대한 자세한 설명은 List 컴포넌트를 참고하세요.
      group: 'My Lists',
      handle: '.list',
      delay: 20,
      animation: 0,
      forceFallback: true,
      onEnd(event) {
        lists.reorder({
          oldIndex: event.oldIndex,
          newIndex: event.newIndex
        })
      }
    })
  })
</script>

<div class="list-container">
  <div bind:this={listsEl}
       class="lists">
    {#each $lists as list (list.id)}
      <List {list}
            {sortableLists} />
    {/each}
  </div>
  <CreateList />
</div>

<style lang="scss">
  .list-container {
    width: 100vw;
    height: calc(100vh - 40px);
    padding: 30px;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    // List를 수평 정렬시키기 위해서 사용합니다.
    white-space: nowrap;
    // inline-block의 띄어쓰기 공간을 초기화하기 위해 사용합니다.
    font-size: 0;
    .lists {
      display: inline-block;
      height: 100%;
      // List를 수평 정렬시키기 위해서 사용합니다.
      white-space: nowrap;
      // inline-block의 띄어쓰기 공간을 초기화하기 위해 사용합니다.
      font-size: 0;
    }
  }
</style>
