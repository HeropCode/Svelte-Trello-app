export function autoFocusout(el, focusoutListener) {
  const focusinListener = (e) => e.stopPropagation()

  setTimeout(() => {
    el.addEventListener('click', focusinListener)
    window.addEventListener('click', focusoutListener)
  })

  return {
    destroy() {
      el.removeEventListener('click', focusinListener)
      window.removeEventListener('click', focusoutListener)
    }
  }
}
