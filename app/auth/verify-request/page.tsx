export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="mb-4 text-2xl font-bold">Check Your Email</h1>
        
        <p className="mb-6 text-gray-600">
          A sign-in link has been sent to your email address.
        </p>

        <p className="text-sm text-gray-500">
          Click the link in the email to sign in to your account.
        </p>
      </div>
    </div>
  )
}