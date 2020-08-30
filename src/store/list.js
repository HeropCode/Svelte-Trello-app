import { writable, derived } from 'svelte/store'
import cryptoRandomString from 'crypto-random-string'

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
//   },
//   {
//     id: crypto(),
//     listId: sampleLists[1].id,
//     title: 'Good Job~'
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
      cards: $cards.filter(card => card.listId === list.id)
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
    const foundList = $lists.find(list => list.id === listId)
    foundList.title = title
    console.log(foundList)
    return $lists
  })
}
export const deleteList = payload => {
  const { listId } = payload
  lists.update($lists => {
    const foundIndex = $lists.findIndex(list => list.id === listId)
    $lists.splice(foundIndex, 1)
    return $lists
  })
}

//// Cards
export const reorderCard = payload => {
  const { cardId, listId } = payload
  cards.update($cards => {
    const foundCard = $cards.find(card => card.id === cardId)
    foundCard.listId = listId
    return $cards
  })
}
export const createCard = payload => {
  const { listId, title } = payload
  cards.update($cards => {
    $cards.push({
      id: crypto(),
      listId,
      title
    })
    return $cards
  })
}
export const updateCard = payload => {
  const { cardId, title } = payload
  cards.update($cards => {
    const foundCard = $cards.find(card => card.id === cardId)
    foundCard.title = title
    return $cards
  })
}
export const deleteCard = payload => {
  const { cardId } = payload
  cards.update($cards => {
    const foundIndex = $cards.findIndex(card => card.id === cardId)
    $cards.splice(foundIndex, 1)
    return $cards
  })
}
