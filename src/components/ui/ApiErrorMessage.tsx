import { ApiRequestError, formatValidationDetails } from '@/api/client';

type ApiErrorMessageProps = {
  error: unknown;
};

export function ApiErrorMessage({ error }: ApiErrorMessageProps) {
  if (!error) return null;

  let msg = 'Erro inesperado.';
  let details = '';

  if (error instanceof ApiRequestError) {
    msg = error.message;
    details = formatValidationDetails(error.details);
  } else if (error instanceof Error) {
    msg = error.message;
  }

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
      {msg}{details ? ` — ${details}` : ''}
    </div>
  );
}
