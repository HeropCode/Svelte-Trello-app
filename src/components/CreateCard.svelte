<script>
  import { tick } from 'svelte'
  import { createCard } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  export let listId
  let isEditMode = false
  let title = ''
  let textarea

  function addCard() {
    // 입력된 title이 있는 경우만 실행.
    if (title) {
      createCard({
        listId,
        title
      })
    }
    offEditMode()
  }
  async function onEditMode() {
    isEditMode = true
    await tick()
    textarea && textarea.focus()
  }
  function offEditMode() {
    title = ''
    isEditMode = false
  }
  function keyEvents(event) {
    event.key === 'Enter' && addCard()
    event.key === 'Esc' && offEditMode() // IE/Edge
    event.key === 'Escape' && offEditMode()
  }
</script>

{#if isEditMode}
  <div use:autoFocusout={offEditMode}
       class="edit-mode">
    <textarea bind:value={title}
              bind:this={textarea}
              on:keypress={keyEvents}
              placeholder="Enter a title for this card..."></textarea>
    <div class="actions">
      <span class="btn btn--success"
            on:click={addCard}>Add Card</span>
      <span class="btn"
            on:click={offEditMode}>Cancel</span>
    </div>
  </div>
{:else}
  <div class="add-another-card"
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
