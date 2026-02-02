export default function WhoIsNokView() {
  return (
    <div className="space-y-6">
      {/* Body Text */}
      <div className="space-y-4 text-lg leading-relaxed text-slate-100">
        <p>
          Nok is a recommerce and reverse logistics platform that helps brands turn returns, excess inventory, and used products into value-generating assets. We enable brands to manage the full lifecycle of returned goods—from intake and inspection to refurbishment, resale, recycling, or responsible disposition—while improving margins, visibility, and sustainability.
        </p>
        <p>
          Traditional reverse logistics are fragmented, costly, and opaque. Nok replaces this with a flexible, data-driven model that allows brands to make smarter, faster decisions about where products should go and how much value can be recovered—without compromising brand equity.
        </p>
      </div>

      {/* Sectioned Lists */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* What Nok Does */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">What Nok Does</h3>
          <ul className="space-y-3 text-slate-100 leading-relaxed">
            <li className="flex items-start">
              <span className="text-nok-blue mr-2">•</span>
              <span>Manages end-to-end reverse logistics and recommerce workflows</span>
            </li>
            <li className="flex items-start">
              <span className="text-nok-blue mr-2">•</span>
              <span>Supports refurbishment, certified resale, secondary marketplace distribution, donation, and recycling</span>
            </li>
            <li className="flex items-start">
              <span className="text-nok-blue mr-2">•</span>
              <span>Aligns recovery strategies with brand goals, product categories, and operational realities</span>
            </li>
          </ul>
        </div>

        {/* What Makes Nok Different */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">What Makes Nok Different</h3>
          <ul className="space-y-3 text-slate-100 leading-relaxed">
            <li className="flex items-start">
              <span className="text-nok-blue mr-2">•</span>
              <span><strong>Decision-driven, not just logistics:</strong> Focused on intelligence and optimization, not only execution</span>
            </li>
            <li className="flex items-start">
              <span className="text-nok-blue mr-2">•</span>
              <span><strong>Modular and brand-aligned:</strong> No one-size-fits-all resale model</span>
            </li>
            <li className="flex items-start">
              <span className="text-nok-blue mr-2">•</span>
              <span><strong>Built for scale:</strong> Designed to support growing return volumes and long-term recommerce programs</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Mission */}
      <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
        <p className="text-slate-200 italic text-lg leading-relaxed">
          Why Nok Exists: To make recommerce economically rational, operationally feasible, and strategically aligned.
        </p>
        <p className="text-slate-200 italic text-lg leading-relaxed">
          To help brands participate in the circular economy without sacrificing margins or control.
        </p>
      </div>
    </div>
  );
}
