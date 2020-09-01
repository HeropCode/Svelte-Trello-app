import { writable } from 'svelte/store'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _remove from 'lodash/remove'
import _cloneDeep from 'lodash/cloneDeep'

const crypto = () => cryptoRandomString({ length: 10 })
const repoLists = JSON.parse(window.localStorage.getItem('lists')) || []

// States
export let lists = writable(repoLists)
lists.subscribe($lists => {
  window.localStorage.setItem('lists', JSON.stringify($lists))
})

// Actions
//// Lists
export const reorderList = payload => {
  // List의 이전 위치와 새 위치를 이용합니다.
  const { oldIndex, newIndex } = payload
  lists.update($lists => {
    // 움직이는 List 데이터를 복제합니다.
    const clone = _cloneDeep($lists[oldIndex])
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
      title,
      cards: []
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
}

//// Cards
export const reorderCard = payload => {
  const {
    fromListId, toListId, oldIndex, newIndex
  } = payload

  lists.update($lists => {
    // 출발한 위치의 List
    const fromList = _find($lists, { id: fromListId })
    // 도착한 위치의 List
    // 출발과 도착 위치가 같으면 _find가 동작하지 않도록 출발 위치 List를 할당
    const toList = fromListId === toListId
      ? fromList
      : _find($lists, { id: toListId })
    // 미리 복사본 생성
    const clone = _cloneDeep(fromList.cards[oldIndex])
    // 이전 위치의 해당 Card를 제거하고,
    fromList.cards.splice(oldIndex, 1)
    // 새 위치에 복제한 Card를 끼워넣습니다.
    toList.cards.splice(newIndex, 0, clone)
    return $lists
  })
}
export const createCard = payload => {
  const { listId, title } = payload
  lists.update($lists => {
    const foundList = _find($lists, { id: listId })
    foundList.cards.push({
      id: crypto(), // Card의 고유 ID
      title // Card 제목
    })
    return $lists
  })
}
export const updateCard = payload => {
  const { listId, cardId, title } = payload
  lists.update($lists => {
    // Card가 포함된 List 찾기
    const foundList = _find($lists, { id: listId })
    // Card 찾기
    const foundCard = _find(foundList.cards, { id: cardId })
    // 데이터 갱신
    foundCard.title = title
    return $lists
  })
}
export const deleteCard = payload => {
  const { listId, cardId } = payload
  lists.update($lists => {
    const foundList = _find($lists, { id: listId })
    _remove(foundList.cards, { id: cardId })
    return $lists
  })
}
