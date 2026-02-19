import { fromNodeHeaders } from "better-auth/node";
import { AuthType } from "src/modules/auth/auth.provider";
import { PrismaService } from "src/modules/database/prisma.service";

export async function verifySession(
	auth: AuthType,
	prisma: PrismaService,
	headers: any
) {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(headers),
	});

	if (!session?.user) {
		return null;
	}

	const tenantId = headers["x-tenant-id"] as string;

	const [barber, userTenant] = await Promise.all([
		prisma.barber.findFirst({
			where: { userId: session.user.id },
		}),
		tenantId
			? prisma.tenant.userTenant.findUnique({
					where: {
						userId_tenantId: {
							userId: session.user.id,
							tenantId: tenantId,
						},
					},
				})
			: null,
	]);

	return {
		id: session.user.id,
		email: session.user.email,
		name: session.user.name,
		image: session.user.image,
		role: userTenant?.role || "user",
		// stripeCustomerId: session.user.stripeCustomerId,
		tenantId,
		sessionId: session.session,
		barberId: barber?.id || null,
	};
}
