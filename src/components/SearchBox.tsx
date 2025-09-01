import React from 'react'
import { useStore } from '../core/store'
import { useI18n } from '../i18n'
import { FocusTrap } from '../core/FocusTrap'

export const SearchBox: React.FC = () => {
  const query = useStore(s => s.query)
  const setQuery = useStore(s => s.setQuery)
  const { t } = useI18n()
  return (
    <FocusTrap>
      <input
        role="searchbox"
        aria-label={t('searchPlaceholder')}
        placeholder={t('searchPlaceholder')}
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
    </FocusTrap>
  )
}
