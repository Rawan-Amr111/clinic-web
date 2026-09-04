import { createClient } from "npm:@supabase/supabase-js@2";

interface LoginRequest {
  username: string;
  password: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export default {
  async fetch(req: Request): Promise<Response> {
    if (req.method === "OPTIONS") {
      return new Response("ok", {
        headers: corsHeaders,
      });
    }

    try {
      const { username, password }: LoginRequest = await req.json();

      if (!username || !password) {
        return Response.json(
          { error: "Username and password are required" },
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }

      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      const { data: profile, error: profileError } = await adminClient
        .from("profiles")
        .select("id, username, name, role")
        .eq("username", username)
        .single();

      if (profileError || !profile) {
        return Response.json(
          { error: "Invalid username or password" },
          {
            status: 401,
            headers: corsHeaders,
          },
        );
      }

      const {
        data: { user },
        error: userError,
      } = await adminClient.auth.admin.getUserById(profile.id);

      if (userError || !user?.email) {
        return Response.json(
          { error: "User not found" },
          {
            status: 401,
            headers: corsHeaders,
          },
        );
      }

      const authClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
      );

      const { data: loginData, error: loginError } =
        await authClient.auth.signInWithPassword({
          email: user.email,
          password,
        });

      if (loginError) {
        return Response.json(
          { error: "Invalid username or password" },
          {
            status: 401,
            headers: corsHeaders,
          },
        );
      }

      return Response.json(
        {
          user: loginData.user,
          session: loginData.session,
          profile,
        },
        {
          headers: corsHeaders,
        },
      );
    } catch (error) {
      console.error(error);

      return Response.json(
        { error: "Something went wrong" },
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }
  },
};
