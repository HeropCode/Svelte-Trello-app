<script>
  import { tick, createEventDispatcher } from 'svelte'
  import { updateList, deleteList } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  export let list
  let isEditMode = false
  let title = list.title
  let textareaEl
  const dispatch = createEventDispatcher()

  function saveTitle() {
    // 빈 값이 저장되는 것을 방지
    if (title) {
      updateList({
        listId: list.id,
        title
      })
    }
    offEditMode()
  }
  function removeList() {
    deleteList({
      listId: list.id
    })
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
  function keyEvents(event) {
    console.log(event.key)
    event.key === 'Enter' && saveTitle()
    event.key === 'Esc' && offEditMode() // IE/Edge
    event.key === 'Escape' && offEditMode()
  }
</script>

{#if isEditMode}
  <div use:autoFocusout={offEditMode}
       class="edit-mode">
        <textarea bind:value={title}
                  bind:this={textareaEl}
                  placeholder="Enter a title for this list..."
                  on:keydown={keyEvents}></textarea>
    <div class="actions">
          <span class="btn success"
                on:click={saveTitle}>Save</span>
      <span class="btn"
            on:click={offEditMode}>Cancel</span>
      <span class="btn danger"
            on:click={removeList}>Delete List</span>
    </div>
  </div>
{:else}
  <h2 class="title">
    {list.title}
    <div class="btn small edit-btn-for-list"
         on:click|stopPropagation={onEditMode}>
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
