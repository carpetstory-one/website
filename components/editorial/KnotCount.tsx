import { useTranslations } from 'next-intl';

export function KnotCount() {
  const t = useTranslations('Knot');

  return (
    <section className="knot-section" aria-labelledby="knot-heading">
      <div className="knot-stage knot-stage-1">
        <span className="label">{t('label')}</span>
        <h3 id="knot-heading">{t('one')}</h3>
        <div className="dots-1"><span className="d"></span></div>
      </div>

      <div className="knot-stage knot-stage-2">
        <h3>{t('ten')}</h3>
        <div className="dots-10">
          <span className="d"></span><span className="d"></span><span className="d"></span><span className="d"></span><span className="d"></span>
          <span className="d"></span><span className="d"></span><span className="d"></span><span className="d"></span><span className="d"></span>
        </div>
      </div>

      <div className="knot-stage knot-stage-3">
        <h3>{t('hundred')}</h3>
        <p className="sub">{t('hundredSub')}</p>
        <div className="dots-100" id="dots-100"></div>
      </div>

      <div className="knot-stage knot-stage-4">
        <h3 data-countup="14400">0</h3>
        <p className="sub">{t('squareFootSub')}</p>
      </div>

      <div className="knot-stage knot-stage-5">
        <h3>
          <span data-countup="1152000">0</span><br />
          <span style={{ fontSize: '0.4em', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
            {t('rugSub')}
          </span>
        </h3>
      </div>

      <div className="knot-final">
        <div className="container">
          <span className="label">{t('finalLabel')}</span>
          <div className="big-num">
            {t('finalUpTo')} <span className="accent" data-countup="2257920" data-glow="true">0</span><br />
            {t('finalSuffix')}
          </div>
          <div className="knot-tagline">{t('tagline')}</div>
          <div className="knot-foot">
            <div>
              <div className="label">{t('density')}</div>
              <div className="val">{t('densityValue')}</div>
            </div>
            <div>
              <div className="label">{t('weaveTime')}</div>
              <div className="val">{t('weaveTimeValue')}</div>
            </div>
            <div>
              <div className="label">{t('madeBy')}</div>
              <div className="val">{t('madeByValue')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
