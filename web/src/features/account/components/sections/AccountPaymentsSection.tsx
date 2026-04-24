import { useTranslation } from 'react-i18next';

type AccountPaymentsSectionProps = {
  subscriptionTier?: string | null;
  email?: string | null;
};

export function AccountPaymentsSection({
  subscriptionTier,
  email,
}: AccountPaymentsSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
      <h3 className="text-xl font-semibold text-white">{t('account.payments.title')}</h3>

      <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">{t('account.payments.subscriptionType')}</p>
        <p className="mt-1 text-sm font-medium text-white">{subscriptionTier || t('account.payments.defaultSubscription')}</p>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-white mb-2">{t('account.payments.paymentMethods')}</h4>
        <div className="space-y-2">
          <div className="rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-2.5 text-sm text-slate-200">
            Visa **** 4242 ({t('account.payments.defaultMethod')})
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-800/30 px-4 py-2.5 text-sm text-slate-200">
            PayPal - {email || 'usuario@email.com'}
          </div>
          <button className="rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100 hover:bg-indigo-500/20 transition-colors">
            {t('account.payments.addMethod')}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-800/20 p-4">
        <h4 className="text-sm font-semibold text-white mb-2">{t('account.payments.subscriptionInfo')}</h4>
        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
          <li>{t('account.payments.benefitEarlyAccess')}</li>
          <li>{t('account.payments.benefitLeagues')}</li>
        </ul>
      </div>

      <p className="text-xs text-slate-500">{t('account.payments.renewalNote')}</p>
    </section>
  );
}
