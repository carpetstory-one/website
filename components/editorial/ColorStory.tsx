import { useTranslations } from 'next-intl';

export function ColorStory() {
  const t = useTranslations('ColorStory');

  const skeins = [
    {
      rate: '0.18',
      cls: 'skein-1',
      labelCls: 'skein-label-1',
      key: 'skein1' as const,
    },
    {
      rate: '0.32',
      cls: 'skein-2',
      labelCls: 'skein-label-2',
      key: 'skein2' as const,
    },
    {
      rate: '0.10',
      cls: 'skein-3',
      labelCls: 'skein-label-3',
      key: 'skein3' as const,
    },
    {
      rate: '0.40',
      cls: 'skein-4',
      labelCls: 'skein-label-4',
      key: 'skein4' as const,
    },
    {
      rate: '0.22',
      cls: 'skein-5',
      labelCls: 'skein-label-5',
      key: 'skein5' as const,
    },
    {
      rate: '0.28',
      cls: 'skein-6',
      labelCls: 'skein-label-6',
      key: 'skein6' as const,
    },
  ];

  return (
    <section className="color-story" aria-labelledby="color-story-heading">
      <div className="thread-canvas-wrap" data-thread-host="colorstory"></div>

      <div className="header">
        <span className="label slide-l">{t('label')}</span>
        <h2
          id="color-story-heading"
          className="slide-r"
          style={{ '--delay': '100ms' } as React.CSSProperties}
        >
          {t('headlineStart')} <span className="it">{t('headlineItalic')}</span>{' '}
          {t('headlineEnd')}
        </h2>
      </div>

      <div className="skeins-stage" id="skeins-stage">
        {skeins.map((s) => (
          <div key={s.cls} className="contents">
            <div
              className={`skein ${s.cls} parallax-scroll`}
              data-rate={s.rate}
              aria-hidden="true"
            ></div>
            <span
              className={`skein-label ${s.labelCls} parallax-scroll`}
              data-rate={s.rate}
            >
              {t(s.key)}
            </span>
          </div>
        ))}
      </div>

      <div className="color-story-footer">
        <p className="reveal">{t('footer')}</p>
      </div>
    </section>
  );
}
