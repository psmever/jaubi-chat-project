import { Prisma } from '../../generated/prisma/client.ts';

export function isPrismaKnownRequestError(
    error: unknown,
    code: string,
): error is Prisma.PrismaClientKnownRequestError {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

export function isPrismaUniqueConstraintError(
    error: unknown,
    expectedTargets?: string | readonly string[],
): error is Prisma.PrismaClientKnownRequestError {
    if (!isPrismaKnownRequestError(error, 'P2002')) {
        return false;
    }

    if (!expectedTargets) {
        return true;
    }

    const targets = Array.isArray(expectedTargets) ? expectedTargets : [expectedTargets];
    const errorTarget = error.meta?.target;
    const errorTargets = Array.isArray(errorTarget) ? errorTarget : [errorTarget];

    return targets.some((target) =>
        errorTargets.some((value) => typeof value === 'string' && value.includes(target)),
    );
}
