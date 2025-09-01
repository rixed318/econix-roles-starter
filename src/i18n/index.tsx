import React, { createContext, useContext, useState } from 'react'
import en from './en'
import ru from './ru'

const dictionaries = { en, ru }
export type Locale = keyof typeof dictionaries

interface Ctx {
  locale: Locale
  t: (key: keyof typeof en) => string
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<Ctx | null>(null)

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('ru')
  const t = (key: keyof typeof en) => dictionaries[locale][key]
  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n outside provider')
  return ctx
}
