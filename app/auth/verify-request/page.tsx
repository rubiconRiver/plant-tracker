export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Branding Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">📧</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Check Your Email</h1>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Magic link sent!
          </h2>
          
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a sign-in link to your email address.
            Click the link to sign in to your account.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> The link will expire in 24 hours.
              If you don&apos;t see the email, check your spam folder.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            <p>Didn&apos;t receive the email?</p>
            <a href="/auth/signin" className="text-green-600 hover:text-green-700 font-medium">
              Try again
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            You can close this window once you&apos;ve clicked the link in your email.
          </p>
        </div>
      </div>
    </div>
  )
}