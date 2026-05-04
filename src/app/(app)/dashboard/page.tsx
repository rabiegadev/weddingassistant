import { redirect } from "next/navigation";
import { defaultDashboardPath } from "@/lib/client-dashboard-menu";

export default async function DashboardPage() {
  redirect(defaultDashboardPath());
}
