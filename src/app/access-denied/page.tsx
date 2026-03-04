export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card max-w-lg w-full rounded-xl border border-white/10 p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">
          Access Restricted
        </h1>
        <p className="text-slate-300 mb-4">
          This area is restricted to Strategic Advisory Board members.
        </p>
        <p className="text-sm text-slate-500">
          If you believe you should have access, please contact the Nok team to
          update your advisor permissions.
        </p>
      </div>
    </div>
  );
}

