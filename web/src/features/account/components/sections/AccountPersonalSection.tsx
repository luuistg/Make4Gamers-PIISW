import type { ChangeEvent, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, Camera, Check, Edit2, X, Save } from 'lucide-react';
import AvatarPlaceholder from '../../../../shared/components/AvatarPlaceholder';

type ProfileDetails = {
  avatar_url: string | null;
  username: string | null;
  status: string | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  birth_date?: string | null;
  subscription_tier?: string | null;
  role?: string | null;
};

type DeveloperRequestSummary = {
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  created_at: string;
};

type AccountPersonalSectionProps = {
  profile: ProfileDetails;
  uploadingAvatar: boolean;
  isEditingName: boolean;
  editNameValue: string;
  savingName: boolean;
  fileInputRef: Ref<HTMLInputElement>;
  onOpenAvatarPolicy: () => void;
  onUploadAvatar: (event: ChangeEvent<HTMLInputElement>) => void;
  onEditNameValueChange: (value: string) => void;
  onEnableNameEdit: () => void;
  onCancelNameEdit: () => void;
  onSaveUsername: () => void;
  onStatusChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  developerRequest: DeveloperRequestSummary | null;
  creatingDeveloperRequest: boolean;
  cancellingDeveloperRequest: boolean;
  onOpenDeveloperRequestModal: () => void;
  onCancelDeveloperRequest: () => void;
};

export function AccountPersonalSection({
  profile,
  uploadingAvatar,
  isEditingName,
  editNameValue,
  savingName,
  fileInputRef,
  onOpenAvatarPolicy,
  onUploadAvatar,
  onEditNameValueChange,
  onEnableNameEdit,
  onCancelNameEdit,
  onSaveUsername,
  onStatusChange,
  developerRequest,
  creatingDeveloperRequest,
  cancellingDeveloperRequest,
  onOpenDeveloperRequestModal,
  onCancelDeveloperRequest,
}: AccountPersonalSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="h-full bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

      <div className="relative flex flex-col xl:flex-row items-start xl:items-center gap-6 mb-6">
        <div className="relative group shrink-0">
          <div className={`w-24 h-24 bg-slate-800 border-2 rounded-full flex items-center justify-center overflow-hidden shadow-lg ${profile.subscription_tier === 'premium' ? 'border-yellow-500 shadow-yellow-500/50' : 'border-indigo-500'}`}>
            {uploadingAvatar ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
            ) : profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <AvatarPlaceholder name={profile.username ?? "U"} size={96} />
            )}
          </div>

          <button
            title="Cambiar foto de perfil"
            onClick={onOpenAvatarPolicy}
            disabled={uploadingAvatar}
            className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-indigo-500"
          >
            <Camera size={24} className="text-white" />
          </button>
        </div>

        <input
          title="Subir nueva foto de perfil"
          type="file"
          id="avatarSingle"
          accept="image/*"
          onChange={onUploadAvatar}
          ref={fileInputRef}
          disabled={uploadingAvatar}
          className="hidden"
        />

        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => onEditNameValueChange(e.target.value)}
                placeholder="Escribe tu nuevo nombre..."
                className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <button
                onClick={onSaveUsername}
                disabled={savingName}
                className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors"
                title="Guardar"
              >
                {savingName ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Check size={20} />}
              </button>
              <button
                onClick={onCancelNameEdit}
                className="p-1.5 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/30 transition-colors"
                title="Cancelar"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-3 group">
              <h1 className="text-3xl font-bold text-white truncate">
                {profile.username || t('account.personal.noUsername')}
              </h1>
              
              {profile.subscription_tier === 'premium' && (
                <span title="Usuario Premium" className="flex items-center">
                  <Save 
                    size={28} 
                    className="text-yellow-500 fill-yellow-500/20 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] shrink-0 animate-pulse" 
                  />
                </span>
              )}

              <button
                onClick={onEnableNameEdit}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-all opacity-0 group-hover:opacity-100"
                title="Editar nombre"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Activity size={16} /> Estado:
            </span>
            <select
              title="Seleccionar estado de conexion"
              value={profile.status || 'Disponible'}
              onChange={onStatusChange}
              className="bg-slate-800/80 text-white border border-slate-700 rounded-md px-2 py-1 outline-none focus:border-indigo-500 cursor-pointer text-sm"
            >
              <option value="Disponible">Disponible</option>
              <option value="Ausente">Ausente</option>
              <option value="Ocupado">Ocupado</option>
              <option value="Invisible">Invisible</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
          <p className="mt-1 text-sm text-white break-all">{profile.email || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Usuario</p>
          <p className="mt-1 text-sm text-white">{profile.username || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Nombre</p>
          <p className="mt-1 text-sm text-white">{profile.first_name || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Apellido</p>
          <p className="mt-1 text-sm text-white">{profile.last_name || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Fecha de nacimiento</p>
          <p className="mt-1 text-sm text-white">{profile.birth_date || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Rol</p>
          <p className="mt-1 text-sm text-white">{profile.role || t('account.personal.notDefined')}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/30 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Tipo de suscripcion</p>
          <p className="mt-1 text-sm text-white">{profile.subscription_tier || t('account.personal.notDefined')}</p>
        </div>
      </div>

      {profile.role !== 'developer' && profile.role !== 'admin' && (
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
          <h3 className="text-base font-semibold text-white">Solicitud de rol developer</h3>
          <p className="mt-1 text-sm text-slate-400">
            Envia una solicitud para acceder al rol de developer.
          </p>

          {developerRequest && (
            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm">
              <span className="text-slate-300">Estado actual: </span>
              <span
                className={
                  developerRequest.estado === 'aceptada'
                    ? 'text-emerald-400'
                    : developerRequest.estado === 'rechazada'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                }
              >
                {developerRequest.estado}
              </span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {developerRequest?.estado === 'pendiente' ? (
              <button
                type="button"
                onClick={onCancelDeveloperRequest}
                disabled={cancellingDeveloperRequest}
                className="w-fit rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancellingDeveloperRequest ? 'Cancelando...' : 'Cancelar solicitud'}
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenDeveloperRequestModal}
                disabled={creatingDeveloperRequest}
                className="w-fit rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creatingDeveloperRequest ? 'Enviando...' : 'Solicitar rol developer'}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
