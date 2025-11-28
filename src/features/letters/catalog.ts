export type LetterDefinition = {
  id: string
  title: string
  emoji: string
  tone: 'soft' | 'playful' | 'nostalgic' | 'dreamy' | 'calm' | 'warm' | 'romantic' | 'tender' | 'joyful'
  encodedBody: string
}

const decoderCache = new Map<string, string>()

export const letterCatalog: LetterDefinition[] = [
  {
    id: 'dawn-dispatch',
    title: 'Dawn Dispatch',
    emoji: '🌅',
    tone: 'soft',
    encodedBody:
      'SSB3b2tlIHVwIGJlZm9yZSBzdW5yaXNlIGJlY2F1c2UgSSB3YW50ZWQgdG8gd3JpdGUgdGhpcyB3aGlsZSB0aGUgY2l0eSB3YXMgc3RpbGwgcXVpZXQuIFRoZSB3aW5kb3dzIHdlcmUgZm9nZ2VkLCB0aGUga2V0dGxlIGhhZG4ndCBldmVuIHRob3VnaHQgYWJvdXQgc2luZ2luZyB5ZXQsIGFuZCBzb21laG93IHRoZSBodXNoIG1hZGUgbWUgcmVtZW1iZXIgeW91ciBzbGVlcHkgbGF1Z2guIEkgY2FuJ3QgcHJvbWlzZSBldmVyeSBkYXkgd2lsbCBiZSB0aGlzIGdlbnRsZSwgYnV0IEkgY2FuIHByb21pc2UgSSdtIGxlYXJuaW5nIGhvdyB0byBrZWVwIHBvY2tldHMgb2YgcXVpZXQganVzdCBmb3IgdXMu',
  },
  {
    id: 'mint-postcard',
    title: 'Mint Postcard',
    emoji: '🌿',
    tone: 'playful',
    encodedBody:
      'VG9kYXkgd2FzIGFsbCBlcnJhbmRzIGFuZCBzdWJ3YXlzIGFuZCBuZW9uIGdyb2NlcnkgY2FydHMsIHlldCBldmVyeSB0aW1lIEkgcGFzc2VkIGEgbWludCBwbGFudCBJIHRob3VnaHQgb2YgaG93IHlvdSBwaW5jaCB0aGUgbGVhdmVzIGFuZCBtYWtlIHRoZSB3aG9sZSByb29tIHNtZWxsIGhvcGVmdWwuIEkgYm91Z2h0IGEgdGlueSBzcHJpZyBmb3IgdGhlIGtpdGNoZW4gc2lsbDsgd2UnbGwgdHJ5IHRvIGtlZXAgaXQgYWxpdmUgdG9nZXRoZXIgbGlrZSB0aGUgcGF0aWVudCBnYXJkZW5lcnMgd2UgcHJldGVuZCB0byBiZS4=',
  },
  {
    id: 'rooftop-anthem',
    title: 'Rooftop Anthem',
    emoji: '🎶',
    tone: 'nostalgic',
    encodedBody:
      'RG8geW91IHJlbWVtYmVyIHRoZSBiYWQga2FyYW9rZSBzcGVha2VyIHdlIGRyYWdnZWQgb250byB0aGUgYnVpbGRpbmcgbGFzdCBmYWxsPyBJIGZvdW5kIHRoZSBwbGF5bGlzdCBhbmQgbGF1Z2hlZCBhdCBob3cgbWFueSBiYWxsYWRzIHdlIHRyaWVkIHRvIGhhcm1vbml6ZS4gTmV4dCB3YXJtIG5pZ2h0LCBsZXQncyBkcmFnIG91dCBiZXR0ZXIgc3BlYWtlcnMgYW5kIGdpdmUgdGhlIG1vb24gYSBwcml2YXRlIGVuY29yZS4=',
  },
  {
    id: 'pillow-treaty',
    title: 'Pillow Treaty',
    emoji: '🛏️',
    tone: 'soft',
    encodedBody:
      'V2Uga2VlcCBzdGVhbGluZyB0aGUgb3RoZXIncyBwaWxsb3cgYW5kIGNhbGxpbmcgaXQgdHJ1Y2UgYWZ0ZXIgYnJlYWtmYXN0LiBDb25zaWRlciB0aGlzIGxldHRlciBhbiBvZmZpY2lhbCB0cmVhdHk6IHRvbmlnaHQgd2Ugc3RhY2sgZXZlcnkgY3VzaGlvbiBpbnRvIGEgZm9ydCBhbmQgZmFsbCBhc2xlZXAgaGFsZndheSB0aHJvdWdoIGJ1aWxkaW5nIGl0Lg==',
  },
  {
    id: 'story-lantern',
    title: 'Story Lantern',
    emoji: '🏮',
    tone: 'dreamy',
    encodedBody:
      'WW91ciBzdG9yaWVzIGFsd2F5cyBzdGFydCB3aXRoIHNtYWxsIGRldGFpbHMgbGlrZSB0cmFpbiBzdGlja2VycyBhbmQgbWlzbWF0Y2hlZCBzb2NrcywgYW5kIGJ5IHRoZSB0aW1lIHlvdSdyZSBkb25lIEknbSBibGlua2luZyBiYWNrIHRlYXJzIGFuZCBkZWNpZGluZyB3ZSBzaG91bGQgbW92ZSB0byBhIGRpZmZlcmVudCBnYWxheHkuIFRoYW5rIHlvdSBmb3IgbWFraW5nIHRoZSBvcmRpbmFyeSBzaGltbWVyLg==',
  },
  {
    id: 'harbor-memo',
    title: 'Harbor Memo',
    emoji: '⚓',
    tone: 'calm',
    encodedBody:
      'T24gdGhlIGZlcnJ5IHRvZGF5IHRoZSB3YXRlciB3YXMgbG91ZCBlbm91Z2ggdG8gZHJvd24gdGhlIHBvZGNhc3RzLCBzbyBJIGp1c3Qgd2F0Y2hlZCB0aGUgc2hvcmVsaW5lIGZsaWNrZXIgYW5kIHJlcGxheWVkIG91ciBsYXN0IGhhcmJvciB3YWxrLiBJIHN3ZWFyIHlvdXIgbGF1Z2ggdHJhdmVscyBiZXR0ZXIgb3ZlciB3YXRlciB0aGFuIGFueSBzaWduYWwu',
  },
  {
    id: 'neon-toast',
    title: 'Neon Toast',
    emoji: '🍞',
    tone: 'playful',
    encodedBody:
      'V2UgYnVybmVkIHRoZSBnYXJsaWMgYnJlYWQgYWdhaW4gYnV0IHRoZSBraXRjaGVuIHNtZWxsZWQgbGlrZSB0cml1bXBoIGFueXdheS4gTWF5YmUgdGhlIHRyaWNrIGlzIHRoYXQgd2Uga2VlcCBzaG93aW5nIHVwIHRvIG1ha2UgZGlubmVyIGV2ZW4gd2hlbiB3ZSBrbm93IHdlJ2xsIG1lc3MgdXAgdGhlIHRpbWluZy4gQ2hlZXJzIHRvIG5lb24gcGluayB0b2FzdHMgYW5kIGNoYW90aWMgYXByb25zLg==',
  },
  {
    id: 'cider-ledger',
    title: 'Cider Ledger',
    emoji: '🍎',
    tone: 'warm',
    encodedBody:
      'SSB0YWxsaWVkIHVwIHRoZSB0aW55IHRoaW5ncyB0aGF0IG1hZGUgdG9kYXkgYmV0dGVyOiB0aGUgZXh0cmEgY2lubmFtb24gaW4geW91ciBjb2ZmZWUsIHRoZSBzaGFyZWQgdW1icmVsbGEsIHRoZSBjb25jZXJ0IHRpY2tldHMgd2UgZmluYWxseSBib29rZWQuIFR1cm5zIG91dCB0aGUgbGVkZ2VyIGlzIHBlcm1hbmVudGx5IHVuYmFsYW5jZWQgaW4gb3VyIGZhdm9yLg==',
  },
  {
    id: 'stargazer-brief',
    title: 'Stargazer Brief',
    emoji: '🌠',
    tone: 'dreamy',
    encodedBody:
      'SSB0cmllZCB0byBtYXAgdGhlIHN0YXJzIGZyb20gdGhlIGZpcmUgZXNjYXBlIGJ1dCB0aGUgb25seSBjb25zdGVsbGF0aW9uIEkgcmVjb2duaXplIGxhdGVseSBpcyB0aGUgb25lIHNoYXBlZCBsaWtlIHlvdXIgc2hvdWxkZXJzLiBMZXQncyBsZWFybiB0aGVpciBwcm9wZXIgbmFtZXMgc29vbiwgYnV0IGZvciBub3cgSSdtIGZpbmUgY2FsbGluZyB0aGVtIGFmdGVyIHlvdS4=',
  },
  {
    id: 'echoed-recipe',
    title: 'Echoed Recipe',
    emoji: '🍰',
    tone: 'nostalgic',
    encodedBody:
      'R3JhbmRtYSBjYWxsZWQgdG8gYXNrIGlmIHdlIGV2ZXIgdXNlZCB0aGUgcmVjaXBlIGNhcmRzIHNoZSBtYWlsZWQ7IEkgdG9sZCBoZXIgd2UgcmVhZCB0aGVtIGxpa2UgcG9lbXMuIE9uZSBkYXkgd2UnbGwgYWN0dWFsbHkgYmFrZSB0aGUgY2FyZGFtb20gY2FrZSwgYnV0IHRvbmlnaHQgSSBqdXN0IHdhbnQgdG8gcmVhZCB0aGUgaW5zdHJ1Y3Rpb25zIGFsb3VkIHdpdGggeW91Lg==',
  },
  {
    id: 'serenade-receipt',
    title: 'Serenade Receipt',
    emoji: '🎻',
    tone: 'romantic',
    encodedBody:
      'VGhlcmUgaXMgc3RpbGwgYSBjcnVtcGxlZCByZWNlaXB0IGluIG15IGNvYXQgZnJvbSB0aGUgbmlnaHQgeW91IHN1cnByaXNlZCBtZSB3aXRoIHRoYXQgc3RyZWV0IG11c2ljaWFuLiBJIGNhbid0IHRocm93IGl0IGF3YXkgYmVjYXVzZSBpdCBydXN0bGVzIGxpa2UgYXBwbGF1c2Uu',
  },
  {
    id: 'meadow-signal',
    title: 'Meadow Signal',
    emoji: '🌼',
    tone: 'calm',
    encodedBody:
      'RXZlcnkgdGltZSBteSBwaG9uZSBidXp6ZXMgSSBpbWFnaW5lIGl0J3MgeW91IHNlbmRpbmcgYSBwaG90byBvZiBzb21ldGhpbmcgZ3JlZW4gYW5kIGdyb3dpbmcuIEtlZXAgZG9pbmcgdGhhdDsgaXQncyB0aGUgb25seSBub3RpZmljYXRpb24gdGhhdCBpbnN0YW50bHkgc2xvd3MgbXkgcHVsc2Uu',
  },
  {
    id: 'quiet-orbit',
    title: 'Quiet Orbit',
    emoji: '🌙',
    tone: 'soft',
    encodedBody:
      'V2UgbWFuYWdlZCBhIHdob2xlIGFmdGVybm9vbiB3aXRob3V0IG11c2ljLCB3aXRob3V0IHBvZGNhc3RzLCBqdXN0IHBlbmNpbHMgc2NyYXRjaGluZy4gU29tZWhvdyB0aGUgc2lsZW5jZSBzdGlsbCBmZWx0IGZ1bGwgYmVjYXVzZSB5b3Ugd2VyZSBvbiB0aGUgb3RoZXIgc2lkZSBvZiB0aGUgY291Y2gu',
  },
  {
    id: 'lullaby-draft',
    title: 'Lullaby Draft',
    emoji: '🎼',
    tone: 'tender',
    encodedBody:
      'VGhhbmsgeW91IGZvciBodW1taW5nIG5vbnNlbnNlIG1lbG9kaWVzIHdoZW4gbXkgYnJhaW4gcmVmdXNlcyB0byBzbGVlcC4gSSB3cm90ZSB0aGlzIHNvIHdlIHJlbWVtYmVyIHRoYXQgZXZlbiB1bmZpbmlzaGVkIHNvbmdzIGNvdW50IGFzIGNvbWZvcnQu',
  },
  {
    id: 'everglow-confetti',
    title: 'Everglow Confetti',
    emoji: '🎊',
    tone: 'joyful',
    encodedBody:
      'SWYgbG92ZSB3ZXJlIGNvbmZldHRpLCB3ZSdkIGJlIHZhY3V1bWluZyBmb3JldmVyLCBhbmQgaG9uZXN0bHkgSSdtIGZpbmUgd2l0aCB0aGF0LiBUaGFua3MgZm9yIHNoYWtpbmcgY29sb3Igb3ZlciBldmVyeSByb29tIHdlIHdhbGsgdGhyb3VnaC4=',
  },
]

function decode(payload: string) {
  if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    return window.atob(payload)
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(payload, 'base64').toString('utf-8')
  }
  throw new Error('No base64 decoder available')
}

export function revealLetterBody(letter: LetterDefinition) {
  if (decoderCache.has(letter.id)) {
    return decoderCache.get(letter.id) as string
  }
  const decoded = decode(letter.encodedBody)
  decoderCache.set(letter.id, decoded)
  return decoded
}

export function getLetterById(id: string) {
  return letterCatalog.find((letter) => letter.id === id)
}

export function getLetterSnippet(letter: LetterDefinition, slice = 120) {
  const body = revealLetterBody(letter)
  if (body.length <= slice) {
    return body
  }
  return `${body.slice(0, slice)}…`
}
