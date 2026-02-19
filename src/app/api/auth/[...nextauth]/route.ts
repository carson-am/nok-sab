import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials?.email === 'carson.moore@nokrecommerce.com' &&
          credentials?.password === 'XYZ'
        ) {
          return {
            id: '1',
            email: credentials.email,
          };
        }
        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
