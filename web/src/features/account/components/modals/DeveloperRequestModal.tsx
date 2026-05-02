type DeveloperRequestModalProps = {
  title: string;
  reason: string;
  creating: boolean;
  onTitleChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function DeveloperRequestModal({
  title,
  reason,
  creating,
  onTitleChange,
  onReasonChange,
  onClose,
  onSubmit,
}: DeveloperRequestModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in">
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-2xl font-bold text-white">Solicitud de rol developer</h3>
          <p className="mt-1 text-sm text-slate-400">Completa titulo y motivo para enviar tu solicitud.</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Titulo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              maxLength={80}
              placeholder="Quiero aportar al proyecto"
              className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Motivo</label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Explica por que quieres el rol developer"
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={creating}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </div>
    </div>
  );
}
