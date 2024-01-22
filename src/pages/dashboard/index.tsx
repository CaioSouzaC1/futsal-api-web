import AppLayout from "@/_layouts/app";
import Header from "@/components/header";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession();

  return (
    <main>
      <AppLayout>
        <Header name={session.data?.user?.name!} />
        <div className="p-4"> {session.data?.user?.name}</div>
      </AppLayout>
    </main>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
    return {
      props: {
        session,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        session: null,
      },
    };
  }
};
