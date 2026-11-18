import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";
import { getBookingById } from "@/lib/store";
import BookingDetail from "@/components/admin/BookingDetail";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Same admin session as the rest of /admin. Signed-out visitors go to sign-in.
  if (!(await isAdmin())) {
    redirect(`/admin/login?next=${encodeURIComponent(`/admin/bookings/${id}`)}`);
  }

  const booking = await getBookingById(id);
  if (!booking) notFound();

  return <BookingDetail booking={booking} />;
}
