<script>
  import { onDestroy, tick, createEventDispatcher } from 'svelte'
  import { lists } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  export let list
  let isEditMode = false
  let title = list.title
  let textareaEl
  const dispatch = createEventDispatcher()

  function saveTitle() {
    // 빈 값이 저장되는 것을 방지
    if (title.trim()) {
      lists.edit({
        listId: list.id,
        title
      })
    }
    offEditMode()
  }
  function removeList() {
    lists.remove({
      listId: list.id
    })
    // removeList 함수는 Edit Mode에서 동작하기 때문에,
    // 컴포넌트(요소)가 삭제되면 Edit Mode를 꺼야 SortableJS 기능이 정상 동작할 수 있습니다.
    offEditMode()
  }
  async function onEditMode() {
    isEditMode = true
    title = list.title
    dispatch('editMode', true)
    await tick()
    textareaEl && textareaEl.focus()
  }
  function offEditMode() {
    isEditMode = false
    dispatch('editMode', false)
  }

  onDestroy(() => {
    offEditMode()
  })
</script>

{#if isEditMode}
  <div
    use:autoFocusout={offEditMode}
    class="edit-mode">
      <textarea
        bind:value={title}
        bind:this={textareaEl}
        placeholder="Enter a title for this list..."
        on:keydown={event => {
          event.key === 'Enter' && saveTitle()
          event.key === 'Esc' && offEditMode() // for Edge Browser
          event.key === 'Escape' && offEditMode()
        }}></textarea>
    <div class="actions">
      <div
        class="btn success"
        on:click={saveTitle}>
        Save
      </div>
      <div
        class="btn"
        on:click={offEditMode}>
        Cancel
      </div>
      <div
        class="btn danger"
        on:click={removeList}>
        Delete List
      </div>
    </div>
  </div>
{:else}
  <h2 class="title">
    {list.title}
    <div
      class="btn small edit-btn-for-list"
      on:click={onEditMode}>
      Edit
    </div>
  </h2>
{/if}

<style lang="scss">
  h2.title {
    font-weight: 700;
    padding: 4px 8px;
    cursor: pointer;
    position: relative;
    .btn {
      position: absolute;
      top: 0;
      right: 0;
      display: none;
    }
  }
  :global(.list__inner:hover .edit-btn-for-list) {
    display: block !important;
  }
</style>
