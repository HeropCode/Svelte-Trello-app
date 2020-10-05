<script>
  import { tick } from 'svelte'
  import { lists } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  let isEditMode = false
  let title = ''
  let textareaEl

  function addList() {
    if (title.trim()) {
      lists.add({
        title
      })
    }
    offEditMode()
  }
  async function onEditMode() {
    isEditMode = true
    await tick()
    textareaEl && textareaEl.focus()
  }
  function offEditMode() {
    title = ''
    isEditMode = false
  }
</script>

<div class="create-list">
  {#if isEditMode}
    <div
      use:autoFocusout={offEditMode}
      class="edit-mode">
    <textarea
      bind:value={title}
      bind:this={textareaEl}
      placeholder="Enter a title for this list..."
      on:keydown={event => {
        event.key === 'Enter' && addList()
        event.key === 'Esc' && offEditMode() // for Edge Browser
        event.key === 'Escape' && offEditMode()
      }}></textarea>
      <div class="actions">
        <div
          class="btn success"
          on:click={addList}>
          Add List
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
      class="add-another-list"
      on:click={onEditMode}>
      + Add another list
    </div>
  {/if}
</div>

<style lang="scss">
  .create-list {
    // .list와 같은 이유로 초기화 합니다.
    white-space: normal;
    font-size: 16px;
    display: inline-block;
    vertical-align: top;
    width: 290px;
    margin: 0 4px;
    padding: 10px 8px;
    // rgba() 함수는 인수로 Red, Green, Blue, Opacity를 순서대로 받아야 하지만,
    // SCSS에서 제공하는 같은 이름의 rgba()가 있으며,
    // 이 함수는 Color, Opacity만 있으면 동작하기 때문에 Hex(hexadecimal) Color 사용시 아주 편리합니다.
    background: rgba(#ebecf0, .6);
    border-radius: 4px;
    line-height: 20px;
    cursor: pointer;
    transition: .2s;
    &:hover {
      background: #ebecf0;
    }
  }
</style>
