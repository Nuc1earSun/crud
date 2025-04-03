import RegisterForm from "../components/RegisterForm";
import { getUserFromCookie } from "../lib/getUser";

export default async function Page() {
  const user = await getUserFromCookie();
  return (
    <>
      {user && (
        <p className="text-center text-2xl text-gray-600 mb-5">
          Hello!
        </p>
      )}
      {!user && (
        <>
          <p className="text-center text-2xl text-gray-600 mb-5">
            Don&apos;t have an account? <strong>Create One</strong>
          </p>
          <RegisterForm />
        </>
      )}
    </>
  );
}
