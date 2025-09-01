import React from 'react'

export default function Guide() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Как выбрать IT-направление за 10 минут</h1>
      <section className="card space-y-2">
        <h2 className="font-semibold">1) Быстро пойми роли</h2>
        <p className="text-sm text-gray-700">
          Frontend — интерфейсы; Backend — серверная логика; Data/ML — данные и модели; DevOps/SRE — стабильность и автоматизация;
          Security — защита; Mobile — приложения. Открой карточки ролей и прочитай «Что делает», «Где растёт», «Сложность входа».
        </p>
      </section>
      <section className="card space-y-2">
        <h2 className="font-semibold">2) Сравни зарплаты по странам</h2>
        <p className="text-sm text-gray-700">
          На странице <a className="underline" href="#compare-plus">Compare+</a> смотри P10/P50/P90.
          P50 — медиана, P10/P90 — нижний/верхний дециль. Мы нормируем к ≈ USD/мес по курсу ECB.
        </p>
      </section>
      <section className="card space-y-2">
        <h2 className="font-semibold">3) Пройди быстрый визард</h2>
        <p className="text-sm text-gray-700">
          На <a className="underline" href="#wizard">Wizard</a> отметь предпочтения (веб/данные/бэкенд/мобайл, математика, фокус на зарплате) — получишь 2–4 конкретные роли.
        </p>
      </section>
      <section className="card space-y-2">
        <h2 className="font-semibold">4) План действий на 30 дней</h2>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          <li>Неделя 1: основы и «Hello, world». </li>
          <li>Неделя 2: мини-проект (ToDo, парсер, дашборд).</li>
          <li>Неделя 3: углубление (тесты, деплой, CI).</li>
          <li>Неделя 4: портфолио + резюме + 2 улучшения проекта.</li>
        </ul>
      </section>
      <p className="text-xs text-gray-500">
        Данные — официальные источники (BLS, ONS, Eurostat) + нормализация по ECB. Это ориентиры, сверяйте с первоисточниками.
      </p>
    </div>
  )
}
