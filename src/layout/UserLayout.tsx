import useUserProfile from "@/hooks/useUserProfile";
import Loading from "@/lib/Loading";
import { Outlet, useParams } from "react-router-dom";

const UserLayout = () => {
  const { username } = useParams();
  const { isLoading, error, data } = useUserProfile(username);

  if (isLoading) {
    return <Loading hScreen={true} small={false} />;
  }

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <Outlet context={{ user: data }} />
    </>
  );
};

export default UserLayout;
