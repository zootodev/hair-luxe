import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/data/services";
import { getVisibleServiceById, getVisibleServices } from "@/lib/catalog";
import { BUSINESS, SITE_URL } from "@/lib/config";
import ServiceDetailClient from "@/components/services/ServiceDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getVisibleServiceById(slug);
  if (!service) {
    return { title: `Service Not Found | ${BUSINESS.name}` };
  }
  return {
    title: `${service.name} | ${BUSINESS.name}`,
    description: service.description,
    alternates: {
      canonical: `/services/${service.id}`,
    },
    openGraph: {
      title: `${service.name} | ${BUSINESS.name}`,
      description: service.description,
      url: `${SITE_URL}/services/${service.id}`,
      type: "website",
      images: [{ url: service.image }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getVisibleServiceById(slug);

  if (!service) {
    notFound();
  }

  const allServices = await getVisibleServices();
  const related = allServices.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-sm text-muted flex items-center gap-2">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-gold transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-gold">{service.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface border border-surface-light">
            <Image
              src={service.image}
              alt={service.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <ServiceDetailClient service={service} />
        </div>

        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-8 text-center">
            Explore Other Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((s) => (
              <Link
                key={s.id}
                href={`/services/${s.id}`}
                className="group flex items-center gap-4 rounded-2xl bg-surface border border-surface-light p-4 hover:border-gold/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-light shrink-0">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-semibold truncate group-hover:text-gold transition-colors">
                    {s.name}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {s.priceRange} &middot; {s.duration}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}