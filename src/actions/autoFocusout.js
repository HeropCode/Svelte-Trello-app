export function autoFocusout(el, focusoutListener) {
  // 아래에서(destroy) 제거 가능하도록 이벤트 리스너를 변수(메모리)에 할당합니다.
  const focusinListener = (e) => e.stopPropagation()

  // Svelte Action은 DOM이 생성될 때 호출되기 때문에,
  // EditMode로 전환하기 위한 버튼 click도 전역 이벤트로 읽힙니다.
  // Timeout을 통해 호출 스택이 비워지면(실행 지연, DOM이 그려진 후) 실행되도록 합니다.
  // delay 인수는 기본 값이 `0` 입니다.
  setTimeout(() => {
    el.addEventListener('click', focusinListener)
    window.addEventListener('click', focusoutListener)
  })

  return {
    // Svelte Action에서 destroy 메소드로 반환하면,
    // 해당 요소가 연결 해제될 때 실행되며,
    // 이 곳에서 이벤트 리스너를 제거합니다.
    destroy() {
      el.removeEventListener('click', focusinListener)
      window.removeEventListener('click', focusoutListener)
    }
  }
}
