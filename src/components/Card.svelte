<script>
  import { tick, createEventDispatcher } from 'svelte'
  import { updateCard, deleteCard } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  export let card
  let isEditMode = false
  let title = card.title
  let textarea
  const dispatch = createEventDispatcher()

  function saveCard() {
    // 빈 값이 저장되는 것을 방지.
    if (title) {
      updateCard({
        cardId: card.id,
        title
      })
    }
    offEditMode()
  }
  function removeCard() {
    deleteCard({
      cardId: card.id
    })
  }
  async function onEditMode() {
    isEditMode = true
    dispatch('editMode', true)
    await tick()
    textarea && textarea.focus()
  }
  function offEditMode() {
    title = card.title
    isEditMode = false
    // 수정 모드(edit mode)인 경우 SortableJS가 동작하지 않도록 상태를 올림.
    dispatch('editMode', false)
  }
  function keyEvents(event) {
    console.log(event.key)
    event.key === 'Enter' && saveCard()
    event.key === 'Esc' && offEditMode() // IE/Edge
    event.key === 'Escape' && offEditMode()
  }
</script>

{#if card}
  <div class="card"
       data-card-id={card.id}>
    {#if isEditMode}
      <div use:autoFocusout={offEditMode}
           class="edit-mode">
        <textarea bind:value={title}
                  bind:this={textarea}
                  placeholder="Enter a title for this card..."
                  on:keydown={keyEvents}></textarea>
        <div>
          <span class="btn btn--success"
                on:click={saveCard}>Save</span>
          <span class="btn"
                on:click={offEditMode}>Cancel</span>
          <span class="btn btn--danger"
                on:click={removeCard}>Delete Card</span>
        </div>
      </div>
    {:else}
      <div class="title"
           on:click={onEditMode}>
        {card.title}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .card {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 1px;
    }
    :global(&.sortable-ghost) {
      opacity: 0.1;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        border-radius: 4px;
      }
    }
  }
  .title {
    white-space: normal;
    word-break: break-all;
    position: relative;
    border-radius: 4px;
    cursor: pointer;
    background: #FFF;
    padding: 6px 8px;
    box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
    line-height: 20px;
    user-select: none;
    &:hover {
      background: #F5F5F5;
    }
  }
</style>
