<script>
  import { onMount } from 'svelte'
  import Sortable from 'sortablejs'

  import { reorderCard } from '~/store/list'
  import Card from './Card.svelte'
  import CreateCard from './CreateCard.svelte'

  export let list
  let cardGroup
  let listEl
  let sortable

  async function cardSortHandler(event) {
    console.log(event)
    reorderCard({
      cardId: event.item.dataset.cardId,
      listId: event.to.dataset.listId
    })
  }

  function toggleSortable(event) {
    console.log(event.detail)
    sortable.option('disabled', event.detail)
  }

  onMount(() => {
    sortable = new Sortable(listEl, {
      group: 'My Cards',
      handle: '.card',
      delay: 50,
      animation: 0,
      forceFallback: true,
      onEnd: cardSortHandler
    })
  })
</script>

{#if list}
  <div class="list">
    <div class="list-wrapper">
      <div class="list__heading">
        <h1>{list.title}</h1>
        <p>{list.cards.length} cards</p>
      </div>
      <div data-list-id={list.id}
           bind:this={listEl}
           class="list__cards">
        {#each list.cards as card (card.id)}
          <Card {card}
                on:editMode={toggleSortable} />
        {/each}
      </div>
      <CreateCard listId={list.id} />
    </div>
  </div>
{/if}

<style lang="scss">
  .list {
    display: inline-block;
    vertical-align: top;
    font-size: 16px;
    line-height: 20px;
    width: 290px;
    height: 100%;
    margin: 0 4px;
    .list-wrapper {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      box-sizing: border-box;
      padding: 10px 8px;
      background: #ebecf0;
      border-radius: 4px;
      .list__heading {
        margin-bottom: 10px;
        h1 {
          font-weight: 700;
          padding: 4px 8px;
        }
        p {
          color: #5E6C84;
          padding: 0 8px;
        }
      }
      .list__cards {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
        margin-bottom: 10px;
      }
    }
  }
</style>
