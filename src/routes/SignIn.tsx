import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

export function SignIn() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ClerkSignIn routing="path" path="/sign-in" afterSignInUrl="/dashboard" />
    </div>
  );
}
