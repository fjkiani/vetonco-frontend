import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

export function SignUp() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <ClerkSignUp routing="path" path="/sign-up" afterSignUpUrl="/dashboard" />
    </div>
  );
}
