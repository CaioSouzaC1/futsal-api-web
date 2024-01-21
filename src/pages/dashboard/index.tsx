import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";

const Dashboard = () => {
  const session = useSession();

  console.log(session);

  return <main>{session.data?.user?.name}</main>;
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
