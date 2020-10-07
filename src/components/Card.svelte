<script>
  import { onDestroy, tick, createEventDispatcher } from 'svelte'
  import { cards } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  export let listId
  export let card

  let isEditMode = false
  let title
  let textareaEl
  const dispatch = createEventDispatcher()

  function saveCard() {
    // 빈 값이 저장되는 것을 방지.
    if (title.trim()) {
      cards.edit({
        listId,
        cardId: card.id,
        title
      })
    }
    offEditMode()
  }
  function removeCard() {
    cards.remove({
      listId,
      cardId: card.id
    })
    // removeCard 함수는 Edit Mode에서 동작하기 때문에,
    // 컴포넌트(요소)가 삭제되면 Edit Mode를 꺼야 SortableJS 기능이 정상 동작할 수 있습니다.
    offEditMode()
  }
  async function onEditMode() {
    isEditMode = true
    title = card.title
    // 수정 모드(edit mode)인 경우 SortableJS가 동작하지 않도록 상태를 올림.
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

<div
  class="card"
  data-card-id={card.id}>
  {#if isEditMode}
    <div
      use:autoFocusout={offEditMode}
      class="edit-mode">
        <textarea
          bind:value={title}
          bind:this={textareaEl}
          placeholder="Enter a title for this card..."
          on:keydown={event => {
            console.log(event.key)
            event.key === 'Enter' && saveCard()
            event.key === 'Esc' && offEditMode() // for Edge Browser
            event.key === 'Escape' && offEditMode()
          }}></textarea>
      <div class="actions">
        <div
          class="btn success"
          on:click={saveCard}>
          Save
        </div>
        <div
          class="btn"
          on:click={offEditMode}>
          Cancel
        </div>
        <div
          class="btn danger"
          on:click={removeCard}>
          Delete Card
        </div>
      </div>
    </div>
  {:else}
    <div class="title">
      {card.title}
      <div
        class="btn small"
        on:click={onEditMode}>
        Edit
      </div>
    </div>
  {/if}
</div>

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
    :global(&.sortable-chosen) {
      cursor: move;
    }
  }
  .title {
    position: relative;
    border-radius: 4px;
    background: #FFF;
    padding: 6px 8px;
    box-shadow: 0 1px 0 rgba(9, 30, 66, .25);
    line-height: 20px;
    user-select: none;
    &:hover {
      background: #F5F5F5;
    }
    .btn {
      position: absolute;
      top: 6px;
      right: 8px;
      display: none;
    }
    &:hover .btn {
      display: block;
    }
  }
</style>
