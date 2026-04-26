import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_RELEASE } from '../graphql/mutations';
import { GET_RELEASES } from '../graphql/queries';
import { useToast } from './Toast';

function getDefaultDateTimeValue(): string {
  const oneHourAhead = new Date(Date.now() + 60 * 60 * 1000);
  const timezoneOffset = oneHourAhead.getTimezoneOffset() * 60 * 1000;
  return new Date(oneHourAhead.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

interface CreateReleaseModalProps {
  onClose: () => void;
  onSuccess: (id: string) => void;
}

const CreateReleaseModal: React.FC<CreateReleaseModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState(getDefaultDateTimeValue());
  const [info, setInfo] = useState('');
  const [errors, setErrors] = useState<{name?: string, date?: string}>({});
  const { showToast } = useToast();

  const [createRelease, { loading }] = useMutation(CREATE_RELEASE, {
    refetchQueries: [{ query: GET_RELEASES }],
    onCompleted: (data) => {
      showToast({ message: 'Release created' });
      onSuccess(data.createRelease.id);
    },
    onError: () => {
      showToast({ message: 'Error creating', type: 'error' });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrs: {name?: string, date?: string} = {};
    if (!name.trim()) newErrs.name = 'Release name is required.';
    if (!date) newErrs.date = 'Release date is required.';
    
    if (Object.keys(newErrs).length > 0) {
      setErrors(newErrs);
      return;
    }

    createRelease({
      variables: {
        name: name.trim(),
        date: new Date(date).toISOString(),
        additionalInfo: info.trim() || null
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-4" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_32px_120px_rgba(15,23,42,0.24)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 pb-4 pt-6 sm:px-8 sm:pb-5 sm:pt-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Create release</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">Add a new release</h2>
            <p className="mt-2 text-sm text-slate-600">The checklist is created automatically and starts in planned status.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto overflow-x-hidden flex-1">
          <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-8 sm:py-6">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Release name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (errors.name) {
                    setErrors((currentErrors) => ({ ...currentErrors, name: undefined }));
                  }
                }}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-base"
                placeholder="e.g. Mobile release 2.4.0"
              />
              {errors.name && <p className="mt-1 text-xs font-medium text-rose-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Target date and time</label>
              <input 
                type="datetime-local" 
                value={date}
                onChange={e => {
                  setDate(e.target.value);
                  if (errors.date) {
                    setErrors((currentErrors) => ({ ...currentErrors, date: undefined }));
                  }
                }}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-base"
              />
              {errors.date && <p className="mt-1 text-xs font-medium text-rose-600">{errors.date}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-end justify-between">
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Additional information</label>
                <span className="text-[11px] font-medium text-slate-400">Optional</span>
              </div>
              <textarea 
                rows={4}
                value={info}
                onChange={e => setInfo(e.target.value)}
                className="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-base"
                placeholder="Rollout risks, links, or anything the release owner should know..."
              />
            </div>

            <div className="flex flex-col-reverse items-stretch justify-end gap-3 pt-2 sm:flex-row sm:items-center">
              <button 
                type="button" 
                onClick={onClose}
                className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="rounded-2xl bg-slate-950 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-300"
              >
                {loading ? 'Creating...' : 'Create Release'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReleaseModal;
