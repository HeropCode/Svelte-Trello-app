import { writable } from 'svelte/store'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _remove from 'lodash/remove'
import _cloneDeep from 'lodash/cloneDeep'

// ----- 이 부분은 학습하시는 분들은 필요치 않은 코드입니다. -----
window.localStorage.getItem('cards') && window.localStorage.clear()
// ----- 이 부분은 학습하시는 분들은 필요치 않은 코드입니다. -----

// 10글자 고유(랜덤) 문자열을 생성하는 함수를 만듭니다.
const crypto = () => cryptoRandomString({ length: 10 })
// 브라우저의 로컬 스토리지(저장소)에서 `lists` 이름으로 저장된 데이터를 가져옵니다.
// 데이터가 없으면 빈 배열을 할당합니다.(코드 끝에 `|| []`)
const repoLists = JSON.parse(window.localStorage.getItem('lists')) || []

// For internal use.
// 이 자바스크립트 파일 내부에서 사용하는 쓰기 가능한 스토어를 생성합니다.
const _lists = writable(repoLists)
// 스토어를 구독해서 값이 바뀌면,
// 브라우저의 로컬 스토리지에 `lists` 이름으로 데이터를 저장(갱신)합니다.
_lists.subscribe($lists => {
  window.localStorage.setItem('lists', JSON.stringify($lists))
})

// For external use.
// Lists
// 커스텀 스토어를 생성합니다.
// 커스텀 스토어는 자동 구독(Auto Subscription)이 가능하도록 최소한 스토어의 `subscribe` 메소드를 필수로 포함해야 합니다!
// 스토어의 `set`, `update` 메소드는 선택사항입니다.
export let lists = {
  // 스토어 자동 구독을 위해 필요합니다!
  subscribe: _lists.subscribe,
  reorder(payload) {
    // List의 이전 위치와 새 위치를 이용합니다.
    const { oldIndex, newIndex } = payload
    _lists.update($lists => {
      // 사용자가 움직이는(드래그하는) 그 List를 복제합니다.
      const clone = _cloneDeep($lists[oldIndex])
      // Lists에서 이전 위치의 해당 List를 제거하고,
      $lists.splice(oldIndex, 1)
      // 새 위치에 복제한 List를 끼워넣습니다.
      $lists.splice(newIndex, 0, clone)
      // 스토어(`_lists`)에 반영!
      return $lists
    })
  },
  add(payload) {
    const { title } = payload
    _lists.update($lists => {
      // 새로운 List 객체를 배열 끝으로 밀어 넣습니다.
      $lists.push({
        id: crypto(),
        title,
        cards: []
      })
      // 스토어(_lists)에 반영!
      return $lists
    })
  },
  edit(payload) {
    const { listId, title } = payload
    _lists.update($lists => {
      // `id`로 수정할 List를 찾아서,
      const foundList = _find($lists, { id: listId })
      // `title`을 갱신합니다.
      foundList.title = title
      // 스토어(_lists)에 반영!
      return $lists
    })
  },
  remove(payload) {
    const { listId } = payload
    _lists.update($lists => {
      // `id`로 해당 List를 찾아서 삭제합니다.
      _remove($lists, { id: listId })
      // 스토어(_lists)에 반영!
      return $lists
    })
  }
}

// Cards
// `cards`를 `subscribe` 메소드가 없기 때문에 커스텀 스토어라고 부를 수 없습니다.
// 단지, 외부에서 사용하는 여러 메소드가 포함된 단순 객체입니다.
export const cards = {
  reorder(payload) {
    const {
      fromListId, toListId, oldIndex, newIndex
    } = payload
    _lists.update($lists => {
      // 출발한 위치의 List를 찾습니다.
      const fromList = _find($lists, { id: fromListId })
      // 도착한 위치의 List를 찾되,
      // 만약에 출발 위치와 도착 위치가 같으면,
      // `_find`가 동작할 필요없이(추가로 찾을 필요없이),
      // 위에서 찾아 놓은 출발 위치 List를 할당합니다.(그 List가 그 List이니까요!)
      const toList = fromListId === toListId
        ? fromList
        : _find($lists, { id: toListId })
      // Card 복사본을 생성합니다.
      const clone = _cloneDeep(fromList.cards[oldIndex])
      // 이전 위치의 해당 Card를 제거하고,
      fromList.cards.splice(oldIndex, 1)
      // 새 위치에 복사한 Card를 끼워넣습니다.
      toList.cards.splice(newIndex, 0, clone)
      // 스토어(_lists)에 반영!
      return $lists
    })
  },
  add(payload) {
    const { listId, title } = payload
    _lists.update($lists => {
      // 해당 Card가 포함된 List 찾습니다.
      const foundList = _find($lists, { id: listId })
      // 찾은 List에 새로운 카드를 생성해서 밀어 넣습니다.
      foundList.cards.push({
        id: crypto(), // Card의 고유 ID
        title // Card 제목
      })
      // 스토어(_lists)에 반영!
      return $lists
    })
  },
  edit(payload) {
    const { listId, cardId, title } = payload
    _lists.update($lists => {
      // 해당 Card가 포함된 List 찾습니다.
      const foundList = _find($lists, { id: listId })
      // 찾은 List에서 해당 Card를 찾습니다.
      const foundCard = _find(foundList.cards, { id: cardId })
      // 데이터를 갱신합니다.
      foundCard.title = title
      // 스토어(_lists)에 반영!
      return $lists
    })
  },
  remove(payload) {
    const { listId, cardId } = payload
    _lists.update($lists => {
      // 해당 Card가 포함된 List 찾습니다.
      const foundList = _find($lists, { id: listId })
      // 찾은 List에서 Card를 삭제합니다.
      _remove(foundList.cards, { id: cardId })
      // 스토어(_lists)에 반영!
      return $lists
    })
  }
}
