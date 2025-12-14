export default function TermsPage() {
  return (
    <div className="space-y-6">

      <div className="card p-6">
        <h1 className="text-3xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-muted">
          Please review the terms and conditions before using the platform.
        </p>
      </div>

      <div className="card p-6 space-y-4 text-sm leading-relaxed text-muted">
        <p>
          By accessing or using this platform, you agree to be bound by these
          Terms of Service and all applicable laws and regulations.
        </p>

        <p>
          Trading perpetual contracts involves significant risk and may not be
          suitable for all users. You are solely responsible for your trading
          decisions.
        </p>

        <p>
          The platform is provided on an “as is” and “as available” basis without
          warranties of any kind.
        </p>

        <p>
          These terms may be updated from time to time. Continued use of the
          platform constitutes acceptance of the revised terms.
        </p>
      </div>

    </div>
  );
}
