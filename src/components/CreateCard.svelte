<script>
  import { tick, createEventDispatcher } from 'svelte'
  import { cards } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  export let listId

  let isEditMode = false
  let title = ''
  let textareaEl
  const dispatch = createEventDispatcher()

  function addCard() {
    // 입력된 title이 있는 경우만 실행.
    if (title.trim()) {
      cards.add({
        listId,
        title
      })
    }
    offEditMode()
  }
  async function onEditMode() {
    isEditMode = true
    title = ''
    // 수정 모드(edit mode)인 경우 SortableJS가 동작하지 않도록 상태를 올림.
    dispatch('editMode', true)
    await tick()
    textareaEl && textareaEl.focus()
  }
  function offEditMode() {
    isEditMode = false
    dispatch('editMode', false)
  }
</script>

{#if isEditMode}
  <div
    use:autoFocusout={offEditMode}
    class="edit-mode">
    <textarea
      bind:value={title}
      bind:this={textareaEl}
      placeholder="Enter a title for this card..."
      on:keydown={event => {
        event.key === 'Enter' && addCard()
        event.key === 'Esc' && offEditMode() // for Edge Browser
        event.key === 'Escape' && offEditMode()
      }}></textarea>
    <div class="actions">
      <div
        class="btn success"
        on:click={addCard}>
        Add Card
      </div>
      <div
        class="btn"
        on:click={offEditMode}>
        Cancel
      </div>
    </div>
  </div>
{:else}
  <div
    class="add-another-card"
    on:click={onEditMode}>
    + Add another card
  </div>
{/if}

<style lang="scss">
  .add-another-card {
    padding: 4px 8px;
    font-size: 14px;
    color: #5E6C84;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background: rgba(9, 30, 66, 0.08);
      color: #172B4D;
    }
  }
</style>
