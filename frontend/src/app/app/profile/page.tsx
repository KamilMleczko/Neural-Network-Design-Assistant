import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get user on the server side
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto mt-8 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 font-bold text-2xl">Profile (Server-Side)</h1>
      <div className="space-y-2">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>User ID:</strong> {user.id}
        </p>
        <p>
          <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Last Sign In:</strong>{" "}
          {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
        </p>
      </div>
    </div>
  );
}
