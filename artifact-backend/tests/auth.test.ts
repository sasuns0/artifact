import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import 'dotenv/config';
import authRoutes from '../routes/auth-route';
import { db } from '../db';
import { usersTable, refreshTokensTable } from '../db/schema/schema';
import { eq } from 'drizzle-orm';

function buildTestApp() {
  const app = fastify();

  app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET!,
  });

  app.register(fastifyCookie);

  app.setErrorHandler((_error, _request, reply) => {
    reply.status(500).send({ ok: false });
  });

  app.register(authRoutes);

  return app;
}

describe('Auth routes', () => {
  let app: ReturnType<typeof buildTestApp>;
  const username = `testuser_${Date.now()}`;
  const password = 'testpassword123';

  beforeAll(async () => {
    app = buildTestApp();
    await app.ready();
  });

  afterAll(async () => {
    // Clean up test user and refresh tokens
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, username),
    });

    if (user) {
      await db.delete(refreshTokensTable).where(eq(refreshTokensTable.userId, user.id));
      await db.delete(usersTable).where(eq(usersTable.id, user.id));
    }

    await app.close();
  });

  describe('POST /signup', () => {
    it('creates a new user and returns username', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/signup',
        payload: { username, password },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.status).toBe(200);
      expect(body.data.username).toBe(username);
    });

    it('fails when username already exists', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/signup',
        payload: { username, password },
      });

      expect(res.statusCode).toBe(500);
      const body = JSON.parse(res.payload);
      expect(body.ok).toBe(false);
      expect(body.message).toBe('User with this username exists');
    });
  });

  describe('POST /signin', () => {
    it('sets HttpOnly auth cookies on valid credentials', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/signin',
        payload: { username, password },
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.payload);
      expect(body.status).toBe(200);

      const cookies = res.cookies;
      expect(cookies.length).toBeGreaterThanOrEqual(2);

      const accessCookie = cookies.find((c) => c.name === 'access_token');
      const refreshCookie = cookies.find((c) => c.name === 'refresh_token');

      expect(accessCookie, 'access_token cookie not set').toBeDefined();
      expect(accessCookie!.httpOnly).toBe(true);
      expect(accessCookie!.sameSite?.toLowerCase()).toBe('strict');
      expect(accessCookie!.path).toBe('/');

      expect(refreshCookie, 'refresh_token cookie not set').toBeDefined();
      expect(refreshCookie!.httpOnly).toBe(true);
      expect(refreshCookie!.sameSite?.toLowerCase()).toBe('strict');
      expect(refreshCookie!.path).toBe('/refresh');

      // Verify refresh token was persisted in the database
      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.username, username),
      });
      expect(user).toBeDefined();

      const storedToken = await db.query.refreshTokensTable.findFirst({
        where: eq(refreshTokensTable.userId, user!.id),
      });
      expect(storedToken).toBeDefined();
      expect(storedToken!.token).toBe(refreshCookie!.value);
    });

    it('returns 401 on wrong password', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/signin',
        payload: { username, password: 'wrongpassword' },
      });

      expect(res.statusCode).toBe(401);
      const body = JSON.parse(res.payload);
      expect(body.ok).toBe(false);
      expect(body.message).toBe('Wrong password');
    });

    it('returns error for non-existent user', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/signin',
        payload: { username: 'doesnotexist', password },
      });

      expect(res.statusCode).toBe(500);
      const body = JSON.parse(res.payload);
      expect(body.ok).toBe(false);
      expect(body.message).toBe("User with this username don't exist");
    });
  });

  describe('POST /logout', () => {
    it('clears auth cookies and removes refresh token from database', async () => {
      // Sign in to get cookies
      const signinRes = await app.inject({
        method: 'POST',
        url: '/signin',
        payload: { username, password },
      });

      const cookies = signinRes.cookies
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');

      const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.username, username),
      });
      expect(user).toBeDefined();

      // Confirm refresh token exists before logout
      let storedToken = await db.query.refreshTokensTable.findFirst({
        where: eq(refreshTokensTable.userId, user!.id),
      });
      expect(storedToken).toBeDefined();

      // Call logout with cookies
      const logoutRes = await app.inject({
        method: 'POST',
        url: '/logout',
        headers: { cookie: cookies },
      });

      expect(logoutRes.statusCode).toBe(200);

      const clearedCookies = logoutRes.cookies;
      const clearedAccess = clearedCookies.find((c) => c.name === 'access_token');
      const clearedRefresh = clearedCookies.find((c) => c.name === 'refresh_token');

      expect(clearedAccess).toBeDefined();
      expect(
        clearedAccess!.maxAge ?? clearedAccess!.expires?.getTime()
      ).toBe(0);

      expect(clearedRefresh).toBeDefined();
      expect(
        clearedRefresh!.maxAge ?? clearedRefresh!.expires?.getTime()
      ).toBe(0);

      // Confirm refresh token was removed from database
      storedToken = await db.query.refreshTokensTable.findFirst({
        where: eq(refreshTokensTable.userId, user!.id),
      });
      expect(storedToken).toBeUndefined();
    });
  });
});
