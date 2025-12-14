export default function FeedbackPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Feedback</h1>
        <p className="text-muted">
          Share your thoughts and help us improve the platform.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            Your Message
          </label>
          <textarea
            className="w-full h-32 rounded-lg bg-black/20 border border-white/10 p-3 text-sm text-main outline-none resize-none"
            placeholder="Tell us what you think..."
          />
        </div>

        <button className="btn-primary w-fit">
          Submit Feedback
        </button>
      </div>

    </div>
  );
}
