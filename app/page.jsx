import Link from "next/link";

export default function Page() {
  return (
    <>
      <p className="text-center text-2xl text-gray-600 mb-5">
        Don&apos;t have an account? <strong>Create One</strong>
      </p>
      <form action="." className="max-w-xs mx-auto">
        <div className="mb-3">
          <input name="username" autoComplete="off" type="text" placeholder="Username" className="input" />
        </div>
        <div className="mb-3">
          <input name="password" autoComplete="off" type="password" placeholder="Password" className="input" />
        </div>

        <button className="btn btn-primary">Create Account</button>
      </form>
    </>
  );
}
