<script>
  import { tick } from 'svelte'
  import { createList } from '~/store/list'
  import { autoFocusout } from '~/actions/autoFocusout'

  let isEditMode = false
  let title = ''
  let textarea

  function addList() {
    if (title) {
      createList({
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
    event.key === 'Enter' && addList()
    event.key === 'Esc' && offEditMode() // IE/Edge
    event.key === 'Escape' && offEditMode()
  }
</script>

<div class="create-list">
  {#if isEditMode}
    <div use:autoFocusout={offEditMode}
         class="edit-mode">
    <textarea bind:value={title}
              bind:this={textarea}
              on:keypress={keyEvents}
              placeholder="Enter a title for this list..."></textarea>
      <div>
        <span class="btn btn--success"
              on:click={addList}>Add List</span>
        <span class="btn"
              on:click={offEditMode}>Cancel</span>
      </div>
    </div>
  {:else}
    <div class="add-another-list"
         on:click={onEditMode}>
      + Add another list
    </div>
  {/if}
</div>

<style lang="scss">
  .create-list {
    white-space: normal;
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    width: 290px;
    margin: 0 4px;
    background: rgba(#ebecf0, .6);
    border-radius: 4px;
    line-height: 20px;
    cursor: pointer;
    transition: .2s;
    &:hover {
      background: #ebecf0;
    }
  }
  .edit-mode {
    padding: 10px 8px;
  }
  .add-another-list {
    padding: 10px 8px;
  }
</style>
