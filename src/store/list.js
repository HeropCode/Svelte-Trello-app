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
//     title: 'Hello World!',
//     order: 0
//   },
//   {
//     id: crypto(),
//     listId: sampleLists[1].id,
//     title: 'Good Job~',
//     order: 0
//   }
// ]

// States
export let lists = writable(repoLists)
export let cards = writable(repoCards)
export let mergedLists = derived(
  // 반응성을 감시할 Store 객체를 여럿 지정할 수 있습니다.
  [lists, cards],
  // 콜백 함수에서 데이터에 접근할 수 있습니다.
  ([$lists, $cards]) => {
    // 변경된 각 데이터를 로컬 스토리지에 저장합니다.
    window.localStorage.setItem('lists', JSON.stringify($lists))
    window.localStorage.setItem('cards', JSON.stringify($cards))

    // 반복하기 쉽게 List와 Card 데이터를 병합해서 반환합니다.
    const newLists = $lists.map(list => ({
      ...list,
      cards: $cards
        // List에 해당하는 Card만 필터하고,
        .filter(card => card.listId === list.id)
        // 순서에 맞게 정렬합니다.
        .sort((a, b) => a.order - b.order)
    }))
    console.log(newLists)
    return newLists
  }
)

// Actions
//// Lists
export const reorderList = payload => {
  // List의 이전 위치와 새 위치를 이용합니다.
  const { oldIndex, newIndex } = payload
  lists.update($lists => {
    // 움직이는 List 데이터를 복제합니다.
    const clone = { ...$lists[oldIndex] }
    // Lists에서 이전 위치의 해당 List를 제거하고,
    $lists.splice(oldIndex, 1)
    // 새 위치에 복제한 List를 끼워넣습니다.
    $lists.splice(newIndex, 0, clone)
    return $lists
  })
}
export const createList = payload => {
  const { title } = payload
  lists.update($lists => {
    // 새로운 List를 끝으로 밀어넣습니다.
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
    // 수정할 List를 찾아서,
    const foundList = _find($lists, { id: listId })
    // title를 갱신합니다.
    foundList.title = title
    return $lists
  })
}
export const deleteList = payload => {
  const { listId } = payload
  lists.update($lists => {
    // List의 id로 데이터에서 해당 List를 삭제합니다.
    _remove($lists, { id: listId })
    return $lists
  })
  cards.update($cards => {
    // 위에서 삭제한 List에 소속된 모든 Card 데이터를 같이 삭제합니다.
    _remove($cards, { listId })
    return $cards
  })
}

//// Cards
export const reorderCard = payload => {
  // SortableJS 특성상 DOM이 먼저 변경되기 때문에,
  // Card가 도착한 List 요소를 같이 받아서 처리합니다.
  const {
    cardId, listId, toListEl
  } = payload

  cards.update($cards => {
    toListEl
      // List 요소가 가진 모든 Card를 찾아서,
      .querySelectorAll('.card')
      // 순서대로 처리합니다.
      .forEach((cardEl, index) => {
        // Card 요소가 가진 id를 추출해서,
        const id = cardEl.dataset.cardId
        // 데이터에서 일치하는 Card를 찾습니다.
        const foundCard = _find($cards, { id })
        // 순서를 갱신하고,
        foundCard.order = index
        // 그 Card가 이동하는 그 Card라면,
        if (foundCard.id === cardId) {
          // 도착한 List의 id로 데이터를 갱신합니다.
          foundCard.listId = listId
        }
      })
    return $cards
  })
}
export const createCard = payload => {
  const { listId, title } = payload
  // 생성하는 Card에 가장 마지막 순서(order)가 들어가도록,
  // DOM에서 사용하는 데이터를 기준으로 List가 가진 카드의 개수를 파악합니다.
  const order = _find(get(mergedLists), { id: listId }).cards.length
  cards.update($cards => {
    $cards.push({
      id: crypto(), // Card의 고유 ID
      listId, // 소속된 List의 고유 ID
      title, // Card 제목
      order // 소속된 List에서의 Card 순서
    })
    return $cards
  })
}
export const updateCard = payload => {
  const { cardId, title } = payload
  cards.update($cards => {
    // 해당 Card를 찾아서,
    const foundCard = _find($cards, { id: cardId })
    // title을 갱신합니다.
    foundCard.title = title
    return $cards
  })
}
export const deleteCard = payload => {
  const { cardId } = payload
  cards.update($cards => {
    // Card의 id로 데이터에서 해당 Card를 삭제합니다.
    _remove($cards, { id: cardId })
    return $cards
  })
}
