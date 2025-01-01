import { prisma } from "@/lib/db";

export const getUserCountsByRole = async () => {
  const roleCounts = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true,
    },
  });

  const result = roleCounts.reduce(
    (acc, { role, _count }) => {
      acc[role] = _count.role;
      return acc;
    },
    {} as Record<string, number>,
  );

  return result;
};

export const getAdminStatistics = async () => {
  const userRoles = await getUserCountsByRole();
};
