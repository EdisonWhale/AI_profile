import { LockKeyhole } from "lucide-react";
import { loginTracking } from "../actions";

export const fetchCache = "force-no-store";

export default async function TrackingLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const hasError = (await searchParams).error === "1";
  return (
    <div className="tracking-shell tracking-login-shell">
      <section className="tracking-login-panel" aria-labelledby="tracking-login-title">
        <div className="tracking-login-mark" aria-hidden="true"><LockKeyhole size={19} strokeWidth={1.6} /></div>
        <p className="tracking-eyebrow">PRIVATE AREA</p>
        <h1 id="tracking-login-title">Analytics access</h1>
        <p className="tracking-login-copy">Enter the owner password to view visitor activity.</p>
        <form action={loginTracking} className="tracking-login-form">
          <label htmlFor="tracking-password">Password</label>
          <input id="tracking-password" name="password" type="password" autoComplete="current-password" required autoFocus />
          {hasError ? <p className="tracking-form-error" role="alert">Unable to sign in. Check the password and try again.</p> : null}
          <button type="submit" className="tracking-primary-button">Continue</button>
        </form>
      </section>
    </div>
  );
}
