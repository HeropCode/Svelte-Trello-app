import { writable, derived, get } from 'svelte/store'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _remove from 'lodash/remove'

const crypto = () => cryptoRandomString({ length: 10 })
const repoLists = JSON.parse(window.localStorage.getItem('lists')) || []
const repoCards = JSON.parse(window.localStorage.getItem('cards')) || []
// const sampleLists = [
//   {
//     id: crypto(),
//     title: 'First List.'
//   },
//   {
//     id: crypto(),
//     title: 'Second List.'
//   }
// ]
// const sampleCards = [
//   {
//     id: crypto(),
//     listId: sampleLists[0].id,
//     title: 'Hello World!'
//     order: 0
//   },
//   {
//     id: crypto(),
//     listId: sampleLists[1].id,
//     title: 'Good Job~'
//     order: 0
//   }
// ]

// States
export let lists = writable(repoLists)
export let cards = writable(repoCards)
export let mergedLists = derived(
  [lists, cards],
  ([$lists, $cards]) => {
    // 변경된 각 데이터를 로컬 스토리지에 저장.
    window.localStorage.setItem('lists', JSON.stringify($lists))
    window.localStorage.setItem('cards', JSON.stringify($cards))

    const newLists = $lists.map(list => ({
      ...list,
      cards: $cards
        .filter(card => card.listId === list.id)
        .sort((a, b) => a.order - b.order)
    }))
    console.log(newLists)
    return newLists
  }
)

// Actions
//// Lists
export const reorderList = payload => {
  const { oldIndex, newIndex } = payload
  lists.update($lists => {
    const clone = { ...$lists[oldIndex] }
    $lists.splice(oldIndex, 1)
    $lists.splice(newIndex, 0, clone)
    return $lists
  })
}
export const createList = payload => {
  const { title } = payload
  lists.update($lists => {
    $lists.push({
      id: crypto(),
      title
    })
    return $lists
  })
}
export const updateList = payload => {
  const { listId, title } = payload
  lists.update($lists => {
    const foundList = _find($lists, { id: listId })
    foundList.title = title
    console.log(foundList)
    return $lists
  })
}
export const deleteList = payload => {
  const { listId } = payload
  lists.update($lists => {
    _remove($lists, { id: listId })
    return $lists
  })
  cards.update($cards => {
    _remove($cards, { listId })
    return $cards
  })
}

//// Cards
export const reorderCard = payload => {
  const {
    cardId, fromListId, toListId, oldIndex, newIndex
  } = payload
  cards.update($cards => {
    $cards.forEach(card => {
      // 같은 List에서 Card가 움직일 때,
      if (fromListId === toListId) {
        // 해당 List의 Card이고,
        // 도착한 위치 이후의 Card이고,
        // 움직이는 그 Card 빼고.
        if (
          card.listId === toListId
          && card.order >= newIndex
          && card.id !== cardId
        ) {
          // 하나씩 뒤로 밀어!
          card.order += 1
        }

      // 한 List에서 다른 List로 Card가 움직일 때,
      } else {
        // 출발한 List의 Card이고,
        // 출발한 순서 초과의 Card일 때.
        // (초과(`> oldIndex`): 움직이는 Card는 포함하지 않기 위함)
        if (card.listId === fromListId && card.order > oldIndex) {
          // 하나씩 앞으로 땡겨!
          card.order -= 1
        }
        // 도착한 List의 Card이고,
        // 도착한 순서 이후의 Card일 때.
        // (이후(`>= newIndex`): 도착한 위치의 Card를 포함하기 위함)
        else if (card.listId === toListId && card.order >= newIndex) {
          // 하나씩 뒤로 밀어!
          card.order += 1
        }
      }
    })
    const foundCard = _find($cards, { id: cardId })
    foundCard.listId = toListId
    foundCard.order = newIndex
    return $cards
  })
}
export const createCard = payload => {
  const { listId, title } = payload
  const order = _find(get(mergedLists), { id: listId }).cards.length
  cards.update($cards => {
    $cards.push({
      id: crypto(),
      listId,
      title,
      order
    })
    return $cards
  })
}
export const updateCard = payload => {
  const { cardId, title } = payload
  cards.update($cards => {
    const foundCard = _find($cards, { id: cardId })
    foundCard.title = title
    return $cards
  })
}
export const deleteCard = payload => {
  const { cardId } = payload
  cards.update($cards => {
    _remove($cards, { id: cardId })
    return $cards
  })
}
