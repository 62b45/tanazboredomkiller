const LETTER_UNLOCK_KEY = 'px_letters_unlocked_token'
const NORMALIZED_SECRET = 'janina'
const SECRET_HINT_KEY = 'px_secret_hint_seen'

export function normalizeSecretInput(value: string) {
  return value
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[^\p{L}]/gu, '')
    .toLowerCase()
}

export function verifySecret(value: string) {
  return normalizeSecretInput(value) === NORMALIZED_SECRET
}

export function hasLettersUnlocked() {
  if (typeof window === 'undefined') {
    return false
  }
  return window.localStorage.getItem(LETTER_UNLOCK_KEY) === '1'
}

export function persistLettersUnlock() {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(LETTER_UNLOCK_KEY, '1')
}

export function rememberSecretHint() {
  if (typeof window === 'undefined') {
    return
  }
  window.sessionStorage.setItem(SECRET_HINT_KEY, '1')
}

export function hasSecretHintBeenShown() {
  if (typeof window === 'undefined') {
    return false
  }
  return window.sessionStorage.getItem(SECRET_HINT_KEY) === '1'
}

export const letterStorageKeys = {
  unlocked: LETTER_UNLOCK_KEY,
  hint: SECRET_HINT_KEY,
}
