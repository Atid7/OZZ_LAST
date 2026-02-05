import { fetchMenu } from "@/lib/api";
import { MenuPageClient } from "@/components/menu/menu-page-client";
import { ErrorPage } from "@/components/error-page";
import { notFound } from "next/navigation";

export const metadata = {
    title: "Menu",
    description: "Explore our menu",
};

// Revalidate every 5 minutes
export const revalidate = 300;

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function MenuPage({ params }: PageProps) {
    // ✅ unwrap params
    const { slug } = await params;

    // Reject slugs that look like files (contain file extensions)
    if (/\.(png|jpg|jpeg|gif|svg|ico|css|js|json|xml|txt|pdf)$/i.test(slug)) {
        notFound();
    }

    try {
        const menu = await fetchMenu(slug);

        return (
            <MenuPageClient
                restaurant={menu.restaurant}
                categories={menu.categories}
                menuItems={menu.items}
            />
        );
    } catch (error) {
        console.error('Menu page error:', error);
        return <ErrorPage error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
    }
}
