import { createClient } from "@/lib/supabase/server";
import ResponsiveSinglepage from "@/components/responsive-singlepage";

export default async function Page() {
  const supabase = await createClient();
  
  const { data: teamMembers, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });

  return <ResponsiveSinglepage teamMembers={teamMembers || []} />;
}
